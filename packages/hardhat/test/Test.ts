// Add this to your fetchAccounts.ts or create a new script file.
console.log("Testing ethers utils:");
try {
    const ethValue = ethers.utils.parseEther("1.0");
    console.log(`1.0 ETH in Wei: ${ethValue.toString()}`);
} catch (error) {
    console.error("Error using ethers.utils.parseEther:", error);
}
