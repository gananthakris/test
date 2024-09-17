const {Rand} = require('gen-q-and-a');


/**
  File properties:
  name: required
  perms: in ls -l format (except first char); required
  user, group: not required
 */



function lsOut(files) {
  let text = '';
  const width = p =>
    files.map(f => f[p].length)
    .reduce((acc, v) => v > acc ? v : acc);
  const [uwidth, gwidth] = [ width('user'), width('group') ];
  const fileCmp =
    (f1, f2) => f1.name < f2.name ? -1 : f1.name > f2.name ? +1 : 0;
  for (const f of files.sort(fileCmp)) {
    text += `-${f.perms} 1`;
    const user = f.user ?? Rand.choice(USERS);
    text += ` ${user.padEnd(uwidth)}`;
    const group = f.group ?? Rand.choice(GROUPS);
    text += ` ${group.padEnd(gwidth)}`;
    const size = Rand.int(1, 10000).toString();
    text += ` ${size.padStart(WIDTHS.size)}`;
    const d = new Date();
    text += ` ${MONTHS[d.getMonth()]} ${d.getDate().toString().padStart(2)}`;
    const hour = Rand.int(0, d.getHours() + 1).toString();
    const minute = Rand.int(0, d.getMinutes() + 1).toString();
    text += ` ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    text += ` ${f.name}\n`;
  }
  return text;
}

module.exports = lsOut;

const WIDTHS = {
  size: 5,
};


const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'
];

const USERS = [
  'jjones99', 'shicks99', 'mliu92', 'rpatel02', 
];

const GROUPS = [
  'students', 'staff', 'admin', 'wheel',
];

/*
console.log(lsOut([
  { name: 'script.sh', perms: 'rwxr-wr--' },
  { name: 'foo.c', perms: 'rw-r--r--' },
]));
*/
