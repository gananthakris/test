'use strict';

const TIMESTAMP = 'Time-stamp: <2022-04-23 14:28:08 umrigar>';

const {TrueFalseQuestion, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class PosixIpcTrueFalse extends TrueFalseQuestion {

  constructor(params) {
    super(params, STATEMENTS);
  }

}

const STATEMENTS = [
  { // 1
    statement: `
      The name of a POSIX IPC facility must correspond to a filesystem.path.
    `,
    value: false,
    explain: `
      Even though the name of a POSIX IPC facility looks like a filesystem
      path, it need not correspond to a path in the filesystem.
    `,
  },
  { // 2
    statement: `
      The \`sem_unlink(name)\` call will immediately destroy the
      semaphore named \`name\`.
    `,
    value: false,
    explain: `
      The semaphore is destroyed only after all processes that
      have the semaphore open close it.
    `,
  },
  { // 3
    statement: `
      The \`mq_unlink(name)\` call will immediately remove
      \`name\` from the namespace of message queue names.
    `,
    value: true,
    explain: `
      The name is removed immediately and an attempt to
      \`mq_open(name)\` will fail.  However, the message queue which
      was referenced by \`name\` is destroyed only after all processes
      that have the semaphore open close it.
    `,
  },
  { // 4
    statement: `
      When calling \`shm_open()\` specifying the \`O_EXCL\` flag without
      also specifying the \`O_CREAT\` flag does not make sense.
    `,
    value: true,
    explain: `
      The \`O_EXCL\` flag specifies that the call should return an
      error if an attempt is made to *create* the shared memory object 
      when it already exists.  Hence using it without \`O_CREAT\` does
      not make sense.

      Note that this is also the case for the \`O_EXCL\` flag when
      used with \`open(2)\` for opening filesystem paths.
    `,
  },
  { // 5
    statement: `
      It is possible to set up the creation of a named POSIX semaphore
      such that the attempt will fail if a semaphore with the 
      specified name already exists.
    `,
    value: true,
    explain: `
      This is the case if the \`O_EXCL\` flag is specified along with the
      \`O_CREAT\` flag in the call to \`sem_open()\`.  Note that the
      check and creation is *atomic*.
    `,
  },
  { // 6
    statement: `
      POSIX message queues are always asynchronous.
    `,
    value: false,
    explain: `
      By default, POSIX message queues are synchronous unless the
      \`O_NONBLOCK\` flag is specified in the \`mq_open()\` call.
    `,
  },
  { // 7
    statement: `
      The descriptors for open POSIX message queues are inherited
      across \`fork()\` and \`exec()\`.
    `,
    value: false,
    explain: `
      Descriptors for open POSIX message queues are indeed inherited
      across \`fork()\` but are not inherited across \`exec()\`.  In fact,
      opening a message queue will automatically set the close-on-exec
      flag.
    `,
  },
  { // 8
    statement: `
      Messages sent to POSIX message queues are delivered using
      a first-come first-serve discipline.
    `,
    value: false,
    explain: `
      Messages have priority and higher priority messages are
      delivered before lower priority messages irrespective of
      the order in which they were sent.
    `,
  },
  { // 9
    statement: `
      Once a named semaphore is created, it continues to exist until
      it is explicitly unlinked and no process has it open.
    `,
    value: false,
    explain: `
      Named semaphores have *kernel persistence* and do not survive
      system reboots even if they are never unlinked.
    `,
  },
  { // 10
    statement: `
      It is possible to wait on a POSIX semaphore without blocking.
    `,
    value: true,
    explain: `
      This is possible using \`sem_trywait()\` which will return
      an error with \`errno\` set to \`EAGAIN\` if the decrement
      cannot be performed immediately.      
    `,
  },
  { // 11
    statement: `
      Unnamed semaphores must be allocated in shared memory.
    `,
    value: false,
    explain: `
      This is true only if the semaphores are to be used for
      synchronization between multiple processes.  It is not true when
      the semaphores are to be used for synchronization by multiple
      threads within a single process.
    `,
  },
  { // 12
    statement: `
      It is necessary to specify the size of a POSIX shared memory segment 
      when it is created using \`shm_open()\`.
    `,
    value: false,
    explain: `
      The \`shm_open()\` API does not support specifying the size of
      the shared memory segment.  It is necessary to set the size of
      segment subsequently using a call like \`ftruncate)_\` on the descriptor
      returned by \`shm_open()\`.
    `,
  },
  { // 13
    statement: `
      \`mmap()\` can only be used with descriptors returned from
      \`shm_open()\`.
    `,
    value: false,
    explain: `
      \`mmap()\` can be used with descriptors returned from
      \`shm_open()\` but it can also be used with descriptors
      returned from \`open()\` to support memory-mapped files.
    `,
  },
  { // 14
    statement: `
      Once the file descriptor returned by \`shm_open()\` has been
      used to \`mmap()\` a segment into memory, it is permissible to
      close it even though the shared memory segment is still being
      used.
    `,
    value: true,
    explain: `
      The file descriptor can be closed if the application no longer
      needs it; exceptions would include needing to make calls to
      \`fstat()\` or \`ftruncate()\`.
    `,
  },

];

module.exports = PosixIpcTrueFalse;
Object.assign(PosixIpcTrueFalse, {
  id: 'posixIpcTrueFalse',
  title: 'POSIX IPC True/False',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});



if (process.argv[1] === __filename) {
  console.log(new PosixIpcTrueFalse().qaText());
}
