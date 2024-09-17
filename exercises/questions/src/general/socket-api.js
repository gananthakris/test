'use strict';

const TIMESTAMP = 'Time-stamp: <2022-04-23 14:51:50 umrigar>';

const {ChoiceQuestion, Rand, umtParse, emacsTimestampToMillis} =
      require('gen-q-and-a');

class SocketApi extends ChoiceQuestion {

  constructor(params) {
    super(params);
    this.addParamSpec(PARAMS);
    for (let i = 0; i < 5; i++) {
      this.choice(params => params.choices[i]);
    }
    this.freeze();
    this.addQuestion(question(this.params));
    this.addExplain(explain(this.params, this.choiceOrder()));
    this.makeContent();
  }

}

module.exports = SocketApi

Object.assign(SocketApi, {
  id: 'socketApi',
  title: 'Socket API',
});




function question(params) {
  const { type } = params;
  let str = '';
  str += `
    Which of the following sequence of socket-API calls is the
    correct sequence for setting up a TCP ${type}?
  `;
  return str;
}

function explain(params, choiceOrder) {
  const { type } = params;
  let str = '';
  if (type === 'server') {
    str += `
      To set up a server, it is first necessary to create a \`socket()\`,
      then \`bind()\` its local address, starting to \`listen()\` in
      passive mode and finally \`accept()\` a remote connection.
    `;
  }
  else {
    str += `
      To set up a client, it is first necessary to create a \`socket()\`,
      then \`connect()\` it to the remote server.
    `;
  }
  return str;
}

function randChoices(type) {
  const pairs = Object.entries(API_SEQS);
  const goodChoice = pairs.find(pair => pair[1] === type)[0];
  const badChoices =
    pairs.filter(pair => pair[1] !== type).map(pair => pair[0]);
  return [ goodChoice, ...Rand.choices(4, badChoices) ];
}

const API_SEQS = {
  '`socket()`, `bind()`, `listen()`, `accept()`.': 'server',
  '`socket()`, `connect()`.': 'client',
  '`socket()`, `bind()`, `accept()`.': false,
  '`socket()`, `bind()`, `listen()`., `connect()`': false,
  '`socket()`, `listen()`, `accept()`.': false,
  '`socket()`, `bind()`, `connect()`.': false,
  '`connect()`.': false,
  '`accept()`.': false,
  '`socket()`.': false,
};
  

const PARAMS = [
  { type: () => Rand.choice(['client', 'server']),
  },
  { choices: ({type}) => randChoices(type) },
];

if (process.argv[1] === __filename) {
  console.log(new SocketApi().qaText());
}
