import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { NonTransferableToken } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("NonTransferableToken", function () {

  const NON_TRANSFERABLE_ERROR_MESSAGE = 'Cannot transfer a non-transferable token!';

  describe('hello function', () => {

    it("returns the string 'hello'", async function () {

      const [owner, alice, bob, charlie] = await ethers.getSigners();

      const NonTransferableToken = await ethers.getContractFactory("NonTransferableToken");
      const nonTransferableToken = await NonTransferableToken.deploy();
      await nonTransferableToken.deployed();

      expect(await nonTransferableToken.connect(owner).hello()).to.equal('hello');
      expect(await nonTransferableToken.connect(alice).hello()).to.equal('hello');
      expect(await nonTransferableToken.connect(bob).hello()).to.equal('hello');
      expect(await nonTransferableToken.connect(charlie).hello()).to.equal('hello');

    });

  });

  describe('minting', () => {

    it("allows anyone to mint the next token to themselves", async function () {

      const [owner, alice, bob, charlie] = await ethers.getSigners();

      const NonTransferableToken = await ethers.getContractFactory("NonTransferableToken");
      const nonTransferableToken = await NonTransferableToken.deploy();
      await nonTransferableToken.deployed();

      expect(await nonTransferableToken.next_token_id()).to.equal(0);

      await nonTransferableToken.connect(owner).mint();

      expect(await nonTransferableToken.ownerOf(0)).to.equal(owner.address);
      expect(await nonTransferableToken.next_token_id()).to.equal(1);

      await nonTransferableToken.connect(alice).mint();

      expect(await nonTransferableToken.ownerOf(1)).to.equal(alice.address);
      expect(await nonTransferableToken.next_token_id()).to.equal(2);

      await nonTransferableToken.connect(bob).mint();

      expect(await nonTransferableToken.ownerOf(2)).to.equal(bob.address);
      expect(await nonTransferableToken.next_token_id()).to.equal(3);

      await nonTransferableToken.connect(charlie).mint();

      expect(await nonTransferableToken.ownerOf(3)).to.equal(charlie.address);
      expect(await nonTransferableToken.next_token_id()).to.equal(4);

    });

  });

  describe('Nontransferability', () => {

    let owner: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress, charlie: SignerWithAddress;
    let nonTransferableToken: NonTransferableToken;

    beforeEach(async () => {

      const NonTransferableToken = await ethers.getContractFactory("NonTransferableToken");
      nonTransferableToken = await NonTransferableToken.deploy();
      await nonTransferableToken.deployed();

      [owner, alice, bob, charlie] = await ethers.getSigners();

      await nonTransferableToken.connect(owner).mint();
      await nonTransferableToken.connect(alice).mint();
      await nonTransferableToken.connect(bob).mint();
      await nonTransferableToken.connect(charlie).mint();

    })

    it('cannot be transferred with "transferFrom" function', async () => {

      await expect(nonTransferableToken.connect(owner).transferFrom(owner.address, alice.address, 0)).to.be.revertedWith(NON_TRANSFERABLE_ERROR_MESSAGE);
      await expect(nonTransferableToken.connect(alice).transferFrom(owner.address, alice.address, 1)).to.be.revertedWith(NON_TRANSFERABLE_ERROR_MESSAGE);
      await expect(nonTransferableToken.connect(bob).transferFrom(owner.address, alice.address, 2)).to.be.revertedWith(NON_TRANSFERABLE_ERROR_MESSAGE);
      await expect(nonTransferableToken.connect(charlie).transferFrom(owner.address, alice.address, 3)).to.be.revertedWith(NON_TRANSFERABLE_ERROR_MESSAGE);

    })

  })

});
