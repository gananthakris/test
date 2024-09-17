const {MetaWrapper} = require('gen-q-and-a');

const META = MetaWrapper.wrap({
  id: '',
  title: '', //'Systems Programming: Exercises',
  nested: [
    require('./general/meta'),
    //require('./midterm/meta'),
    //require('./final/meta'),
  ],
});

module.exports = META;

if (process.argv[1] === __filename) {
  //note that leaves will print as null because they are Function's
  //which are not handled by JSON
  console.log(JSON.stringify(META, null, 2));
  console.log(META.get('/general').next);
}
