pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());
    uint testPetId = 8;

    function testUserCanAdoptPet() public {
        uint expected = testPetId;
        uint result = adoption.adopt(expected);

        Assert.equal(result,expected,"Adoption of expected pet ID should be received");
    }

    function testGetAdopterAddressByPetId() public {
        address expected = this;
        address result = adoption.adopters(testPetId);

        Assert.equal(result,expected,"This address should be received as adopter");
    }

    function testGetAdopterAddressByPetIdInArray() public {
        address expected = this;
        address[16] memory adoptersArr = adoption.getAdopters();
        address result = adoptersArr[8];


        Assert.equal(result,expected,"This address should be received as adopter");
    }
}
