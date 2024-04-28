import { expect } from "chai";
import { ethers } from "hardhat";
import { UmbrellaToken } from "../typechain-types/UmbrellaToken";
import { Signer } from "ethers";

describe("UmbrellaToken", function () {
    let umbrellaToken: UmbrellaToken;
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;

    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy the contract using the first signer which is by default the deployer
        const tokenFactory = await ethers.getContractFactory("UmbrellaToken", owner);
        umbrellaToken = await tokenFactory.deploy();
        // No need to call .deployed() after deploy, it's already considered deployed if no errors
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            // Adjust depending on your contract's features; if it has an owner() function or similar
            // expect(await umbrellaToken.owner()).to.equal(await owner.getAddress());
        });

        it("Initial total supply should be zero", async function () {
            expect(await umbrellaToken.totalSupply()).to.equal(0);
        });
    });

    describe("Minting", function () {
        it("Allows the admin to mint tokens", async function () {
            const adminAddr = await owner.getAddress();
            // Ensure your contract has this method or adjust accordingly
            // await umbrellaToken.grantRole(await umbrellaToken.MINTER_ROLE(), adminAddr);
            await umbrellaToken.mint(adminAddr, 1000);
            expect(await umbrellaToken.balanceOf(adminAddr)).to.equal(1000);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const addr1Address = await addr1.getAddress();
            await umbrellaToken.mint(addr1Address, 1000);
            await umbrellaToken.connect(addr1).transfer(await addr2.getAddress(), 500);
            expect(await umbrellaToken.balanceOf(await addr2.getAddress())).to.equal(500);
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            const addr1Address = await addr1.getAddress();
            await expect(umbrellaToken.connect(addr1).transfer(await addr2.getAddress(), 1))
                .to.be.revertedWith("ERC20: transfer amount exceeds balance");
        });
    });

    describe("Burning", function () {
        it("Allows users to burn their tokens", async function () {
            const addr1Address = await addr1.getAddress();
            await umbrellaToken.mint(addr1Address, 500);
            await umbrellaToken.connect(addr1).burn(500);
            expect(await umbrellaToken.balanceOf(addr1Address)).to.equal(0);
        });
    });
});
