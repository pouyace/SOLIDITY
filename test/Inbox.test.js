const assert = require('assert');
const ganache = require('ganache-cli'); //built-in module
const Web3 = require('Web3');  // Web3 Class
const web3 = new Web3(ganache.provider()); // Web3 instance
const {interface, bytecode} = require('../compile');

let accounts;
let inbox;
beforeEach(async () =>{
  //Get a list og all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contracts
  inbox = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data:bytecode, arguments:['Hi there!']})  //initial message
  .send({from:accounts[0], gas:'1000000'});
/*
  web3 is our means of interacting wtih Ethereum network, a portal to everything
  goiong on Ethereum network

  interface = ABI the json file that is a interface between solidity world and javascript world
  deploy() = starts to create an object that can be deployed to the network
  send()   = instructs web3 to send out a transaction that creates this contract
*/
});


describe('Inbox', ()=>{
  it('deploys a contract', ()=>{
    assert.ok(inbox.options.address); //ok = is this value a defined value or not(Null checking)

  });

  // Getter method
  it('has a default message', async ()=>{
    const message = await inbox.methods.message().call();
    //methods contains methods of contract. Call() can convey the sender and gas amount
    assert.equal(message, 'Hi there!')
  });

  // Setter method
  it('Can change the message', async ()=>{
    await inbox.methods.setMsg('Bye').send({ from:accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Bye');
  });
});


















// Mocha Tutorial
// Change this: package.json -> "test":"mocha"
// Command:     npm run test
/*
class Car{
  park(){
    return 'stopped';
  }

  drive(){
    return 'vroom';
  }
}

let car;
beforeEach(()=>{
  car = new Car();
});

describe('Car', () =>{
  it('can park', ()=>{
    assert.equal(car.park(), 'stopped');
  });

  it('can drive', ()=>{
    assert.equal(car.drive(), 'vroom');
  });
});

*/
