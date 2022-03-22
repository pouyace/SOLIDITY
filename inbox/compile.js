const path = require('path'); // Path module
const fs   = require('fs');   // File reader module
const solc = require('solc'); // Solidity compiler module

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol'); // Read source file
const source = fs.readFileSync(inboxPath, 'utf8'); //Source content

module.exports = solc.compile(source, 1).contracts[':Inbox'];  //Compile source file and makes it ready to import in other files
//Contract Address: 0x8b82dCAA321237D6AD73475BebF201b90936E75B
