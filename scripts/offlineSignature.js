const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

// Generate keys
let key = ec.keyFromPrivate('ce54949c332aec9df174d3eec6ff4f3c1662d7eb3ba4522a301069ca94c2e3bd');

const body = JSON.stringify({
    sender: '049a1bad614bcd85b5f5c36703ebe94adbfef7af163b39a9dd3ddbc4f286820031dfcb3cd9b3d2fcbaec56ff95b0178b75d042968462fbfe3d604e02357125ded5',
    amount: 2,
    recipient: '044e88533654324b0b03ecd89d7281f3fa45158d7832afaee3732ef745897104a1a6e8a7757906b3b4040aa031fcf7b471af943b9b4d558fff34ac9ac5ac98314d',
    fee: 0
});
const msgHash = SHA256(body).toString();
const signature = key.sign(msgHash).toDER('hex');
console.log(signature);