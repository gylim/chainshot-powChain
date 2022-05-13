const jayson = require('jayson');
const {startMining, stopMining} = require('./mine');
const {PORT} = require('./config');
const {utxos} = require('./db');
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); 
const mempool = require('./mempool');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');

// create a server
const server = jayson.server({
  startMining: function(_, callback) {
    callback(null, 'success!');
    startMining();
  },
  stopMining: function(_, callback) {
    callback(null, 'success!');
    stopMining();
  },
  getBalance: function([address], callback) {
    const ourUTXOs = utxos.filter(x => {
      return x.owner === address && !x.spent;
    });
    const sum = ourUTXOs.reduce((p,c) => p + c.amount, 0);
    callback(null, sum);
  },
  sendTransaction: function([sender, Amount, recipient, Fee, signature], callback) {
    // generate signature from body and public key
    const test = ec.keyFromPublic(sender, 'hex');
    const amount = parseInt(Amount);
    const fee = parseInt(Fee);
    const body = JSON.stringify({sender, amount, recipient, fee});
    const msgHash = SHA256(body).toString();

    // check signature before pushing transaction to mempool
    if (test.verify(msgHash, signature)) {
      const inputs = utxos.filter(x => (x.owner === sender && !x.spent));
      const inputVal = inputs.reduce((acc, val) => (acc + val.amount), 0);
      if (inputVal < (amount + fee) || !inputs.length) {
        throw ('Please try again, invalid transactions submitted');
      } else {
        const newTx = new Transaction(inputs, 
        [new UTXO(recipient, amount), new UTXO(sender, inputVal - amount - fee)]);
        mempool.txns.push(newTx);
        callback(null, "transaction submitted to mempool")
      }
    }
  }
});

server.http().listen(PORT);
