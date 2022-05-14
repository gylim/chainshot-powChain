const Blockchain = require('./models/Blockchain');
const fs = require('fs');

let db;
if (fs.existsSync('./block-state/blockchain.json')) {
  const temp = JSON.parse(fs.readFileSync('./block-state/blockchain.json'));
  db = {
    blockchain: new Blockchain(temp.blockchain),
    utxos: temp.utxos,
  }
} else {
  db = {
    blockchain: new Blockchain(),
    utxos: [],
  }
}

module.exports = db;
