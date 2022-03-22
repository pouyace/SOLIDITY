const assert = require('assert');
const ganache = require('ganache-cli'); //built-in module
const Web3 = require('Web3');  // Web3 Class
const web3 = new Web3(ganache.provider()); // Web3 instance
const {interface, bytecode} = require('../compile');

let accounts;
let lottery;
beforeEach(async () =>{
  //Get a list og all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contracts
  lottery = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data:bytecode})  //initial message
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
    assert.ok(lottery.options.address); //ok = is this value a defined value or not(Null checking)
  });

  it('allows one account to enter', async()=>{
      await lottery.methods.enter().send({from:accounts[0], value:web3.utils.toWei('0.02', 'ether')});
      const players = await lottery.methods.getPlayers().call({from:accounts[0]});
      assert.equal(accounts[0], players[0]);
      assert.equal(1, players.length);
  });

  it('allows multiple accounts to enter', async()=>{
      await lottery.methods.enter().send({from:accounts[0], value:web3.utils.toWei('0.02', 'ether')});
      await lottery.methods.enter().send({from:accounts[1], value:web3.utils.toWei('0.02', 'ether')});
      await lottery.methods.enter().send({from:accounts[2], value:web3.utils.toWei('0.02', 'ether')});
      await lottery.methods.enter().send({from:accounts[3], value:web3.utils.toWei('0.02', 'ether')});

      const players = await lottery.methods.getPlayers().call({from:accounts[0]});
      assert.equal(accounts[0], players[0]);
      assert.equal(accounts[1], players[1]);
      assert.equal(accounts[2], players[2]);
      assert.equal(accounts[3], players[3]);
      assert.equal(4, players.length);
  });
  // error catching.

  it('requires a minimum amount of ether to enter', async()=>{
    try{
      await lottery.methods.enter.send({from:accounts[0], value:0});
      assert(false);
    }catch (err){
      assert.ok(err);
    }
  });


  it('only manager can call pickWinner', async()=>{
    try{
      await lottery.methods.pickWinner.send({from:accounts[1]});
      assert(false);
    }catch (err){
      assert.ok(err);
    }
  });


  it('sends money to the winner and resets the players array', async()=>{
    await lottery.methods.enter().send({from:accounts[0], value:web3.utils.toWei('2', 'ether')});
    const initailBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({from:accounts[0]});
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initailBalance;
    assert(difference > web3.utils.toWei('1.8', 'ether'));
    const playersCount = await lottery.methods.getPlayers().call({from:accounts[0]});
    assert.equal(0, playersCount.length);
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
