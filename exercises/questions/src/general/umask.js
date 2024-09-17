'use strict';

const TIMESTAMP = 'Time-stamp: <2022-04-27 18:53:34 umrigar>';

const {ChoiceQuestion, Rand, umtParse, emacsTimestampToMillis} =
      require('gen-q-and-a');

/* 2 modes:
  Given a umask choose a correct statement.
  Given a statement, choose umask.
*/

class Umask extends ChoiceQuestion {

  constructor(params) {
    super(params);
    this.addParamSpec(PARAMS);
    for (let i = 0; i < 5; i++) {
      this.choice(params => choice(params, i));
    }
    this.freeze();
    this.addQuestion(question(this.params));
    this.addExplain(explain(this.params, this.choiceOrder()));
    this.makeContent();
  }

}

module.exports = Umask

Object.assign(Umask, {
  id: 'umask',
  title: 'Process umask',
});



function question(params) {
  let text = '';
  if (params.mode === 'statement') {
    const { umask } = params;
    text += `
      Which one of the following is a correct statement about the  \`umask\`
      \`${formatUmask(umask)}\`?
    `;
  }
  else {
    const { indexes, vals } = params;
    const specs =
      indexes.map((x, i) => ({ ...UMASK_BITS[x], isDenied: vals[i] === 1, }));
    const descr = specs.map(s => umaskSpecText(s)).join(' and ');
    text += `
      Which one of the following \`umask\`s will set up *all* of the following:

        + ${umaskSpecText(specs[0])}.

        + ${umaskSpecText(specs[1])}.

        + ${umaskSpecText(specs[2])}.

      Please choose a single alternative.

    `;
  }
  return text;
}

function choice(params, index) {
  if (params.mode === 'statement') {
    const { specs, choices, flipPair } = params;
    const pair = choices[index].map(i => specs[i]);
    if (index !== 0) {
      pair[0] = { ...pair[0], isDenied: !pair[0].isDenied };
    }
    const stmt = `
    The umask will ${umaskSpecText(pair[flipPair - 0])} and 
    ${umaskSpecText(pair[1 - flipPair])}.
  `;
    return stmt;
  }
  else {
    return `\`${formatUmask(params.umaskChoices[index].umask)}\`.`;
  }
}

function explain(params, choiceOrder) {
  return (params.mode === 'statement')
    ? explainStatementMode(params, choiceOrder)
    : explainUmaskMode(params, choiceOrder);
}

function explainStatementMode(params, choiceOrder) {
  let text = '';
  if (params.mode === 'statement') {
    const { umask, specs, choices, flipPair } = params;
    text += `
      Statement (#{_0}) correctly described umask \`${formatUmask(umask)}\`.
    `;
    for (const c of choiceOrder) {
      if (c === 0) continue;
      const spec = specs[choices[c][0]];
      text += `
        Statement (#{_${c}}) is incorrect because umask 
        \`${formatUmask(umask)}\` will ${umaskSpecText(spec)}.       
      `;
    }
    
  }
  return text;
}

function explainUmaskMode(params, choiceOrder) {
  let text = '';
  const { indexes, vals, umaskChoices } = params;
  const specs =
	indexes.map((x, i) => ({ ...UMASK_BITS[x], isDenied: vals[i] === 1, }));
  const descr = specs.map(s => umaskSpecText(s)).join(' and will ');
  text += `
      (#{_0}) is correct since the umask 
      \`${formatUmask(umaskChoices[0].umask)}\` will ${descr}.
    `;
  for (const c of choiceOrder) {
    if (c === 0) continue;
    const { umask, changed } = umaskChoices[c];
    const descr = changed.map(s => umaskSpecText(s)).join(' and will ');
    text += `
        (#{_${c}}) is incorrect since the umask \`${formatUmask(umask)}\`
        will ${descr}.
      `;
  }
  return text;
}

const UMASK_BITS = [
  { kind: 'other', perm: 'exec', },
  { kind: 'other', perm: 'write', },
  { kind: 'other', perm: 'read', },
  { kind: 'group', perm: 'exec', },
  { kind: 'group', perm: 'write', },
  { kind: 'group', perm: 'read', },
  { kind: 'user', perm: 'exec', },
  { kind: 'user', perm: 'write', },
  { kind: 'user', perm: 'read', },
];
const N_BITS = UMASK_BITS.length;
const BIT_INDEXES = Array.from({length: N_BITS}).map((_, i) => i);

/** choose 5 disjoint pairs from BIT_INDEXES */
function specIndexChoices() {
  const choices = [];
  let indexes = [...BIT_INDEXES];
  for (let i = 0; i < 5; i++) {
    const choice = Rand.choices(2, indexes);
    choices.push(choice);
    indexes.splice(indexes.indexOf(choice[0]), 1); //rm to ensure distinct 
  }
  return choices;
}

/** return copy of UMASK_BITS enhanced with isDenied based on umask bits */
function umaskSpecs(umask) {
  const specs = [];
  for (const [index, {kind, perm}] of UMASK_BITS.entries()) {
    const mask = (1 << index);
    const isDenied = (umask & mask) !== 0;
    specs.push({kind, perm, isDenied, index});
  }
  return specs;
}

/** used when mode === umask. Returns 5-elements choices containing
 *  perturbed umasks and changes describing the perturbation.  The
 *  first choice is not perturbed (changes === []) and contains
 *  umask[...indexes] === ...vals.
 *  
 */
function umaskChoices(indexes, vals) {
  const choices = [];
  for (let i = 0; i < 5; i++) {
    const vals1 = [
      ((i & 1) === 0) ? vals[0] : 1 - vals[0],
      ((i & 2) === 0) ? vals[1] : 1 - vals[1],
      ((i & 4) === 0) ? vals[2] : 1 - vals[2],
    ];
    let umask = Rand.int(0, 2**N_BITS);
    for (const [j, x] of indexes.entries()) {
      const b = vals1[j];
      if (b === 0) {
	umask &= ~(1 << x);
      }
      else {
	umask |= (1 << x);
      }
    }
    const changed =
      indexes.filter((_, j) => vals1[j] !== vals[j])
     .map(x => ({ ...UMASK_BITS[x], isDenied: (umask & (1 << x)) !== 0 }));
    choices.push({umask, changed});
  }
  return choices;
}

function umaskSpecText(spec) {
  const {kind, perm, isDenied} = spec;
  return `${isDenied ? 'deny' : 'allow'} ${kind} ${perm}`;
}

function formatUmask(umask) {
  return `0${umask.toString(8).padStart(3, '0')}`;
}

const PARAMS = [
  { mode: () => Rand.choice(['statement', 'umask']),
    choices: () => specIndexChoices(),
    umask: () => 1 + Rand.int(0, 0o777),
    flipPair: () => Rand.choice([0, 1]),
    //used for constructing umask when mode === 'umask'
    indexes: () => Rand.choices(3, BIT_INDEXES), //concentrate on these bits
    vals: () => [ //value of above indexes bit
      Rand.choice([0, 1]), Rand.choice([0, 1]), Rand.choice([0, 1]),
    ],
  },
  { _type: 'nonRandom',
    specs: ({umask}) => umaskSpecs(umask),
  },
  { umaskChoices: ({indexes, vals}) => umaskChoices(indexes, vals),
  },
];

if (process.argv[1] === __filename) {
  console.log(new Umask().qaText());
}
