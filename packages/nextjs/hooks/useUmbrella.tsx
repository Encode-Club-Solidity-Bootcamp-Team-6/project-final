import { useAccount, useContractReads } from "wagmi";

// TODO import tokenAbi when contract exists
const tokenAbi = "test";

// TODO import abi when contract exists
const abi = "test";

type ContractReadsOutput = {
  data?: any[];
  isError: boolean;
  isLoading: boolean;
};

const useUmbrella = (umbrellaFundAddress: string) => {
  const account = useAccount();

  const umbrellaContract = {
    address: umbrellaFundAddress,
    abi: abi as any,
  } as const;

  // TODO adjust functionNames when contract exists

  const { data, isError, isLoading }: ContractReadsOutput = useContractReads({
    contracts: [
      {
        ...umbrellaContract,
        functionName: "purchaseRatio",
      },
      {
        ...umbrellaContract,
        functionName: "paymentToken",
      },
      {
        ...umbrellaContract,
        functionName: "poolValue", // TODO adjust name
      },
      {
        ...umbrellaContract,
        functionName: "poolTokens", // TODO adjust name
      },
    ],
  });

  const tokenContract = {
    address: data?.[5].result as string,
    abi: tokenAbi as any,
  };

  const { data: dataToken } = useContractReads({
    contracts: [
      {
        ...tokenContract,
        functionName: "symbol",
      },
      {
        ...tokenContract,
        functionName: "balanceOf",
        args: [account.address || ""],
      },
    ],
  });

  // Umbrella
  const purchaseRatio = data && data[0].status === "success" ? data[0].result.toString() : 0;
  const paymentToken = data && data[1].status === "success" ? data[1].result : null;
  const poolValue = data && data[2].status === "success" ? data[2].result : 0;
  const poolTokens = data && data[3].status === "success" ? data[3].result : null;

  // Token
  const ticker = dataToken && dataToken[0].status === "success" ? (dataToken[0].result as any).toString() : "Unknown";
  const balance = dataToken && dataToken[1].status === "success" ? dataToken[1].result : 0;

  return {
    purchaseRatio,
    umbrellaTokenAddress: paymentToken,
    poolValue,
    poolTokens,
    ticker,
    balance,
    isError,
    isLoading,
  };
};

export default useUmbrella;
