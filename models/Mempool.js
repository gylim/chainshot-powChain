class Mempool {
    constructor() {
        this.txns = [];
    }
    clearTxns(arr) {
        this.txns = this.txns.filter(x => (!(arr.includes(x))))
    }
}

module.exports = Mempool;