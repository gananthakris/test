'use strict';

const TIMESTAMP = 'Time-stamp: <2024-09-05 17:06:04 umrigar>';

const {ChoiceQuestion, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class Sizeof extends ChoiceQuestion {

  constructor(params) {
    super(params);
    this.addParamSpec(PARAMS);
    this.addQuestion(QUESTION);
    for (let i = 0; i < 5; i++) {
      this.choice(({sizeChoices}) => `\`${sizeChoices[i]}\`.`);
    }
    this.freeze();
    this.addExplain(explain(this.params));
    this.makeContent();
  }

}

module.exports = Sizeof;
Object.assign(Sizeof, {
  id: 'sizeof',
  title: 'Size of a Structure',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const QUESTION = `
  Assume that pointers and .~long~'s occupy 8 bytes, an .~int~ occupies
  4 bytes, a .~short~ occupies 2 bytes and a type must be aligned on an
  address evenly divisible by its size.  Given the following declaration:

  ~~~

  #{decl}

  ~~~

  what is .~sizeof(struct S)~?
`;

const TYPE_INFOS = {
  'char ': {
    size: 1,
    var: i => `c${i}`,
  },
  'short ': {
    size: 2,
    var: i => `w${i}`,
  },
  'int ': {
    size: 4,
    var: i => `i${i}`,
  },
  'long ': {
    size: 8,
    var: i => `j${i}`,
  },
  'char *': {
    size: 8,
    var: i => `p${i}`,
  },
  'short *': {
    size: 8,
    var: i => `p${i}`,
  },
  'int *': {
    size: 8,
    var: i => `p${i}`,
  },
  'long *': {
    size: 8,
    var: i => `p${i}`,
  },
  'void *': {
    size: 8,
    var: i => `p${i}`,
  },
  'char[3] ': {
    size: 3,
    var: i => `label${i}[3]`,
    align: 1,
  },
  'char[5] ': {
    size: 5,
    var: i => `label${i}[5]`,
    align: 1,
  },
  'char[7] ': {
    size: 7,
    var: i => `label${i}[7]`,
    align: 1,
  },
};
const TYPES = Object.keys(TYPE_INFOS);

const PARAMS = [
  { nFields: () => Rand.int(4, 7),
    labelLen: () => Rand.choice([3, 5, 7 ]),
    perturbs: () => Rand.choices(4, [ -8, -4, 4, 8, 12, 16 ]),
  },
  { types: ({nFields, labelLen}) =>
    Rand.permutation(Rand.choices(nFields, TYPES).
		     concat([`char[${labelLen}] `])),
  },
  { _type: 'nonRandom',
    decl: ({types}) => makeDecl(types),
    offsets: ({types}) => makeOffsets(types),
  },
  { _type: 'nonRandom',
    sizeChoices: ({offsets, perturbs}) => makeSizeChoices(offsets, perturbs),
  },
];

const OFFSET_INDENT = 30;
function makeDecl(types, offsets) {
  let decls = '';
  types.forEach((t, i) => {
    const info = TYPE_INFOS[t];
    const declType = t.replace(/\[\d+\]/g, '');
    const declVar = info.var(i);
    let decl = `    ${declType}${declVar};`;
    if (offsets) {
      decl += ' '.repeat(OFFSET_INDENT - decl.length);
      decl += `//offset ${offsets[i]}`;
      const hole = offsets[i + 1] - (offsets[i] + info.size);
      if (hole > 0) decl += `; padding ${hole}`;
    }
    decls += decl + '\n';
  });
  return `struct S {\n${decls}};`;
}

function makeOffsets(types) {
  const offsets = [];
  let offset = 0;
  let maxAlign = 1;
  for (const t of types) {
    const info = TYPE_INFOS[t];
    const align = info.align || info.size;
    if (align > maxAlign) maxAlign = align;
    if (offset%align !== 0) offset += align - offset%align;
    offsets.push(offset);
    offset += info.size;
  }
  if (offset % maxAlign === 0) {
    offsets.push(offset);
  }
  else {
    offsets.push(offset + maxAlign - offset%maxAlign);
  }
  return offsets;
}

function makeSizeChoices(offsets, perturbs) {
  const size = offsets.slice(-1)[0];
  return [0].concat(perturbs).map(p => size + p);
}

function explain({types, offsets}) {
  const decl = makeDecl(types, offsets);
  return `
    (#{_0}) is correct since the declaration with offsets is:

    ~~~

    ${decl}

    ~~~

    Hence the .~sizeof(struct S)~ is \`${offsets.slice(-1)[0]}\`.
  `;
}

if (process.argv[1] === __filename) {
  console.log(new Sizeof().qaText());
}
