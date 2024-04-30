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
const audFeed = "0xB0C712f98daE15264c8E26132BCC91C40aD4d5F9";
const gbpFeed = "0x91FAB41F5f3bE955963a986366edAcff1aaeaa83";
const eurFeed = "0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910";
const jpyFeed = "0x8A6af2B75F23831ADc973ce6288e5329F63D86c6";
const czkFeed = "0xC32f0A9D70A34B9E7377C10FDAd88512596f61EA";
const peterAddress = "0xe0A28485ce1b81df501e97c9370C9dc69B97432D";
const MINT_VALUE = parseEther("100");

async function main() {

    // // Initialization of token contract
    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const publicClient = await createPublicClient({chain: sepolia, transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),});
    const deployer = createWalletClient({account, chain: sepolia, transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),});
    console.log("Got publicClient and deployer ...\n");

    // Initialization of fund contract  
    const blockNumber = await publicClient.getBlockNumber();
    console.log(`Current blocknumber is: ${blockNumber} ...\n`);
    
    // Deploying the UmbrellaFund contract
    console.log("\nDeploying UmbrellaFund contract...\n");
    const hash2 = await deployer.deployContract({abi: UmbrellaFund.abi, bytecode: UmbrellaFund.bytecode as `0x${string}`, args: ["UmbrellaToken","UMB",parseEther(".00001")]}); // don't include args if empty
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash: hash2 }); // something is wrong here
    const fundContractAddress = receipt2.contractAddress;
    console.log(`UmbrellaFund smart contract deployed to: ${fundContractAddress}...\n`);
    
    const balance3 = await publicClient.getBalance({address: fundContractAddress,});
    console.log(`Before deposit, UmbrellaFund smart contract has balance: ${formatEther(balance3)} ${deployer.chain.nativeCurrency.symbol}...\n`);

    // // Purchasing tokens
    const purchTx = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'deposit', args: [], value: parseEther(".001"),});
    const hash3 = await publicClient.waitForTransactionReceipt({ hash: purchTx });
    const balance4 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenShare', args: [],});
    console.log(`Account: ${peterAddress} purchased tokens in amount: ${formatEther(balance4)}...\n`);
    
    const balance5 = await publicClient.getBalance({address: fundContractAddress,});
    console.log(`After deposit, UmbrellaFund smart contract now has balance: ${formatEther(balance5)} ${deployer.chain.nativeCurrency.symbol}...\n`);
    // const totSupp = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTotalSupply', args: [],});
    // console.log(`After deposit, UmbrellaFund token total Supply is: ${formatEther(totSupp)}...\n`);

    // Setting chainlink pricefeeds for assets to buy
    const setTx1 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [0, audFeed, "AUD", "USD"],});
    const hash4 = await publicClient.waitForTransactionReceipt({ hash: setTx1 });
    const setTx2 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [1, gbpFeed, "GBP", "USD"],});
    const hash5 = await publicClient.waitForTransactionReceipt({ hash: setTx2 });
    const setTx3 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [2, eurFeed, "EUR", "USD"],});
    const hash6 = await publicClient.waitForTransactionReceipt({ hash: setTx3 });
    const setTx4 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [3, jpyFeed, "JPY", "USD"],});
    const hash7 = await publicClient.waitForTransactionReceipt({ hash: setTx4 });
    const setTx5 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [4, czkFeed, "CZK", "USD"],});
    const hash8 = await publicClient.waitForTransactionReceipt({ hash: setTx5 });
    
    const out0 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [0],});
    const out1 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [1],});
    const out2 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [2],});
    const out3 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [3],});
    const out4 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [4],});
    console.log("Asset struct index: 0 has contents: ", out0," ...\n");
    console.log("Asset struct index: 1 has contents: ", out1," ...\n");
    console.log("Asset struct index: 2 has contents: ", out2," ...\n");
    console.log("Asset struct index: 3 has contents: ", out3," ...\n");
    console.log("Asset struct index: 4 has contents: ", out4," ...\n");
    
    // Calling Chainlink pricefeeds
    // const priceTx1 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [0],});
    // console.log(`Chainlink price of AUD/USD is: ${formatEther(priceTx1) * 10**10}...\n`);
    // const priceTx2 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [1],});
    // console.log(`Chainlink price of GBP/USD is: ${formatEther(priceTx2) * 10**10}...\n`);
    // const priceTx3 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [2],});
    // console.log(`Chainlink price of EUR/USD is: ${formatEther(priceTx3) * 10**10}...\n`);
    // const priceTx4 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [3],});
    // console.log(`Chainlink price of JPY/USD is: ${formatEther(priceTx4) * 10**10}...\n`);
    // const priceTx5 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [4],});
    // console.log(`Chainlink price of CZK/USD is: ${formatEther(priceTx5) * 10**10}...\n`);

    // Purchasing assets
    const buyTx0 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'buyAsset', args: [parseEther(".0001"), 0],});
    const hash9 = await publicClient.waitForTransactionReceipt({ hash: buyTx0 });
    const buyTx1 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'buyAsset', args: [parseEther(".0003"), 1],});
    const hash10 = await publicClient.waitForTransactionReceipt({ hash: buyTx1 });
    const buyTx2 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'buyAsset', args: [parseEther(".0003"), 2],});
    const hash11 = await publicClient.waitForTransactionReceipt({ hash: buyTx2 });
    const buyTx3 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'buyAsset', args: [parseEther(".0002"), 3],});
    const hash12 = await publicClient.waitForTransactionReceipt({ hash: buyTx3 });
    const buyTx4 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'buyAsset', args: [parseEther(".0001"), 4],});
    const hash13 = await publicClient.waitForTransactionReceipt({ hash: buyTx4 });

    const out0buy = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [0],});
    const out1buy = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [1],});
    const out2buy = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [2],});
    const out3buy = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [3],});
    const out4buy = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [4],});
    console.log("Asset struct index:0 has contents: ", out0buy, "...\n"); 
    console.log("Asset struct index:1 has contents: ", out1buy, "...\n");
    console.log("Asset struct index:2 has contents: ", out2buy, "...\n");
    console.log("Asset struct index:3 has contents: ", out3buy, "...\n");
    console.log("Asset struct index:4 has contents: ", out4buy, "...\n");

    const tokenNames = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenNames', args: [],});
    const tokenAmounts = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenAmounts', args: [],});
    const tokenValues = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenValues', args: [],});
    console.log(`TokenNames are: ${tokenNames} and TokenAmounts are: ${formatEther(tokenAmounts)} and TokenValues are: ${formatEther(tokenValues)}...\n`);
    
    // Calculating portfolio metrics
    const navInit = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'calculateNAVInitial', args: [],});
    const navCurr = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'calculateNAVCurrent', args: [],});
    const ret = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'calculateReturn', args: [],});
    console.log(`InitialNAVnav is: ${formatEther(navInit)} and CurrentNAV is: ${formatEther(navCurr)} and portfolio return is: ${ret}...\n`);

    // Sell assets
    const sellTx1 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'sellAsset', args: [0],});
    const hash14 = await publicClient.waitForTransactionReceipt({ hash: sellTx1 });
    const sellTx2 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'sellAsset', args: [1],});
    const hash15 = await publicClient.waitForTransactionReceipt({ hash: sellTx2 });
    const sellTx3 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'sellAsset', args: [2],});
    const hash16 = await publicClient.waitForTransactionReceipt({ hash: sellTx3 });
    const sellTx4 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'sellAsset', args: [3],});
    const hash17 = await publicClient.waitForTransactionReceipt({ hash: sellTx4 });
    const sellTx5 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'sellAsset', args: [4],});
    const hash18 = await publicClient.waitForTransactionReceipt({ hash: sellTx5 });
    
    const tokenNames2 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenNames', args: [],});
    const tokenAmounts2 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenAmounts', args: [],});
    const tokenValues2 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenValues', args: [],});
    console.log(`After sale, TokenNames are: ${tokenNames2} and TokenAmounts are: ${formatEther(tokenAmounts2)} and TokenValues are: ${formatEther(tokenValues2)}...\n`);

    // Withdraw funds, need to approve fundContract from tokenContract to process withdrawal
    const tokenContractAddress = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getPaymentTokenAddress', args: [], account: deployer.account});
    console.log(`Token contract address is: ${tokenContractAddress}...\n`);
    const balance6 = await publicClient.getBalance({address: fundContractAddress});
    const balance7 = await publicClient.getBalance({address: peterAddress});
    console.log(`Before withdrawal, UmbrellaFund smart contract has balance: ${formatEther(balance6)} ${deployer.chain.nativeCurrency.symbol} and peter has balance: ${formatEther(balance7)} ${deployer.chain.nativeCurrency.symbol}...\n`);
    
    const withTx1 = await deployer.writeContract({address: tokenContractAddress, abi: UmbrellaToken.abi, functionName: 'approve', args: [fundContractAddress, MAXUINT256], account: deployer.account});
    const hash19 = await publicClient.waitForTransactionReceipt({ hash: withTx1 });
    const withTx2 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'withdraw', args: []});
    const hash20 = await publicClient.waitForTransactionReceipt({ hash: withTx2 });
  
    const balance8 = await publicClient.getBalance({address: fundContractAddress});
    const balance9 = await publicClient.getBalance({address: peterAddress});
    console.log(`After withdrawal, UmbrellaFund smart contract has balance: ${formatEther(balance8)} ${deployer.chain.nativeCurrency.symbol} and peter has balance: ${formatEther(balance9)} ${deployer.chain.nativeCurrency.symbol}...\n`);
    
}


main().catch(err => {
  console.log(err)
  process.exitCode = 1
})