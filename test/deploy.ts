const { network, viem, hre } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
//const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
import { parseEther, formatEther } from "viem";

const DECIMALS = "18";
const INITIAL_PRICE = "200000000000000000000";

async function deployContract() {
    const publicClient = await hre.viem.getPublicClient();
    const [deployer, otherAccount] = await hre.viem.getWalletClients();
    const ballotContract = await hre.viem.deployContract("MockV3Aggregator",[DECIMALS, INITIAL_PRICE]);
    return { publicClient, deployer, otherAccount, ballotContract };
  }

  // stopped here
  