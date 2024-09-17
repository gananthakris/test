'use strict';

const TIMESTAMP = 'Time-stamp: <2022-03-08 21:36:03 umrigar>';

const {ChoiceQuestion, Rand, umtParse, emacsTimestampToMillis} =
      require('gen-q-and-a');

class MemAddr extends ChoiceQuestion {

  constructor(params) {
    super(params);
    this.addParamSpec(PARAMS);
    for (let i = 0; i < 4; i++) {
      this.choice(params => choice(params, i));
    }
    this.noneOfTheAbove();
    this.freeze();
    this.addQuestion(question(this.params));
    this.addExplain(explain(this.params, this.choiceOrder()));
    this.makeContent();
  }

  answerIndex() {
    const index = this.params.outputs.findIndex(o => !o.err);
    return (index < 0) ? 4 : index;
  }

}

module.exports = MemAddr

Object.assign(MemAddr, {
  id: 'memAddr',
  title: 'Memory Addresses',
});

/*
int global1;
int global2 = 42;

int main(int argc, const char *argv[]) {
  const char **argv1 = &argv[1];
  int local1 = 22;
  int *p = malloc(sizeof(int));

  printf("%p: main\n", &main);
  printf("%p: global2\n", &global2);
  printf("%p: global1\n", &global1);
  printf("%p: p\n", p);
  printf("%p: local1\n", &local1);
  printf("%p: argv1\n", argv[1]);

  return 0;
}
*/

function code(params) {
  const { order } = params;
  const printfs = order.map(v => {
    const a = (v === 'p' || v === 'argv1') ? '' : '&';
    return `      printf("%p: ${v}\\n", ${a}${v});`;
  }).join('\n');
  return `
    int global1;
    int global2 = 42;

    int main(int argc, const char *argv[]) {
      const char **argv1 = &argv[1];
      int local1 = 22;
      int *p = malloc(sizeof(int));\n\n${printfs}\n
      return 0;
    }
  `;
}

function choice(params, i) {
  const { order, outputs } = params;
  const output = outputs[i];
  let str = '';
  str += `
    The output: 

    \`\`\`
  \n`;
  for (const v of order) {
    const addr = params[output[v] ?? v];
    str += `    ${addr}: ${v}\n`;
  }
  str += `
    \`\`\`
  `;
  return str;
}

function question(params) {
  let str = '';
  str += `
    Which one of the following outputs is possible when the following
    C code is invoked with one or more arguments on a ${params.addrBits}-bit
    Unix system?\n\n`;
  str += `~~~${code(params)}\n~~~\n\n`
  return str;
}

function explain(params, choiceOrder) {
  const { outputs } = params;
  const ansIndex = outputs.findIndex(o => !o.err);
  let str = '';
  str += `
    The standard VM layout on a Unix system
    in order of increasing memory addresses is:

      # The code area referred to as \`text\`.

      # The area for initialized data referred to as \`data\`.

      # The area for uninitialized data referred to as \`BSS\`.

      # The heap area used by \`malloc()\` and friends.

      # The stack area used for storing stack frames containing
        control information and local variables.

      # An area used for the program environment and
       command-line arguments.

    \`main\` points to the code area, \`global2\` will be allocated in
    the initialized data area, \`global1\` will be allocated in the
    uninitialized data BSS area, \`p\` will point into the heap, local
    variable \`local1\` will be allocated on the stack and \`argv1\`
    will point into the command line area.  Hence we must have:

    \`\`\`
    &main < &global2 < &global1 < p  < &local1 < argv1
    \`\`\`
    
  `;
  if (ansIndex >= 0) {
    const { main, global2, global1, p, local1, argv1 } = params;
    str += `
      (#{_${ansIndex}}) is correct.  We have:

      \`\`\`
      &main (${main}) < &global2 (${global2}) < &global1 (${global1}) 
        < p (${p}) < &local1 (${local1}) < argv1 (${argv1})
      \`\`\`
    `;
  }
  for (const i of choiceOrder) {
    let err = outputs[i]?.err;
    if (err) {
      str += `
        (#{_${i}}) is incorrect.  ${err(params)}
      `;
    }
  }
  return str;
}

const OUTPUT_CHOICES = [
  { }, //answer
  { local1: 'argv1', argv1: 'local1', 
    err: ({argv1, local1}) => `
       The address of variables in the stack area should be less than
       the address of command-line arguments.  However, \`local1\` is
       in the stack area and its address \`${argv1}\` is greater than
       the address \`${local1}\` of command-line argument \`argv[1]\`.
    `,
  },
  { global2: 'global1', global1: 'global2',
    err: ({global2, global1}) => `
       The address of variables in the initialized data area should be
       less than the address of variables in the uninitialized data BSS
       area.  However, \`global2\` is in the initialized data area and
       its address \`${global1}\` is greater than the address \`${global2}\`
       of \`global1\` in the BSS.
    `,
  },
  { global2: 'p', p: 'global2', 
    err: ({global2, p}) => `
       The address of variables in the initialized data area should be
       less than the address of variables in the heap
       area.  However, \`global2\` is in the initialized data area and
       its address \`${p}\` is greater than the address \`${global2}\`
       of variable \`p\` in the heap.
    `,
  },
  { p: 'local1', local1: 'p',
    err: ({local1, p}) => `
       The address of variables in the heap area should be
       less than the address of variables in the stack
       area.  However, \`p\` is in the heap and
       its address \`${local1}\` is greater than the address \`${p}\`
       of variable \`local1\` in the stack.
    `,
  },
];

function hexAddr(addr, addrBits) {
  return '0x' + addr.toString(16).padStart(addrBits/4, '0');
}

function indexes(n) { return Array.from({length: n}).map((_, i) => i); }

const VARS = [ 'main', 'global2', 'global1', 'p', 'local1', 'argv1' ];

const PARAMS = [
  { addrBits: () => Rand.choice([16]),
    _text: () => Rand.choice([0x100, 0x200]),
    memSpace: () => Rand.choice([0.5, 0.75, 1]),
    cmdSize: () => Rand.choice([0x100, 0x1000]),
    outIndexes: () => Rand.choices(4, indexes(OUTPUT_CHOICES.length)),
    order: () => Rand.permutation(VARS),
  },
  { _type: 'nonRandom',
    _data: ({_text}) => 2*_text,
    _bss: ({_text}) => 4*_text,
    _stk: ({addrBits, memSpace, cmdSize}) => 2**addrBits * memSpace - cmdSize,
    outputs: ({outIndexes}) => outIndexes.map(i => OUTPUT_CHOICES[i]),
  },
  {
    _bss: ({_text}) => Rand.choice([4*_text, 6*_text]),
    _heap: ({_text}) => Rand.choice([8*_text, 16*_text]),
  },
  { 
    main: ({addrBits, _text}) =>
      hexAddr(_text +  Rand.choice([0x10, 0x20]), addrBits),
    global2: ({addrBits, _data}) =>
      hexAddr(_data + Rand.choice([0x10, 0x20]), addrBits),
    global1: ({addrBits, _bss}) =>
      hexAddr(_bss + Rand.choice([0x10, 0x20]), addrBits),
    p: ({addrBits, _heap}) =>
      hexAddr(_heap + Rand.choice([0x10, 0x20]), addrBits),
    local1: ({addrBits, _stk}) =>
      hexAddr(_stk -  Rand.choice([0x10, 0x20]), addrBits),
    argv1: ({addrBits, _stk}) =>
      hexAddr(_stk +  Rand.choice([0x10, 0x20]), addrBits),
  },
];

if (process.argv[1] === __filename) {
  console.log(new MemAddr().qaText());
}
