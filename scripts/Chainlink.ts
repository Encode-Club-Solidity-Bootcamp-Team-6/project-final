// const { http, createPublicClient, createWalletClient, parseEther, formatEther } = require("hardhat");
import { createPublicClient, http, createWalletClient, parseEther, formatEther, toHex, hexToString } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {sepolia } from "viem/chains";
import PriceConsumerV3 from "../artifacts/contracts/PriceConsumerV3.sol/PriceConsumerV3.json";
import APIConsumer from "../artifacts/contracts/APIConsumer.sol/APIConsumer.json";
import * as dotenv from "dotenv";
dotenv.config();


const DECIMALS = "18";
const INITIAL_PRICE = "200000000000000000000";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
// const priceFeed = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
const priceFeed = "0xc59E3633BAAC79493d908e63626716e204A45EdF";

const oracleAddress = "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD";
const jobID = "ca98366cc7314957b8c012c72f05aeeb";
const fee =  1; // LINK
const linkAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

// const priceContractAddress = "0x088f82799afdf3e3e5f985b346702825723513b7";
// const apiContractAddress = "0x55a7c319139de0ebe8df28818bd64ee9ea4e4515";

async function main() {
    
    // Initialization
    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const publicClient = await createPublicClient({chain: sepolia, transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),});
    const deployer = createWalletClient({account, chain: sepolia, transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),});
    console.log("Deployer address:", deployer.account.address);
    const balance = await publicClient.getBalance({address: deployer.account.address,});
    console.log("Deployer balance:",formatEther(balance),deployer.chain.nativeCurrency.symbol);

    // PriceConsumerV3 deployment
    console.log("\nDeploying PriceConsumerV3 contract");
    const hash1 = await deployer.deployContract({abi: PriceConsumerV3.abi, bytecode: PriceConsumerV3.bytecode as `0x${string}`, args: [priceFeed]}); // don't include args if empty
    console.log("Transaction hash:", hash1);
    console.log("Waiting for confirmations...");
    const receipt1 = await publicClient.waitForTransactionReceipt({ hash: hash1 });
    const priceConsumerAddress = receipt1.contractAddress;
    console.log("PriceConsumer contract deployed to:", priceConsumerAddress);


    // ConsumerAPI deployment
    console.log("\nDeploying APIConsumer contract");
    const hash2 = await deployer.deployContract({abi: APIConsumer.abi, bytecode: APIConsumer.bytecode as `0x${string}`, args: [oracleAddress, jobID, fee, linkAddress]}); // don't include args if empty
    console.log("Transaction hash:", hash2);
    console.log("Waiting for confirmations...");
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash: hash2 });
    const apiConsumerAddress = receipt2.contractAddress;
    console.log("APIConsumer contract deployed to:", apiConsumerAddress);

    //const volTx = await publicClient.readContract({address: apiConsumerAddress, abi: APIConsumer.abi, functionName: 'requestVolumeData', args: [],});
    // await publicClient.waitForTransactionReceipt({ hash: volTx });
    //console.log("Transaction hash: ", volTx);
    // const balancePeter = await publicClient.readContract({address: tokenContractAddress, abi: myToken.abi, functionName: 'balanceOf', args: [peterAddress],});
    // console.log(`Account peter ${peterAddress} has ${formatEther(balancePeter)} units of MyToken\n`);

    const volTx = await publicClient.readContract({address: priceConsumerAddress, abi: PriceConsumerV3.abi, functionName: 'getLatestPrice', args: [],});
    // await publicClient.waitForTransactionReceipt({ hash: volTx });
    console.log("Transaction hash: ", volTx);

  }

  main().catch(err => {
    console.log(err)
    process.exitCode = 1
  })