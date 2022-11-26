const TenderOnChain = artifacts.require("TenderOnChain");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('TenderOnChain', accounts => {
  /**
  * ------------------------------------------
  * @dev test in localy witch ganache accounts
  * @command truffle test
  * ------------------------------------------
  */

  /**
  * @dev declarations of variables used for the unit test of the contract.
  */
  const _owner = accounts[0];
  const _user1 = accounts[1];
  const _user2 = accounts[2];
  const _user3 = accounts[3];
  const _user4 = accounts[4];
  const _user5 = accounts[5];
  const _user6 = accounts[6];

  let tenderOnChainInstance;

  /**
  * @dev Start test.
  */
  describe("Complete test : ", function () {
    /**
     * @dev creation of an instance of the contract to iterate on it.
     */
    beforeEach(async function () {
      tenderOnChainInstance = await Voting.new({from:_owner});
    });

    /**
     * @dev first phase for owner verification.
     */
    describe("Smart contract owner test :", function () {

      it("should define the owner of the smart contract", async () => {
        expect(await tenderOnChainInstance.owner()).to.be.equal(_owner);
      });

      it("should define that the user is not the owner of the smartcontract", async () => {
        expect(await tenderOnChainInstance.owner()).to.not.equal(_user1);
      });
    });

  });

  // it('should read newly written values', async() => {
  //   const TenderOnChainInstance = await TenderOnChain.deployed();
  //   var value = (await TenderOnChainInstance.read.call()).toNumber();

  //   assert.equal(value, 0, "0 wasn't the initial value");

  //   await TenderOnChainInstance.write(1);
  //   value = (await TenderOnChainInstance.read.call()).toNumber();
  //   assert.equal(value, 1, "1 was not written");

  //   await TenderOnChainInstance.write(2);
  //   value = (await TenderOnChainInstance.read.call()).toNumber();
  //   assert.equal(value, 2, "2 was not written");
  // });
});
