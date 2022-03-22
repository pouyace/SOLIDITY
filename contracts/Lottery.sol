pragma solidity ^0.4.17;


contract Lottery{
    address public manager;
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
        /*
        msg is a global variable containing sender address andd data
        and gas and amount of ether sent from sender
        */
    }

    function enter() public payable{
        require(msg.value > .01 ether); // to check the requirements(minimum amount of money in wei)
        players.push(msg.sender);
    }

    function random() private view returns (uint){
        // This function returns a random number
        return uint(keccak256(block.difficulty, now, players)); //built-in function for sha

    }

    function pickWinner() public restricted{
        uint index =  random() % players.length;
        players[index].transfer(this.balance); // Transfer all the wei to the winner
        players = new address[](0); //recreate dynamic arrays
    }

    modifier restricted(){ // used to only allow manager
        require(msg.sender == manager);
        _;  //compiler paste instruction here
    }

    function getPlayers() public view returns (address[]){
        return players;
    }

}
