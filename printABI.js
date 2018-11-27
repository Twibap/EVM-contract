// https://medium.com/@piyopiyo/how-to-get-contract-abi-in-truffle-22d0c0457ceb
const fs = require('fs');
const contract = JSON.parse(fs.readFileSync('./build/contracts/Vendor.json', 'utf8'));
console.log(JSON.stringify(contract.abi));
