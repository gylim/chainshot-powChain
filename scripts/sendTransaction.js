const client = require('./client');
const [_, __, sender, amount, recipient, fee, signature] = process.argv;

client.request('sendTransaction', [sender, amount, recipient, fee, signature], function(err, response) {
  if(err) throw err;
  console.log(response.result);
});
