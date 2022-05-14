class Blockchain {
  constructor(json) {
    if(json) Object.assign(this, json);
    this.blocks = json ? json.blocks : [];
  }
  addBlock(block) {
    this.blocks.push(block);
  }
  blockHeight() {
    return this.blocks.length;
  }
}

module.exports = Blockchain;
