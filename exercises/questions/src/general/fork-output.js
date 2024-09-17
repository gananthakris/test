'use strict';

const TIMESTAMP = 'Time-stamp: <2022-03-08 18:20:01 umrigar>';

const {ChoiceQuestion, Rand, umtParse, emacsTimestampToMillis} =
      require('gen-q-and-a');

class ForkOutput extends ChoiceQuestion {

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

module.exports = ForkOutput

Object.assign(ForkOutput, {
  id: 'forkOutput',
  title: 'Fork Output',
});



function choice(params, i) {
  let str = '';
  const values = params.choices[i];
  const lines = values.map(([ppid, pid, val]) =>
			   `ppid=${ppid}; pid=${pid}; val=${val}`);
  return `
    The output:

    \`\`\`
    ${lines[0]}
    ${lines[1]}
    ${lines[2]}
    \`\`\`
  `;
  return str;
}

function question(params) {
  const { vals } = params;
  let str = '';
  str += `
    Assuming no errors, which one of the following outputs is possible
    when the following C code fragment is run via a terminal 
    on a Unix system?

    ~~~
    printf("ppid=%ld, pid=%ld, val=%d\\n", 
           (long) getppid(), (long) getpid(), ${vals[0]});
    pid_t pid = fork();
    printf("ppid=%ld, pid=%ld, val=%d\\n", 
           (long) getppid(), (long) getpid(), 
           (pid) ? ${vals[1]} : ${vals[2]});
    ~~~
  `;
  return str;
}

function explain(params, choiceOrder) {
  const { vals, pids, flip } = params;
  let str = '';
  str += `
    The first .~printf()~ will output completely since it is
    terminated by a newline and stdout will be line-buffered since
    the program is being run on a terminal.  Hence the PID of
    the process running the code must be \`${pids[1]}\` and the PID of its
    parent (possibly a shell process) must be \`${pids[0]}\`.
    The third PID which gets printed above is \`${pids[2]}\`; 
    presumably that is the PID of the child.

    The second .~printf()~ will be executed twice, once by the parent
    and once by the forked child.  

    The \`fork()\` will return non-zero to the parent and hence the
    parent will print
  
    \`\`\`
    ppid=${pids[0]}; pid=${pids[1]}; val=${vals[1]}
    \`\`\`

    Since the \`fork()\` will return zero to the child, the child will
    print 

    \`\`\`
    ppid=${pids[1]}; pid=${pids[2]}; val=${vals[2]}
    \`\`\`

    The lines printed by the second .~printf()~ 
    could appear in either order.  

    (#{_0}) ls the only choice which has those two lines and hence
    it is the correct answer.
  `;
  return str;
}

const PARAMS = [
  { vals: () => Rand.choices(3, [11, 22, 33, 44, 55, 66, 77, 88, 99]),
    pids: () => Rand.choices(3, [11111, 22222, 33333, 44444,
				 55555, 66666, 77777, 88888, 99999]),
    flip: () => Rand.choice([false, true]),
  },
  { _type: 'nonRandom',
    choices: ({vals, pids, flip}) => [
      flip ? [ [ pids[0], pids[1], vals[0] ],
	       [ pids[1], pids[2], vals[2] ],
	       [ pids[0], pids[1], vals[1] ],
	     ]
           : [ [ pids[0], pids[1], vals[0] ],
	       [ pids[0], pids[1], vals[1] ],
	       [ pids[1], pids[2], vals[2] ],
	     ],
      [ [ pids[0], pids[1], vals[0] ],
	[ pids[0], pids[1], vals[2] ],
	[ pids[1], pids[2], vals[1] ],
      ],	
      [ [ pids[0], pids[1], vals[0] ],
	[ pids[1], pids[2], vals[1] ], 
	[ pids[0], pids[1], vals[2] ],
      ],	
      [ [ pids[0], pids[1], vals[0] ],
	[ pids[0], pids[2], vals[1] ],
	[ pids[1], pids[0], vals[2] ],
      ],	
      [ [ pids[0], pids[1], vals[0] ],
	[ pids[0], pids[1], vals[2] ],
	[ pids[2], pids[1], vals[1] ],
      ],	
    ],
  },
];

if (process.argv[1] === __filename) {
  console.log(new ForkOutput().qaText());
}
