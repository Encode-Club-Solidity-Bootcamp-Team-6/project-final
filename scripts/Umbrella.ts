import { createPublicClient, http, createWalletClient, parseEther, formatEther, toHex, hexToString } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
import UmbrellaToken from "../artifacts/contracts/UmbrellaToken.sol/UmbrellaToken.json";
import UmbrellaFund from "../artifacts/contracts/UmbrellaFund.sol/UmbrellaFund.json"; 
dotenv.config();

const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const MAXUINT256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;
const btcFeed = "0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22";
const linkFeed = "0x42585eD362B3f1BCa95c640FdFf35Ef899212734";
const eurFeed = "0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910";

const MINT_VALUE = parseEther("100");
// const PROPOSALS = ["Vanilla", "Chocolate", "Strawberry"];
// TODO change toString to formatEther

async function main() {

    // Addresses
    const peterAddress = "0xe0A28485ce1b81df501e97c9370C9dc69B97432D";
    // const fundContractAddress = "0x7ce88679011efa93f5f85a8208c0942b27e3ee72";
    
    // Initialization of token contract
    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const publicClient = await createPublicClient({chain: sepolia, transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),});
    const deployer = createWalletClient({account, chain: sepolia, transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),});
    console.log("Deployer address:", deployer.account.address);
    const balance = await publicClient.getBalance({address: deployer.account.address,});
    console.log("Deployer balance:",formatEther(balance),deployer.chain.nativeCurrency.symbol);

    // // UmbrellaToken deployment
    // console.log("\nDeploying UmbrellaToken contract");
    // const hash = await deployer.deployContract({abi: UmbrellaToken.abi, bytecode: UmbrellaToken.bytecode as `0x${string}`, args: ["UmbrellaToken","UMB"]}); // don't include args if empty
    // console.log("Transaction hash:", hash);
    // console.log("Waiting for confirmations...");
    // const receipt = await publicClient.waitForTransactionReceipt({ hash: hash });
    // const tokenContractAddress = receipt.contractAddress;
    // console.log("Token contract deployed to:", tokenContractAddress);
    
    // // Mint tokens to deployer
    // const mintTx = await deployer.writeContract({address: tokenContractAddress, abi: UmbrellaToken.abi, functionName: 'mint', args: [peterAddress, MINT_VALUE],});
    // await publicClient.waitForTransactionReceipt({ hash: mintTx });
    // console.log("Transaction hash: ", mintTx);
    
    // // Check peter's balance
    // const balancePeter = await publicClient.readContract({address: tokenContractAddress, abi: UmbrellaToken.abi, functionName: 'balanceOf', args: [peterAddress],});
    // console.log(`Account peter ${peterAddress} has ${formatEther(balancePeter)} units of MyToken\n`);

    // // Approve voting power from deployer to smart contract
    // const appTx = await deployer.writeContract({address: tokenContractAddress, abi: UmbrellaToken.abi, functionName: 'approve', args: [tokenContractAddress, MAXUINT256],});
    // await publicClient.waitForTransactionReceipt({ hash: appTx });
    
    // console.log(`Account peter ${peterAddress} has approved the max units of voting power to the token smart contract\n`);

    // Initialization of fund contract
    console.log("Deployer address:", deployer.account.address);
    const balance2 = await publicClient.getBalance({address: deployer.account.address,});
    console.log("Deployer balance:",formatEther(balance2), deployer.chain.nativeCurrency.symbol);
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Blocknumber is: ", blockNumber);
    // console.log("tokenContractAddress is: ", tokenContractAddress);

    

    // Deploying the second contract
    console.log("\nDeploying UmbrellaFund contract");
    const hash2 = await deployer.deployContract({abi: UmbrellaFund.abi, bytecode: UmbrellaFund.bytecode as `0x${string}`, args: ["UmbrellaToken","UMB",parseEther(".00001"),parseEther(".00002"),parseEther(".05")]}); // don't include args if empty
    console.log("Transaction hash2:", hash2);
    console.log("Waiting for confirmations...");
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash: hash2 }); // something is wrong here
    const fundContractAddress = receipt2.contractAddress;
    console.log("Fund contract deployed to:", fundContractAddress);
    const balance3 = await publicClient.getBalance({address: fundContractAddress,});
    console.log("Fund contract balance:",formatEther(balance3), deployer.chain.nativeCurrency.symbol);


    // // Purchasing tokens
    const purchTx = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'deposit', args: [], value: parseEther(".0001"),});
    const hash3 = await publicClient.waitForTransactionReceipt({ hash: purchTx });
    const balancePeter = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenShare', args: [peterAddress],});
    console.log("Peter purchased tokens in amount: ", formatEther(balancePeter));
    const balance4 = await publicClient.getBalance({address: fundContractAddress,});
    console.log("Fund contract balance:",formatEther(balance4), deployer.chain.nativeCurrency.symbol);
    const totSupp = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTotalSupply', args: [],});
    console.log("Total Supply is: ", formatEther(totSupp));

    // Setting assets to buy
    const setTx1 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [0, btcFeed, "BTC"],});
    const setTx2 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [1, linkFeed, "LINK"],});
    const setTx3 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [2, eurFeed, "EUR"],});
    const hash4 = await publicClient.waitForTransactionReceipt({ hash: setTx3 });
    

    const out0 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [0],});
    const out1 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [1],});
    console.log("Asset of index: 0 has priceFeed: ", out0);
    console.log("Asset of index: 1 has priceFeed: ", out1);
    
    
    const priceTx1 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [0],});
    console.log(formatEther(priceTx1));
    const priceTx2 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [1],});
    console.log(formatEther(priceTx2));
    const priceTx3 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [2],});
    console.log(formatEther(priceTx3));

    // Purchasing first asset
    const buyTx = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'buyAsset', args: [parseEther(".0001"), 2],});
    const hash5 = await publicClient.waitForTransactionReceipt({ hash: buyTx });
    const out2 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [2],});
    console.log("Asset of index: 2 has priceFeed: ", out2);

    // const navInit = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'calculateNAVInitial', args: [],});
    // const navCurr = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'calculateNAVCurrent', args: [],});
    // const ret = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'calculateReturn', args: [],});
    // console.log("navInit, navCurr, totSupp, return is: ", formatEther(navInit), formatEther(navCurr), ret);


}


main().catch(err => {
  console.log(err)
  process.exitCode = 1
})