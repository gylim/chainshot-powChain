const Blockchain = require('./models/Blockchain');
const fs = require('fs');

let db;
if (fs.existsSync('./block-state/blockchain.json')) {
  db = JSON.parse(fs.readFileSync('./block-state/blockchain.json'));
} else {
  db = {
    blockchain: new Blockchain(),
    utxos: [],
  }
}

module.exports = db;
