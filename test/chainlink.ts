const { network, viem } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
//const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
import { parseEther, formatEther } from "viem";

const DECIMALS = "18";
const INITIAL_PRICE = "200000000000000000000";
const priceAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";


async function fixture() {
    const publicClient = await viem.getPublicClient();
    const [deployer, acc1, acc2] = await viem.getWalletClients();
    const mockContract = await viem.deployContract("MockV3Aggregator",[DECIMALS, INITIAL_PRICE]);
    const mockAddress = mockContract.address;
    //const priceContract = await viem.deployContract("PriceConsumerV3", [priceAddress]);
    const priceContract = await viem.deployContract("PriceConsumerV3", [mockContract.address])
    return { priceContract, mockContract, publicClient, deployer, acc1, acc2 };
  }

describe("Deployment", async () => {
    describe("Success", async () => {
  // Test 1
      it("Should define contract addresses correctly", async () => {
        const { priceContract, mockContract } = await loadFixture(fixture);
        const response = await priceContract.read.getPriceFeed();
        assert.equal(response.toLowerCase(), mockContract.address)
        
      })
  // Test 2
      it("should return the same value as the mock", async () => {
        const { priceContract, mockContract } = await loadFixture(fixture);
        const latestPrice = await priceContract.read.getLatestPrice();
        //console.log(latestPrice);
        //const latestAnswer = await mockContract.read.latestAnswer();
        const roundID = await mockContract.read.latestRound();
        const latestAnswer = await mockContract.read.latestAnswer();
        //console.log(latestAnswer);
        assert.equal(latestPrice.toString(), latestAnswer.toString())
        
        
      });
    });
});

// !developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("Price Consumer Unit Tests", async function () {
//           // We define a fixture to reuse the same setup in every test.
//           // We use loadFixture to run this setup once, snapshot that state,
//           // and reset Hardhat Network to that snapshot in every test.
//           async function deployPriceConsumerFixture() {
//               const [deployer] = await ethers.getSigners()

//               const DECIMALS = "18"
//               const INITIAL_PRICE = "200000000000000000000"

//               const mockV3AggregatorFactory = await ethers.getContractFactory("MockV3Aggregator")
//               const mockV3Aggregator = await mockV3AggregatorFactory
//                   .connect(deployer)
//                   .deploy(DECIMALS, INITIAL_PRICE)

//               const priceConsumerV3Factory = await ethers.getContractFactory("PriceConsumerV3")
//               const priceConsumerV3 = await priceConsumerV3Factory
//                   .connect(deployer)
//                   .deploy(mockV3Aggregator.address)

//               return { priceConsumerV3, mockV3Aggregator }
//           }

//           describe("deployment", async function () {
//               describe("success", async function () {
//                   it("should set the aggregator addresses correctly", async () => {
//                       const { priceConsumerV3, mockV3Aggregator } = await loadFixture(
//                           deployPriceConsumerFixture
//                       )
//                       const response = await priceConsumerV3.getPriceFeed()
//                       assert.equal(response, mockV3Aggregator.address)
//                   })
//               })
//           })

//           describe("#getLatestPrice", async function () {
//               describe("success", async function () {
//                   it("should return the same value as the mock", async () => {
//                       const { priceConsumerV3, mockV3Aggregator } = await loadFixture(
//                           deployPriceConsumerFixture
//                       )
//                       const priceConsumerResult = await priceConsumerV3.getLatestPrice()
//                       const priceFeedResult = (await mockV3Aggregator.latestRoundData()).answer
//                       assert.equal(priceConsumerResult.toString(), priceFeedResult.toString())
//                   })
//               })
//           })
//       })
