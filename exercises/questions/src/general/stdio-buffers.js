'use strict';

const TIMESTAMP = 'Time-stamp: <2022-04-28 10:50:48 umrigar>';

const {ChoiceQuestion, Rand, umtParse, emacsTimestampToMillis} =
      require('gen-q-and-a');

class StdioBuffers extends ChoiceQuestion {

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

module.exports = StdioBuffers

Object.assign(StdioBuffers, {
  id: 'stdioBuffers',
  title: 'Standard I/O and Buffering',
});



function choice(params, i) {
  return params.choices[i].sort().join(', ') + '.';
}

function question(params) {
  const { code } = params;
  let str = '';
  str += `
    Given the following code:

    \n~~~${code}\n~~~

    Assuming default buffering on the standard streams and no errors,
    which one of the following alternatives shows the numbers which
    will be printed on the terminal by calling \`f()\`?  (each
    alternative lists the numbers in sorted order).
  `;
  return str;
}

function explain(params, choiceOrder) {
  const { state } = params;
  //return state.explains;
  let str = '';
  str += `
    This question deals with the interaction of C's standard I/O
    buffering with program exit as well as \`fork()\`:

      + One advantage of using standard I/O over Unix I/O is that
        Unix I/O requires a call to system calls like \`read()\`
        or \`write()\`.  System calls require a transition between
        user-space and system-space which is very expensive.

        OTOH, standard I/O simply updates a buffer, making 
        system calls only when the buffer is empty/full.

      + By default, standard I/O's standard output is line-buffered.
        This means that the buffer for the \`stdout\` stream is
        flushed to kernel space only when it is full, or receives
        a newline character or is flushed explicitly using \`flush()\`.

      + By default, standard I/O's standard error is unbuffered.
        This means that every character written to \`stderr\` 
        is directly written to the kernel.

      + Terminating a program using \`exit()\` will flush 
        all buffers; that is not the case when the program
        is terminated using \`_exit()\`.

      + Since \`fork()\` copies the address-space of the parent
        process into the child, any unflushed standard I/O buffers 
        are inherited by the child.

    The details follow:

    ${state.explains}

    Hence \`${state.zs.join(', ')}\` will be output to the
    terminal; this is choice (#{_0}).
  `;
  return str;
}

function choices(params) {
  const { vals, state, exits } = params;
  const zs = state.zs;
  const alts = [];
  alts.push([...zs]);
  alts.push([...vals]); //zs cannot be vals because _exit() always drops one val
  alts.push([vals[1], ...zs]); //vals[1] goes to stderr, will not repeat
  //choice without vals[4], but since vals[4] goes to stderr it will output
  alts.push([...vals.slice(1, 4), ...vals.slice(5)]); 
  alts.push([vals[7], ...zs]); //vals[7] goes to stderr, will not repeat
  return alts;
}

function join(vals) {
  return (
    (vals.length == 1)
      ? vals[0]
      : vals.slice(0, -1).join(', ') + ' and ' + vals.slice(-1)[0]
  );
}

class State {
  constructor() {
    this.zs = [];
    this.explains = [];
    this.bufs = [[], []]; //stdout buffers: 0 is parent buf, 1 is child buf
  }
  next(val, out, nl, bufIndex) {
    switch (`${out}${nl}`) {
      case 'stderr\\n': case 'stderr ':
	this.zs.push(val);
	this.explains += `
          Since \`stderr\` is unbuffered, ${val} will be output to the terminal.
        `;
	break;
      case 'stdout\\n':
	this.bufs[bufIndex].push(val);
	this.explains += `
          ${val} will be added to the \`stdout\` buffer so that it now
          contains ${join(this.bufs[bufIndex])}.  Since \`stdout\` is
          line buffered and the value is followed by a newline, the
          buffer will be flushed and ${join(this.bufs[bufIndex])} will
          be output to the terminal.
        `;
	this.zs.push(...this.bufs[bufIndex]);
	this.bufs[bufIndex] = [];
	break;
      case 'stdout ':
	this.bufs[bufIndex].push(val);
	this.explains += `
          Since \`stdout\` is
          line buffered and the value is not followed by a newline, 
          the value ${val} will be simply be buffered and not output
          to the terminal.  Hence the \`stdout\` buffer will
          now contain ${join(this.bufs[bufIndex])}.
        `;
	break;
    }
  }
  fork() {
    this.bufs[1] = [ ...this.bufs[0] ];
    this.explains += `
      Since the \`fork()\` copies the address space of the parent into 
      the address space of the child, the contents ${join(this.bufs[0])}
      of the \`stdout\` buffer will be replicated in the child.
    `;
  }
  exit(bufIndex) {
    const name = (bufIndex === 0) ? 'parent' : 'child';
    this.explains += `
      Since \`exit()\` flushes stdio buffers, the contents
      ${join(this.bufs[bufIndex])} of the \`stdout\` buffer will be
      output to the terminal before the ${name} process terminates.
    `;
    this.zs.push(...this.bufs[bufIndex]);
    this.bufs[bufIndex] = []; 
    this.zs.sort();
  }
  _exit(bufIndex) {
    const name = (bufIndex === 0) ? 'parent' : 'child';
    this.explains += `
      Since \`_exit()\` does not flush stdio buffers, the contents
      ${join(this.bufs[bufIndex])} of the \`stdout\` buffer will simply
      be discarded when the ${name} process terminates.
    `;
    this.zs.sort();
    this.bufs[bufIndex] = [];
  }
}

function answer(params) {
  const { vals, exits, out1, out1NL, out2, out2NL,
	  parentOut, parentNL, childOut, childNL } = params;
  const outs = [ out1, 'stderr', out2, 'stdout', 'stderr', childOut, 'stdout',
		 'stderr', parentOut, 'stdout' ];
  const nls = [ out1NL, ' ', out2NL, ' ', ' ', childNL, ' ',
		' ', parentNL, ' ' ];
  const state = new State();
  for (let i = 0; i < 4; i++) { state.next(vals[i], outs[i], nls[i], 0); }
  state.fork();
  for (let i = 4; i < 7; i++) { state.next(vals[i], outs[i], nls[i], 1); }
  if (exits[0] === 'exit') {
    state.exit(1);
  }
  else {
    state._exit(1);
  }
  for (let i = 7; i < 10; i++) { state.next(vals[i], outs[i], nls[i], 0); }
  if (exits[1] === 'exit') {
    state.exit(0);
  }
  else {
    state._exit(0);
  }
  return state;
}

const PRIMES2 = [
  11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
  53, 59, 61, 67, 71, 73, 79, 83, 89, 97
];

const PARAMS = [
  { vals: () => Rand.choices(10, PRIMES2),
    exits: () => Rand.permutation(['_exit', 'exit']),
    out1: () => Rand.choice(['stdout', 'stderr']),
    out1NL: () => Rand.choice(['\\n', ' ']),
    out2: () => Rand.choice(['stdout', 'stderr']),
    out2NL: () => Rand.choice(['\\n', ' ']),
    parentOut: () => Rand.choice(['stdout', 'stderr']),
    parentNL: () => Rand.choice(['\\n', ' ']), 
    childOut: () => Rand.choice(['stdout', 'stderr']),
    childNL: () => Rand.choice(['\\n', ' ']),
  },
  { _type: 'nonRandom',
    code: p => `
      void f() {
        fprintf(${p.out1}, "${p.vals[0]}${p.out1NL}");
        fprintf(stderr, "${p.vals[1]} ");
        fprintf(${p.out2}, "${p.vals[2]}${p.out2NL}");
        fprintf(stdout, "${p.vals[3]} ");
        if (fork() == 0) { //child
          fprintf(stderr, "${p.vals[4]} ");
          fprintf(${p.childOut}, "${p.vals[5]}${p.childNL}");
          fprintf(stdout, "${p.vals[6]} ");
          ${p.exits[0]}(0);
        }
        else { //assume parent
          fprintf(stderr, "${p.vals[7]} ");
          fprintf(${p.parentOut}, "${p.vals[8]}${p.parentNL}");
          fprintf(stdout, "${p.vals[9]} ");
          ${p.exits[1]}(0);
        }
      } 
    `,
    state: p => answer(p),
  },
  { _type: 'nonRandom',
    choices: p => choices(p),
  },
];

if (process.argv[1] === __filename) {
  console.log(new StdioBuffers().qaText());
}
