'use strict';

const TIMESTAMP = 'Time-stamp: <2019-11-15 22:10:22 umrigar>';

const {ChoiceQuestion, Rand, umtParse, emacsTimestampToMillis} =
      require('gen-q-and-a');

const { permutations, specToText, specToDecl, isErrorDecl } =
  require('./decl-util');

class DescToDecl extends ChoiceQuestion {

  constructor(params) {
    super(params);
    this.addParamSpec(PARAMS);
    this.addQuestion(QUESTION);
    for (let i = 0; i < 4; i++) {
      this.choice(({decls}) => `.~${decls[i]}~.`);
    }
    this.choice({ choiceFn: () => SEMANTIC_ERROR, pos: -1 });
    this.freeze();
    this.addExplain(explain(this));
    this.makeContent();
  }

  answerIndex() {
    return (this.params.errors[0]) ? 4 : 0;
  }
  
}

module.exports = DescToDecl;
Object.assign(DescToDecl, {
  id: 'descToDecl',
  title: 'Description to Declaration',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const QUESTION = `
  Which of the following C declarations declares \`#{name}\` 
  such that #{texts[0]}?

  If the description does not make semantic sense, then choose (e).
`;

const SEMANTIC_ERROR = 'The description is semantically incorrect.';

const BASES = [
  'char', 
  'short', 'short',
  'int', 'unsigned',
  'long',
  'float', 'double',
];

const TYPES = [
  'afp',  //err
  'apa',  //ok
  'apf',  //ok
  'apfp', //ok
  'papf', //ok
  'pap',  //ok
  'pfa',  //err
  'pff',  //err
];

const PARAMS = [
  { base: () => Rand.choice(BASES),
    n: () => Rand.choice([4, 8, 16, 32, 64]),
    type: () => Rand.choice(TYPES),
    name: () => Rand.choice(['x', 'x', 'y', 'z']),
  },
  { specs: ({type}) =>
            [type].concat(Rand.choices(3, permutations(type).slice(1))),
  },
  { _type: 'nonRandom',
    decls: ({base, name, n, specs}) =>
       specs.map(spec => specToDecl(name, base, spec, n)), 
    texts: ({base, name, n, specs}) =>
       specs.map(spec => specToText(name, base, spec, n)),
    errors: ({specs}) => specs.map(spec => isErrorDecl(spec)),
  },
];


function explain(question) {
  const {errors, decls, texts} = question.params;
  let text = '';
  if (errors[0]) {
    text += `
      (#{_4}) is correct.  Even though choice (#{_0}) ${texts[0]}
      is syntactically equivalent to .~${decls[0]}~, but ${errors[0]}
      and the declaration is semantically incorrect.
    `;
  }
  else {
    text += `
      (#{_0}) is correct.  .~${decls[0]}~ means that
      ${texts[0]} and that declaration is semantically meaningful.
    `;
  }
  text += '\n\n';
  for (const i of question.choiceOrder()) {
    if (i === 0 || i === question.nChoices() - 1) {
      continue; //skip possible answer and semantic error
    }
    text += `
      (#{_${i}}) is incorrect.  The declaration .~${decls[i]}~ would 
      correspond to the description ${texts[i]}.      
    `;
    if (errors[i]) {
      text += ` 
        (Note that this declaration is not semantically meaningful 
         since ${errors[i]}.)
      `;
    }
    text += '\n\n';
  }
  return text;
}

if (process.argv[1] === __filename) {
  console.log(new DescToDecl().qaText());
}
