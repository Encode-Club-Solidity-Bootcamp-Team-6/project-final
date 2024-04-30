import { formatEther } from "viem";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useGlobalState } from "~~/services/store/store";

type PoolValueProps = {
  value?: bigint;
};

/**
 * @param value - The value of the pool in wei
 * @returns a component that shows the current value of the pool in ether
 */
const PoolValue: React.FC<PoolValueProps> = ({ value = 0n }) => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);
  const formattedValue = formatEther(value);
  const usd = Math.round(parseFloat(formattedValue) * nativeCurrencyPrice);

  return (
    <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center min-w-64 max-w-xs max-h-72 rounded-3xl">
      <CurrencyDollarIcon className="h-8 w-8 fill-secondary" />
      <p className="text-xl font-bold">Pool Value</p>
      <div className="flex flex-col items-start gap-2">
        <span className="text-lg">{formattedValue} ETH</span>
        <span className="text-lg">{usd} USD</span>
      </div>
    </div>
  );
};

export default PoolValue;
