pragma solidity ^0.4.17;

contract Adoption {
    address[16] public adopters;

    function adopt(uint petId) public returns (uint){
        // pet exists
        require(0 <= petId && 16 > petId);

        // adopt pet
        adopters[petId] = msg.sender;

        // return petId
        return petId;
    }

    function adopters() public view returns (address[16]){
        return adopters;
    }

}
