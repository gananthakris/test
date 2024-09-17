'use strict';

const TIMESTAMP = 'Time-stamp: <2022-04-22 00:08:19 umrigar>';

const {ChoiceQuestion, Rand, umtParse, emacsTimestampToMillis} =
      require('gen-q-and-a');

class Procrel extends ChoiceQuestion {

  constructor(params) {
    super(params);
    this.addParamSpec(PARAMS);
    for (let i = 0; i < 5; i++) {
      this.choice(params => `
        The listing
        \n\`\`\`\n${listingText(params, params.choices[i])}\n\`\`\`
      `);
    }
    this.freeze();
    this.addQuestion(question(this.params));
    this.addExplain(explain(this.params, this.choiceOrder()));
    this.makeContent();
  }

}

module.exports = Procrel

Object.assign(Procrel, {
  id: 'procrel',
  title: 'Process Relationships',
});

const N_JOBS = 3;
const MAX_JOB_PROCESSES = 4;
const MIN_JOB_PID = 3000;

function question(params) {
  const { type } = params;
  let str = '';
  str += `
    Given the following sequence of commands typed into a job-control shell:

    \n\`\`\`\n${comms(params)}\n\`\`\`

    which one of the following \`ps\`-style listings is correct?
    
  `;
  return str;
}

function explain(params, choiceOrder) {
  const { commInfos, choices } = params;
  const listing = choices[0];
  let join = list => list.slice(0, -1).join(', ') + ' and ' + list.slice(-1)[0];
  let str = '';
  for (let i = 0; i < N_JOBS; i++) {
    const { pipe, comms } = commInfos[i];
    const isFg = (i === N_JOBS - 1);
    const bgCh = isFg ? "" : " &";
    const bg = isFg ? 'foreground' : 'background';
    const pid0 = listing[i][0].pid;
    const commsPids =
      comms.map((comm, j) => `\`${comm}\` with PID ${listing[i][j].pid}`);
    str += `
      The command \`${pipe}${bgCh}\` starts a job containing 
      processes ${join(commsPids)} in the *${bg}*.  
      All processes in this job have PGID ${pid0}; 
      i.e. ${pid0} serves to identify this job.
    `;
  }
  const tpgid = listing[0][0].tpgid;
  str += `
    Since the foreground job has PGID ${tpgid}, the TPGID for
    each process must be ${tpgid}.  The only choice having
    TPGID == ${tpgid} for all processes is (#{_0}).    
  `;
  return str;
}

function makeChoices(params) {
  const { perturbIndexes } = params;
  const listing = makeListing(params);
  const choices = [ listing ];
  for (const i of perturbIndexes) {
    const perturb = PERTURBS[i](listing);
    choices.push(perturb);
  }
  return choices;
}

function comms(params) {
  const { commInfos } = params;
  let str = '';
  for (const [i, commInfo] of commInfos.entries()) {
    const bg = (i === N_JOBS - 1) ? "" : " &";
    str += `$ ${commInfo.pipe}${bg}\n`;
  }
  return str;
}


function makeListing(params) {
  const { commInfos, shPid, jobsPids, sid } = params;
  const tpgid = jobsPids.slice(-1)[0][0];
  const listing = [];
  for (let i = 0; i < N_JOBS; i++) {
    const commInfo = commInfos[i];
    const jobPids = jobsPids[i];
    const pgid = jobPids[0];
    const jobInfos = [];
    for (const [j, comm] of commInfo.comms.entries()) {
      const pid = jobPids[j];
      const ppid = shPid;
      jobInfos.push({pid, ppid, pgid, tpgid, sid, comm});
    }
    listing.push(jobInfos);
  }
  return listing;
}

function listingText(params, listing) {
  const { listingPerm: perm } = params;
  const COL_WIDTH = 6;
  const cols = [ 'pid', 'ppid', 'pgid', 'tpgid', 'sid', 'comm' ];
  let str = '';
  str += cols.map(c => c.toUpperCase().padEnd(COL_WIDTH)).join(' ') + '\n';
  for (const p of perm) {
    const jobInfo = listing[p];
    for (const info of jobInfo) {
      str += cols.map(c => info[c].toString().padEnd(COL_WIDTH)).join(' ');
      str += '\n';
    }
  }
  return str;
}

function randJobsPids() {
  const jobsPids = [];
  for (let i = 0; i < N_JOBS; i++) {
    const pid0 = Rand.int(MIN_JOB_PID + i*1000, MIN_JOB_PID + (i+1)*1000);
    const jobPids = range(MAX_JOB_PROCESSES).map((_, j) => pid0 + j);
    jobsPids.push(jobPids);
  }
  return jobsPids;
}

function perturbFg(n) {
  //make n'th job foreground job
  return listing => {
    const tpgid = listing[n][0].pid;
    return listing.map(jobInfos => jobInfos.map(info => ({ ...info, tpgid })));
  };
}

function multiFg(n) {
  //return multiple fg jobs
  return listing => {
    const tpgid = listing[n][0].pid;
    const copy = [ ...listing ];
    copy[n] = copy[n].map(info => ({ ...info, tpgid }));
    return copy;
  };
}


function range(n) {
  return Array.from({length: n}).map((_, i) => i);
}

const PROCESSES = [
  p => ({
    pipe: `
      find ${p.dir1} -name '*.${p.ext1}' -exec grep '${p.key1}' {} \\; | wc -l
    `.trim(),
    comms: [ 'find', 'wc', 'grep' ],
  }),
  p => ({
    pipe: `
      find ${p.dir2} -type p -exec ls -tl {} \\;
    `.trim(),
    comms: [ 'find', 'ls' ],
  }),
  p => ({
    pipe: `
      find -L ${p.dir3} -name '*.csv' -print | cut -d, -f 1-4,6
    `.trim(),
    comms: [ 'find', 'cut' ],
  }),
  p => ({
    pipe: `
      find -H ${p.dir4} -size +100M -exec stat {} \\;
    `.trim(),
    comms: [ 'find', 'stat' ],
  }),
  p => ({
    pipe: `
      ls -l *.${p.ext2} | grep '.w. '
    `.trim(),
    comms: [ 'ls', 'grep' ],
  }),
  p => ({
    pipe: `
      grep '${p.key2}' *.${p.ext3} | wc -l
    `.trim(),
    comms: [ 'grep', 'wc' ],
  }),
  p => ({
    pipe: `
      ps -ef | grep '${p.user1}'
    `.trim(),
    comms: [ 'ps', 'grep' ],
  }),
  p => ({
    pipe: `
      ps -ef | grep '${p.user2}' | wc -l
    `.trim(),
    comms: [ 'ps', 'grep', 'wc' ],
  }),
];

const PERTURBS = [ //all currently used
  perturbFg(0),
  perturbFg(1),
  multiFg(0),
  multiFg(1),
];


const PARAMS = [
  {
    dir1: () => Rand.choice(['.', '/usr/include', ]),
    dir2: () => Rand.choice(['.', '..', '~', '~/Downloads', ]),
    dir3: () => Rand.choice(['/usr/data', '~/data', ]),
    dir4: () => Rand.choice(['/var/logs', '~/logs', '~/tmp/logs', ]),
    ext1: () => Rand.choice(['h', 'tcc', 'hpp']),
    ext2: () => Rand.choice(['c', 'h', 'rb', 'py', ]),
    ext3: () => Rand.choice(['js', 'jsx', 'mjs', ]),
    key1: () => Rand.choice(['volatile', 'jmpbuf']),
    key2: () => Rand.choice([ 'var', 'strict', '/usr/bin/node', ]),
    user1: () => Rand.choice(['pgriffith', 'mlee', 'jwatkins', 'smaduro', ]),
    user2: () => Rand.choice(['jsmith', 'sjones', 'tjames', 'rwatson', ]),
    indexes: () => Rand.choices(N_JOBS, range(PROCESSES.length)),
    shPid: () =>  Rand.int(MIN_JOB_PID-1000, MIN_JOB_PID),
    jobsPids: () => randJobsPids(),
    perturbIndexes: () => Rand.choices(4, range(PERTURBS.length)),
    listingPerm: () => Rand.permutation(range(N_JOBS)),
  },
  {
    sid: ({shPid}) => shPid - (Rand.int(0, 2) < 1 ? 0 : Rand.int(0, 500)),
  },
  { _type: 'nonRandom',
    commInfos: p => p.indexes.map(i => PROCESSES[i](p)),
    choices: p => makeChoices(p),
  },
];

if (process.argv[1] === __filename) {
  console.log(new Procrel().qaText());
}
