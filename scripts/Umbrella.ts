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
const jpyFeed = "0x8A6af2B75F23831ADc973ce6288e5329F63D86c6";
const peterAddress = "0xe0A28485ce1b81df501e97c9370C9dc69B97432D";
const MINT_VALUE = parseEther("100");

async function main() {

    // Addresses
    
    //const fundContractAddress = "0x6242490947cea5379241856f1002d016d0acc14a";
    
    // // Initialization of token contract
    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const publicClient = await createPublicClient({chain: sepolia, transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),});
    const deployer = createWalletClient({account, chain: sepolia, transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),});
    console.log("Got publicClient and deployer ...\n");

    // // Check peter's balance before deployment to sepolia
    // const balance = await publicClient.getBalance({address: deployer.account.address,});
    // console.log(`Before deployment, deployer address is: ${deployer.account.address} and deployer balance is: ${formatEther(balance)} ${deployer.chain.nativeCurrency.symbol}...\n`);

    // // UmbrellaToken deployment
    // console.log("Deploying UmbrellaToken contract ...\n");
    // const hash = await deployer.deployContract({abi: UmbrellaToken.abi, bytecode: UmbrellaToken.bytecode as `0x${string}`, args: ["UmbrellaToken","UMB"]}); // don't include args if empty
    // //console.log("Transaction hash:", hash);
    // // console.log("Waiting for confirmations...");
    // const receipt = await publicClient.waitForTransactionReceipt({ hash: hash });
    // const tokenContractAddress = receipt.contractAddress;
    // console.log(`UmbrellaToken contract deployed to: ${tokenContractAddress}...\n`);
    
    // // Mint tokens to deployer
    // const mintTx = await deployer.writeContract({address: tokenContractAddress, abi: UmbrellaToken.abi, functionName: 'mint', args: [peterAddress, MINT_VALUE],});
    // await publicClient.waitForTransactionReceipt({ hash: mintTx });
    // // console.log("Transaction hash: ", mintTx);
    // console.log(`UmbrellaToken smart contract minted tokens of : ${MINT_VALUE}...\n`);

    // // Check peter's balance after token deployment
    // const balance2 = await publicClient.readContract({address: tokenContractAddress, abi: UmbrellaToken.abi, functionName: 'balanceOf', args: [peterAddress],});
    // console.log(`Account: ${peterAddress} has UmbrellaTokens: ${formatEther(balance2)}...\n`);

    // // Approve voting power from deployer to smart contract
    // const appTx = await deployer.writeContract({address: tokenContractAddress, abi: UmbrellaToken.abi, functionName: 'approve', args: [tokenContractAddress, MAXUINT256],});
    // await publicClient.waitForTransactionReceipt({ hash: appTx });
    // console.log(`Account: ${peterAddress} has approved the MAX UNITS (${formatEther(MAXUINT256)}) of voting power to the token smart contract...\n`);

    // // Initialization of fund contract  
    // const blockNumber = await publicClient.getBlockNumber();
    // console.log(`Current blocknumber is: ${blockNumber} ...\n`);
    
    // Deploying the UmbrellaFund contract
    console.log("\nDeploying UmbrellaFund contract...\n");
    const hash2 = await deployer.deployContract({abi: UmbrellaFund.abi, bytecode: UmbrellaFund.bytecode as `0x${string}`, args: ["UmbrellaToken","UMB",parseEther(".00001")]}); // don't include args if empty
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash: hash2 }); // something is wrong here
    const fundContractAddress = receipt2.contractAddress;
    console.log(`UmbrellaFund smart contract deployed to: ${fundContractAddress}...\n`);
    
    const balance3 = await publicClient.getBalance({address: fundContractAddress,});
    console.log(`UmbrellaFund smart contract has balance: ${formatEther(balance3)} ${deployer.chain.nativeCurrency.symbol}...\n`);

    // // Purchasing tokens
    const purchTx = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'deposit', args: [], value: parseEther(".001"),});
    const hash3 = await publicClient.waitForTransactionReceipt({ hash: purchTx });
    const balance4 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenShare', args: [peterAddress],});
    console.log(`Account: ${peterAddress} purchased tokens in amount: ${formatEther(balance4)}...\n`);
    
    const balance5 = await publicClient.getBalance({address: fundContractAddress,});
    console.log(`UmbrellaFund smart contract now has balance: ${formatEther(balance5)} ${deployer.chain.nativeCurrency.symbol}...\n`);
    const totSupp = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTotalSupply', args: [],});
    console.log(`UmbrellaFund token total Supply is: ${formatEther(totSupp)}...\n`);

    // Setting chainlink pricefeeds for assets to buy
    const setTx1 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [0, btcFeed, "BTC", "ETH"],});
    const hash4 = await publicClient.waitForTransactionReceipt({ hash: setTx1 });
    const setTx2 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [1, linkFeed, "LINK", "ETH"],});
    const hash5 = await publicClient.waitForTransactionReceipt({ hash: setTx2 });
    const setTx3 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [2, eurFeed, "EUR", "USD"],});
    const hash6 = await publicClient.waitForTransactionReceipt({ hash: setTx3 });
    const setTx4 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'setCLInitValues', args: [3, jpyFeed, "JPY", "USD"],});
    const hash7 = await publicClient.waitForTransactionReceipt({ hash: setTx4 });
    
    const out0 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [0],});
    const out1 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [1],});
    const out2 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [2],});
    const out3 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [3],});
    console.log("Asset struct index: 0 has contents: ", out0," ...\n");
    console.log("Asset struct index: 1 has contents: ", out1," ...\n");
    console.log("Asset struct index: 2 has contents: ", out2," ...\n");
    console.log("Asset struct index: 3 has contents: ", out3," ...\n");
    
    // Calling Chainlink pricefeeds
    const priceTx1 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [0],});
    console.log(`Chainlink price of BTC/ETH is: ${formatEther(priceTx1)}...\n`);
    const priceTx2 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [1],});
    console.log(`Chainlink price of LINK/ETH is: ${formatEther(priceTx2)}...\n`);
    const priceTx3 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [2],});
    console.log(`Chainlink price of EUR/USD is: ${formatEther(priceTx3) * 10**10}...\n`);
    const priceTx4 = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getCLPrice', args: [3],});
    console.log(`Chainlink price of JPY/USD is: ${formatEther(priceTx4) * 10**10}...\n`);

    // Purchasing assets
    const buyTx0 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'buyAsset', args: [parseEther(".0001"), 0],});
    const hash8 = await publicClient.waitForTransactionReceipt({ hash: buyTx0 });
    const buyTx1 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'buyAsset', args: [parseEther(".0003"), 1],});
    const hash9 = await publicClient.waitForTransactionReceipt({ hash: buyTx1 });
    const buyTx2 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'buyAsset', args: [parseEther(".0004"), 2],});
    const hash10 = await publicClient.waitForTransactionReceipt({ hash: buyTx2 });
    const buyTx3 = await deployer.writeContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'buyAsset', args: [parseEther(".0002"), 3],});
    const hash11 = await publicClient.waitForTransactionReceipt({ hash: buyTx3 });

    const out0buy = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [0],});
    const out1buy = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [1],});
    const out2buy = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [2],});
    const out3buy = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getAsset', args: [3],});
    console.log("Asset struct index:0 has contents: ", out0buy, "...\n"); 
    console.log("Asset struct index:1 has contents: ", out1buy, "...\n");
    console.log("Asset struct index:2 has contents: ", out2buy, "...\n");
    console.log("Asset struct index:3 has contents: ", out3buy, "...\n");

    const tokenNames = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenNames', args: [],});
    const tokenAmounts = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenAmounts', args: [],});
    //console.log(`TokenNames are: ${tokenNames}, TokenAmounts are: ${tokenAmounts}...\n`);
    const tokenValues = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'getTokenValues', args: [],});
    console.log(`TokenNames are: ${tokenNames}, TokenAmounts are: ${formatEther(tokenAmounts)}, and TokenValues are: ${formatEther(tokenValues)}...\n`);
    

    // Calculating portfolio metrics
    const navInit = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'calculateNAVInitial', args: [],});
    const navCurr = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'calculateNAVCurrent', args: [],});
    const ret = await publicClient.readContract({address: fundContractAddress, abi: UmbrellaFund.abi, functionName: 'calculateReturn', args: [],});
    console.log(`InitialNAVnav is: ${formatEther(navInit)} and CurrentNAV is: ${formatEther(navCurr)} and portfolio return is: ${ret}...\n`);
}


main().catch(err => {
  console.log(err)
  process.exitCode = 1
})