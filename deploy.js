const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
  'answer another piano afraid cargo protect pilot dizzy eight panther put slender',
  'https://rinkeby.infura.io/v3/0471966e9f6d435486c060a460773285'
);

const web3 = new Web3(provider);

const deploy = async () =>{
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode, arguments:['Hi Pouya']})
    .send({gas:'1000000', from:accounts[0]});

    console.log('Contract deployed to ', result.options.address);
    provider.engine.stop();
};

deploy();

//////