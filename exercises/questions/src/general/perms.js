'use strict';

const TIMESTAMP = 'Time-stamp: <2022-03-26 23:22:55 umrigar>';

const {ChoiceQuestion, Rand, umtParse, emacsTimestampToMillis} =
      require('gen-q-and-a');

const lsOut = require('../util/ls-out');

/* 2 modes:
  Given a perms choose a correct statement.
  Given a statement, choose perms.
*/

class Perms extends ChoiceQuestion {

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

module.exports = Perms

Object.assign(Perms, {
  id: 'perms',
  title: 'File Permissions',
});



function question(params) {
  let text = '';
  const p = params;
  text += `
    Given the following \`ls -l\` listing:

    \`\`\`\n${lsOut(p.files)}
    \`\`\`

    The user \`${p.u}\` with primary group \`${p.g}\` and
    supplementary group \`${p.sg}\` executes binary executable
    \`${p.xname}\`.  Which one of the following statements is
    true about the execution?
  `;
  return text;
}

function choice(params, index) {
  const p = params;
  switch (answer(p).choices[index]) {
    case 'NO': return `The file \`${p.dname}\` cannot be accessed.`;
    case 'NO_X': return `The file \`${p.xname}\` cannot be executed.`;
    case 'R': return `The file \`${p.dname}\` can be accessed read-only.`;
    case 'W': return `The file \`${p.dname}\` can be accessed write-only.`;
    case 'RW': return `The file \`${p.dname}\` can be accessed read-write.`;
  }
}

function explain(params, choiceOrder) {
  return answer(params).explain;
}

function answer(params) {
  const {xperms, dperms, xu, xg, du, dg, u, g, sg, xname, dname, } = params;
  const uperms = perms => perms.slice(0, 3);
  const gperms = perms => perms.slice(3, 6);
  const operms = perms => perms.slice(6);
  const permsFn = (eu, eg, sg, fu, fg) => 
    (fu === eu) ? uperms : (fg == eg || fg === sg) ? gperms : operms;
  let [eu, eg] = [u, g];
  let text = '';
  let choices = [];
  const xPermsFn = permsFn(eu, eg, sg, xu, xg);
  const xperms0 = xPermsFn(xperms);
  if (xPermsFn === uperms) {
    text += `
      Since the effective user \`${eu}\` matches the owner \`${xu}\`
      of \`${xname}\`, its owner permissions \`${xperms0}\` are used.
    `.trim();
  }
  else if (xPermsFn === gperms) {
    if (xg === eg) {
      text += `
        Since the effective user \`${eu}\` does not match the owner
        \`${xu}\`of \`${xname}\`, but the primary group \`${eg}\`
        matches the group owner \`${xg}\` of \`${xname}\`, its group
        permissions \`${xperms0}\` are used.
      `.trim();
    }
    else {
      text += `
        Since the effective user \`${eu}\` does not match the owner
        \`${xu}\`of \`${xname}\`, but the supplementary group \`${sg}\`
        matches the group owner \`${xg}\` of \`${xname}\`, its group
        permissions \`${xperms0}\` are used.
      `.trim();
    }
  }
  else {
    text += `
      Since the effective user \`${eu}\` does not matches the owner
      of \`${xu}\` of \`${xname}\` and neither primary group \`${eg}\`
      nor supplementary group \`${sg}\` matches the group owner \`${xg}\`
      of \`${xname}\`, its other permissions \`${xperms0}\` are used.
    `.trim();
  }
  if (xperms0.endsWith('-')) {
    text += ' ' + `
      Since these permissions do not allow execution, \`${xname}\`
      cannot be executed.
    `;
    return { explain: text, choices: makeChoices('NO_X') };
  }
  else {
    text += ' ' + `
      The permission  \`${xperms0.slice(-1)}\` allows execution.
    `;
  }
  if (xperms[2] === 's' && xu !== eu) {
    text += '\n\n' + `
      Since \`${xname}\` has its \`setuid\`-bit set, the effective
      user will be changed to the owner \`${xu}\` of \`${xname}\`.
    `;
    eu = xu;
  }
  if (xperms[5] === 's' && xg !== eg) {
    text += '\n\n' + `
      Since \`${xname}\` has its \`setgid\`-bit set, the effective group
      will be changed to the group \`${xg}\` of \`${xname}\`.
    `;
    eg = xg;
  }
  
  text += '\n\n';
  const dPermsFn = permsFn(eu, eg, sg, du, dg);
  const dperms0 = dPermsFn(dperms);
  const access = ACCESS[dperms0];
  if (dPermsFn === uperms) {
    text += `
      Since the effective user \`${eu}\` matches the owner \`${du}\`
      of \`${dname}\`, its permissions \`${dperms0}\` are used,
      resulting in ${ACCESS[access]} access.
    `;
  }
  else if (dPermsFn === gperms) {
    if (dg === eg) {
      text += `
        Since the effective user \`${eu}\` does not match the owner
        \`${du}\`of \`${dname}\`, but the primary group \`${eg}\`
        matches the group owner \`${dg}\` of \`${dname}\`, its group
        permissions \`${dperms0}\` are used resulting in
        ${ACCESS[access]} access.
      `.trim();
    }
    else {
      text += `
        Since the effective user \`${eu}\` does not match the owner
        \`${du}\`of \`${dname}\`, but the supplementary group
        \`${sg}\` matches the group owner \`${dg}\` of \`${dname}\`,
        its group permissions \`${dperms0}\` are used resulting in
        ${ACCESS[access]} access.
      `.trim();
    }
  }
  else {
    text += `
      Since the effective user \`${eu}\` does not matches the owner
      \`${du}\` of \`${dname}\` and neither primary group \`${eg}\`
      nor supplementary group \`${sg}\` matches the group owner \`${dg}\`
      of \`${dname}\`, its other permissions \`${dperms0}\` are used,
      resulting in ${ACCESS[access]} access.
    `.trim();
  }
  return { explain: text, choices: makeChoices(access) };
}

function makeChoices(ans) {
  return [ ans, ...[ 'NO_X', 'RW', 'R', 'W', 'NO' ].filter(c => c !== ans) ];
}

const ACCESS = {
  'r--': 'R',
  '-w-': 'W',
  'rw-': 'RW',
  '---': 'NO',
  'R': 'read-only',
  'W': 'write-only',
  'RW': 'read-write',
  'NO': 'no',
}
const XPERMS = [
  'rwsr-xr-x',
  'rwsr-xr-x',
  'rwsr-xr-x',
  'rwxr-s--x',
  'rwx--x--x',
  'rwx--x---',
];
	     
const DPERMS = [ 'rw-', 'r--', '-w-', '---' ];
const USERS = [
  'jjones99', 'shicks99', 'mliu92', 'rpatel02', 'msmith04',
];

const GROUPS = [
  'students', 'staff', 'admin', 'wheel',
];

const XNAMES = [
  'xtest', 'a.out', 'hello', 'test', 
];

const DNAMES = [
  'test.dat', 'test1.dat', 'grades.xls', 'grades.csv', 'grades.tsv', 
];



const PARAMS = [
  {
    xname: () => Rand.choice(XNAMES),
    dname: () => Rand.choice(DNAMES),
    xu: () => Rand.choice(USERS),
    xg: () => Rand.choice(GROUPS),
    du: () => Rand.choice(USERS),
    dg: () => Rand.choice(GROUPS),
    xperms: () => Rand.choice(XPERMS),
    dperms: () => Rand.permutation(Rand.choices(3, DPERMS)).join(''),
  },
  { u: ({xu, du}) => Rand.choice([xu, du, du, du, Rand.choice(USERS),]),
    g: ({xg, dg}) => Rand.choice([xg, dg, dg, dg, Rand.choice(GROUPS),]),
  },
  { sg: ({g}) => Rand.choice(GROUPS.filter(g1 => g1 !== g)),
  },
  { _type: 'nonRandom',
    files: p => [
      { name: p.xname, perms: p.xperms, user: p.xu, group: p.xg },
      { name: p.dname, perms: p.dperms, user: p.du, group: p.dg },
    ],
    answer: p => answer(p),
  },
];

if (process.argv[1] === __filename) {
  console.log(new Perms().qaText());
}
