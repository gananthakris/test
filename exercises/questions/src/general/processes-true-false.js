'use strict';

const TIMESTAMP = 'Time-stamp: <2022-03-26 17:25:42 umrigar>';

const {TrueFalseQuestion, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class ProcessesTrueFalse extends TrueFalseQuestion {

  constructor(params) {
    super(params, STATEMENTS);
  }

}

const STATEMENTS = [
  { // 1
    statement: `
      If a child process terminates before its parent process, then
      the child becomes a zombie.
    `,
    value: true,
    explain: `
      Since the system cannot predict whether the parent will
      wait for the child in the future, it needs to retain
      some vestigial information to return to the parent
      in case it does do a wait.  It is this need to maintain 
      the vestigial information which results in the zombie.
    `,
  },
  { // 2
    statement: `
      If a child terminates after its parent, then it becomes
      a zombie.
    `,
    value: false,
    explain: `
      When a process terminates, any extant child processes are
      adopted by the \`init\` (usually PID 1) process.  Hence the child
      process will not become a zombie when it terminates since it
      will have been adopted by \`init\`.

      The \`init\` process is written to always wait for its child
      processes; hence \`init\` will wait for the child, resulting in
      a clean termination for the child.
    `,
  },
  { // 3
    statement: `
      If a process terminates, then any extant child processes are
      adopted by the \`init\` process.
    `,
    value: true,
    explain: `
      This behavior ensures that all processes have an active
      parent process and avoids zombies.

      The \`init\` process is written to always wait for its child
      processes; This results in a clean termination for all
      processes.
    `,
  },
  { // 4
    statement: `
      In the absence of errors, the \`exec()\` family of calls
      will never return.
    `,
    value: true,
    explain: `
      Since \`exec()\` results in the program image being replaced,
      there is no place for the call to return to.
    `,
  },
  { // 5
    statement: `
      If a process forks multiple children, then it is possible for
      the parent to wait for a specific child to terminate.
    `,
    value: true,
    explain: `
      This is possible using the \`waitpid()\` call.
    `,
  },
  { // 6
    statement: `
      Since a \`fork()\` results in copying the complete address
      space of the parent into the child, it is very inefficient.
    `,
    value: false,
    explain: `
      On most modern systems, the copy is only a virtual copy.
      Specifically on modern systems, the address space of the parent
      is simply *remapped* into the child.  As long as the child does
      not update these remapped space, both processes can continue to
      use the same shared space. It is only when the child attempts to
      make updates will a copy be made.  This lazy strategy is
      referred to as *copy-on-write*.
    `,
  },
  { // 7
    statement: `
      If a process is terminated by a signal, then its parent
      will be unable to access its termination status.
    `,
    value: false,
    explain: `
      The parent will still be able to wait for the termination
      status of the child; in fact, it can access the details
      of the signal using macros like \`WIFSIGNALED()\` and
      \`WTERMSIG()\` on the status,
     `,
  },
  { // 8
    statement: `
      A double-fork is used to avoid zombies.
    `,
    value: true,
    explain: `
      A double-fork is one way to avoid zombies.  
    `,
  },
  { // 9
    statement: `
      When a program start executing, the first function executed
      is \`main()\`.
    `,
    value: false,
    explain: `
      \`main()\` is the first programmer-visible function which is
      executed.  However, the first function which is entered is
      an internal startup function which calls \`main()\`.

      This allows the internal startup functions to run cleanup
      handlers before termination.
    `,
  },
  { // 10
    statement: `
      The program enviroment is stored in a hashtable which is accessed
      by \`getenv()\` and \`setenv()\`.
    `,
    value: false,
    explain: `
      The program environment is stored in an *array* of
      \`NAME=VALUE\` strings with the end of the array
      signalled using a \`NULL\` string.
    `,
  },
  { // 11
    statement: `
      The \`execl()\` variants of the \`exec()\` family can
      only be used if the number of arguments to the program
      being run is known at compile time.
    `,
    value: true,
    explain: `
      The arguments to the program need to be provided as
      separate arguments to the \`execl()\` call; this can
      only be done if their number is known when writing
      the program.
    `,
  },
  { // 12
    statement: `
      The \`execv()\` variants of the \`exec()\` family can
      be used even when the number of arguments to the program
      being run is not known at compile time.
    `,
    value: true,
    explain: `
      Since the \`execv()\` variants of the \`exec()\` family take a
      \`NULL\`-terminated array of strings specifying the arguments to
      the program being run, this array can be built dynamically and
      the number of arguments to the program being run need not be
      known at compile time.
    `,
  },
  { // 13
    statement: `
      In order to execute scripts like \`script.py\`, the kernel uses
      the file extension to determine the interpreter to be run.
    `,
    value: false,
    explain: `
      The kernel is totally unaware of scripting languages; in fact,
      it can successfully run scripts even the script is in a file
      named simply \`script\` without an extension.

      The way this works is that if the kernel sees that the file
      starts with the magic number \`#!\`, then it runs the rest of
      first line of the file feeding it the file as its first
      argument.  Hence if the first line of \`script\` is

      \`\`\`
      #!/usr/bin/python3
      \`\`\`

      the kernel will run the command \`/usr/bin/python3 script\`.
    `,
  },
  { // 14
    statement: `
      It is legal to call \`system(NULL)\`.
    `,
    value: true,
    explain: `
      This call is used to check whether the OS supports a 
      command processor.
    `,
  },

];

module.exports = ProcessesTrueFalse;
Object.assign(ProcessesTrueFalse, {
  id: 'processesTrueFalse',
  title: 'Processes True/False',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});



if (process.argv[1] === __filename) {
  console.log(new ProcessesTrueFalse().qaText());
}
