# Proof-of-Work Blockchain Project

## ChainShot Bootcamp Week 1 homework
Single miner full-node implementation of a PoW blockchain running on one machine, based on the source code from https://github.com/ChainShot/PoW-Chain.

### Using the blockchain
1. Start up the server with terminal
```bash
node index
```
2. Open a new terminal tab and change directory into the scripts, run startMining.js to get the blockchain started. Switch to the first terminal tab to see each block as it is mined
```bash 
cd scripts
node startMining
```
3. When you're done playing with the blockchain, run stopMining.js in the scripts folder. The blockchain state is saved to a local file at `./block-state/blockchain.json` which is loaded the next time you start mining.
```bash
node stopMining
```

### Key Features
✅ Blockchain state saved and read locally 

✅ Uses bitcoin's UTXO approach for keeping track of account balances

✅ Block difficulty automatically adjusted every 10 blocks by a factor of 2 when average blocktime deviates 10% from the desired value of 10s

✅ Send valid transactions to the mempool for the blockchain to process using the following code. Replace the fields in <> with the appropriate values:
```bash
node sendTransaction <sender address> <amount> <recipient address> <fee to miners> <signature> 
```
See next point for how to generate valid signatures.

✅ Uses elliptic library ECDSA signatures for authenticating transactions. Generate a valid signature hash by making changes to the parameters in the offlineSignature.js file and then run it `node offlineSignature.js`. This is done for security purposes.

### Possible Future Work
- Build a frontend for easier submission of transactions 
- Allow multiple nodes/miners to connect to network for mining
- Broadcasting of new blocks to network
- Ability for network to come to consensus

