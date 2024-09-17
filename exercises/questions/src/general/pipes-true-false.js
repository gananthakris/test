'use strict';

const TIMESTAMP = 'Time-stamp: <2022-03-08 20:07:01 umrigar>';

const {TrueFalseQuestion, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class PipesTrueFalse extends TrueFalseQuestion {

  constructor(params) {
    super(params, STATEMENTS);
  }

}

const STATEMENTS = [
  { // 1
    statement: `
      An \`open()\` for reading a FIFO without the \`O_NONBLOCK\` flag
      will block until some process opens it for writing.
    `,
    value: true,
    explain: `
      FIFOs are self-synchronized; this behavior prevents reading
      from a pipe which cannot have data because it has no writers.
    `,
  },
  { // 2
    statement: `
      An \`open()\` for reading a FIFO with the \`O_NONBLOCK\` flag
      specified will always result in an error.
    `,
    value: false,
    explain: `
      An \`open()\` for reading a FIFO with the \`O_NONBLOCK\` flag
      specified should return immediately with success.
    `,
  },
  { // 3
    statement: `
      An \`open()\` for writing a FIFO without the \`O_NONBLOCK\` flag
      will block until some process opens it for reading.
    `,
    value: true,
    explain: `
      FIFOs are self-synchronized; this behavior prevents writing
      to a FIFO which is not currently being read.
    `,
  },
  { // 4
    statement: `
      A FIFO can portably be opened \`O_RDWR\` to prevent receiving
      EOF when reading the FIFO.
    `,
    value: false,
    explain: `
      Though \`O_RDWR\` is supported for FIFOs under Linux, it
      is not supported under POSIX.
    `,
  },
  { // 5
    statement: `
      If all writing processes have closed a pipe, a reading 
      process will receive an EOF once all data in the pipe
      is exhausted.
    `,
    value: true,
    explain: `
      This behavior avoids having the reading process block indefinitely.
    `,
  },
  { // 6
    statement: `
      A read from a pipe which has no data will block.
    `,
    value: false,
    explain: `
      This statement will not hold when the pipe has been opened with
      the \`O_NONBLOCK\` flag and there is a potential writing
      process.
    `,
  },
  { // 7
    statement: `
      It is guaranteed that the data written  using a single \`write()\`
      of fewer than \`PIPE_BUF\` bytes will not be interspersed with
      data from other \`write()\`'s.
    `,
    value: true,
    explain: `
      This behavior avoids needing complex
      protocols to manage pipes having multiple writers.
    `,
  },
  { // 8
    statement: `
      Writing to a pipe which has been closed by all reading 
      processes will block.
    `,
    value: false,
    explain: `
      Writing to a pipe which has been closed by all reading 
      processes will result in an error.
    `,
  },
  { // 9
    statement: `
      Writing to a pipe which has been closed by all reading 
      processes will result in an error.
    `,
    value: true,
    explain: `
      This behavior avoids loosing data which is written
      to the pipe but never read.
    `,
  },
  { // 10
    statement: `
      I/O involving a pipe requires a transition to the kernel.
    `,
    value: true,
    explain: `
      Pipes are kernel data structures.
    `,
  },
  { // 11
    statement: `
      It is possible to directly read data at a specific offset within
      a pipe.
    `,
    value: false,
    explain: `
      Pipes are strictly first-in, first-out.
    `,
  },
];

module.exports = PipesTrueFalse;
Object.assign(PipesTrueFalse, {
  id: 'pipesTrueFalse',
  title: 'Pipes True/False',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});



if (process.argv[1] === __filename) {
  console.log(new PipesTrueFalse().qaText());
}
