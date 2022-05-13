const {utxos} = require('../db');

class Transaction {
  constructor(inputs, outputs) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.fee = this.inputs.length ? this.inputs.reduce((acc, val) => (acc + val.amount), 0) - 
      this.outputs.reduce((acc, val) => (acc + val.amount), 0) : 0
  }
  execute() {
    this.inputs.forEach((input) => {
      input.spent = true;
    });
    this.outputs.forEach((output) => {
      utxos.push(output);
    });
  }
}

module.exports = Transaction;
