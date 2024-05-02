import { formatEther } from "viem";
import { useBalance, useReadContract } from "wagmi";
import { useGlobalState } from "~~/services/store/store";

type UmbrellaFundProps = {
  address?: string;
  tokenAddress: string;
  totalSupply: bigint;
  currentNAV: bigint;
  initialNAV: bigint;
  returnNAV: bigint;
  purchaseRatio: bigint;
};

/**
 *
 * @param address - The address of the connected account
 * @returns a component that shows the distribution of the Umbrella Fund
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UmbrellaFund: React.FC<UmbrellaFundProps> = ({
  address,
  tokenAddress,
  totalSupply,
  currentNAV,
  initialNAV,
  returnNAV,
  purchaseRatio,
}) => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);
  const tokenBalance = useBalance({ address, token: tokenAddress });
  const balance = tokenBalance.data ? tokenBalance.data : { value: BigInt(0), symbol: "$UMB" };
  const tvl = BigInt(totalSupply) * BigInt(purchaseRatio);
  return (
    <div className="bg-base-100 p-10 rounded-xl col-start-1 col-end-3 grid grid-cols-3 gap-8">
      <div className="flex flex-col items-center justify-evenly">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">Total Value Locked</h2>
          <p className="text-2xl mb-0">{formatEther(tvl)} ETH</p>
          <p className="text-2xl mt-2">{formatEther(tvl) * nativeCurrencyPrice} USD</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">Return on Investment</h2>
          <p className="text-2xl">+ {formatEther(currentNAV)} %</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-evenly">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">Total $UMB Supply</h2>
          <p className="text-2xl">{totalSupply.toString()}</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-evenly">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">My Balance</h2>
          <p className="text-2xl">
            {formatEther(balance.value)} {balance.symbol}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">Fund Allocation</h2>
          {/* Divide the amount of tokens owned by the total supply */}
          <p className="text-2xl">{((BigInt(totalSupply) / balance.value) + BigInt(1)).toString()} %</p>
        </div>
      </div>
    </div>
  );
};

export default UmbrellaFund;