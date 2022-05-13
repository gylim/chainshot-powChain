const Block = require('./models/Block');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
const fs = require('fs');
const {performance} = require('perf_hooks');
const db = require('./db');
const mempool = require('./mempool');
const {MINER_PUBLIC_KEY, BLOCK_REWARD, BLOCK_SIZE} = require('./config');
let TARGET_DIFFICULTY = BigInt("0x" + "0".repeat(5) + "F".repeat(59));
let avgBlocktime = [];

let mining = false;

function startMining() {
  mining = true;
  mine();
}

function stopMining() {
  mining = false;
  fs.writeFile('./block-state/blockchain.json', JSON.stringify(db), (err) => {
    if (err) throw err;
    console.log("Blockchain saved!")
  });
}

function mine() {
  if(!mining) return;

  const block = new Block();
  let highest;

  // sort mempool txns by fee and include those with highest fee
  if (mempool.txns.length) {
    const orderedTxns = mempool.txns.slice().sort((a,b) => (a.fee - b.fee));
    highest = orderedTxns.slice(0, 
      orderedTxns.length < BLOCK_SIZE ? orderedTxns.length : BLOCK_SIZE);
    highest.forEach(txn => {
      block.addTransaction(txn)
    });
    const totalFees = highest.reduce((acc, curr) => acc+curr.fee, 0);
    const feeUTXO = new UTXO(MINER_PUBLIC_KEY, totalFees);
    const feeTX = new Transaction([], [feeUTXO]);
    block.addTransaction(feeTX);
  }
  
  // create coinbase tx and add to block
  const coinbaseUTXO = new UTXO(MINER_PUBLIC_KEY, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);
  
  // mine and measure time taken
  const start = performance.now();
  while(BigInt('0x' + block.hash()) >= TARGET_DIFFICULTY) {
    block.nonce++;
  }
  const end = performance.now();
  avgBlocktime.push(end - start);

  block.execute();
  // add block to blockchain and clear txns from mempool
  db.blockchain.addBlock(block);
  if (mempool.txns.length) {
    mempool.clearTxns(highest);
  }
  console.log(`Mined block #${db.blockchain.blockHeight()} - 
    hash: ${block.hash()}, 
    nonce: ${block.nonce}, 
    txn count: ${block.transactions.length},
    blocktimes: ${avgBlocktime}`);
  
  // adjust difficulty every 10 blocks
  if (avgBlocktime.length === 10) {
    const average = avgBlocktime.reduce((a,b) => a + b, 0) / 10;
    if (average > 1100) {
      TARGET_DIFFICULTY *= BigInt(2);
    } else if (average < 900) {
      TARGET_DIFFICULTY /= BigInt(2);
    }
    avgBlocktime = [];
  }
  mine();
}

module.exports = {
  startMining,
  stopMining,
};
