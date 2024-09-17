'use strict';

const TIMESTAMP = 'Time-stamp: <2022-04-21 08:44:05 umrigar>';

const {TrueFalseQuestion, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class ProcRelTrueFalse extends TrueFalseQuestion {

  constructor(params) {
    super(params, STATEMENTS);
  }

}

const STATEMENTS = [
  { // 1
    statement: `
      A terminal may be used to control multiple sessions.
    `,
    value: false,
    explain: `
      If a terminal is used to control multiple sessions then
      it defeats the purpose of having sessions.  Specifically,
      a terminal may be the controlling terminal of at most
      one session.
    `,
  },
  { // 2
    statement: `
      A process group continues to exist even if the process
      group leader terminates.
    `,
    value: true,
    explain: `
      The process group terminates only when the last member process
      leaves the process group.  This last process may or may not be
      the process group leader.
    `,
  },
  { // 3
    statement: `
      Any process in a session can always read input from the terminal
      associated with that session.
    `,
    value: false,
    explain: `
      Only processes in the foreground process group can read
      input from the terminal.
    `,
  },
  { // 4
    statement: `
      It is possible that a process in a background process group can
      write to the terminal associated with that session.
    `,
    value: true,
    explain: `
      This will be allowed if the terminal controller is set up to
      permit such output.  This is the default situation, but using
      the command \`stty tostop\` will set up the terminal control to
      not permit a background process to perform output to the
      terminal.  After that command, any attempt by a background
      process to perform terminal output will result in a \`SIGTTOU\`
      signal which will stop the process.
    `,
  },
  { // 5
    statement: `
      The reason setting up a daemon requires a \`fork()\` followed
      by \`setsid()\` is so that the forked process is a process
      group leader.
    `,
    value: false,
    explain: `
      The reason for the \`fork()\` is precisely the opposite;
      a prerequisite for calling \`setsid()\` is that the
      calling process is *not* a process group leader which is
      ensured by making the call from a freshly forked process.
    `,
  },
  { // 6
    statement: `
      The expression \`getpid() == getpgrp()\` returns non-zero
      iff the calling process is the leader of a process group.
    `,
    value: true,
    explain: `
      The \`getpid()\` call returns the PID of the current process and
      \`getpgrp()\` returns the ID of the process's group and a
      process group leader has it's PID equal to that of its process
      group.
    `,
  },
  { // 7
    statement: `
      A session leader is always a group leader.
    `,
    value: true,
    explain: `
      When \`setsid()\` successfully creates a new session, it makes
      the calling process both a session leader and a group leader.
      Any attempt to transfer a session leader into a new group
      using \`setpgrp()\` will fail with \`errno\` set to \`EPERM\`.
     `,
  },
  { // 8
    statement: `
      Any attempt to \`open()\` the controlling terminal \`/dev/tty\`
      immediately after a successful call to \`setsid()\` will fail.
    `,
    value: true,
    explain: `
      After a successful call to \`setsid()\` a process will not have
      a controlling terminal; hence any attempt to \`open()\` the
      controlling terminal will fail.
    `,
  },
  { // 9
    statement: `
      If the PID of a process is equal to its process group ID
      then it must be a group leader.
    `,
    value: true,
    explain: `
      This is how a process group leader is identified.
    `,
  },
  { // 10
    statement: `
      The PID of a login shell will be equal to its session ID.
    `,
    value: true,
    explain: `
      Logging in starts a new session identified by the PID
      of the login process.  Hence the PID of a login shell
      will equal to the session ID.
    `,
  },
  { // 11
    statement: `
      The PID of a foreground process is equal to its terminal process
      group ID.      
    `,
    value: false,
    explain: `
      A foreground process has control over the terminal but there
      could be multiple foreground processes.  Hence the terminal
      process group ID will be the process group ID of the foreground
      process group; this will equal to a process PID only for
      the group leader of the foreground process group.
    `,
  },
  { // 12
    statement: `
      If two processes are in the same process group, then they 
      must be part of the same pipeline.
    `,
    value: false,
    explain: `
      Shells will usually set up all processes in a pipeline to be in
      the same process group, but that does not necessarily mean that
      all processes in the same process group are part of the same
      pipeline.  In fact, it is possible to put any two processes
      into the same process group using \`setpgid()\` as long as
      they are part of the same session.
    `,
  },
  { // 13
    statement: `
      A process group leader can have a parent PID of 1.
    `,
    value: true,
    explain: `
      That is perfectly legitimate; if the parent PID is 1, then it
      means that the parent process has terminated, but this process
      is still continuing execution as a process group leader.
    `,
  },
  { // 14
    statement: `
      A job control shell will put each job (or pipeline) into
      its own process group.
    `,
    value: true,
    explain: `
      Putting each job into its own process group makes it easy
      to control the job using signals to signal the entire process
      group.
    `,
  },

];

module.exports = ProcRelTrueFalse;
Object.assign(ProcRelTrueFalse, {
  id: 'procRelTrueFalse',
  title: 'Process Relationships True/False',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});



if (process.argv[1] === __filename) {
  console.log(new ProcRelTrueFalse().qaText());
}
