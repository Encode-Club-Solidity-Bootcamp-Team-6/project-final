import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

type PoolValueProps = {
  address?: string;
};

/**
 *
 * @param address - The address of the connected account
 * @returns a component that shows the current value of the pool in ether
 */
const PoolValue: React.FC<PoolValueProps> = ({ address }) => {
  return (
    <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center min-w-64 max-w-xs max-h-72 rounded-3xl">
      <CurrencyDollarIcon className="h-8 w-8 fill-secondary" />
      <p className="text-xl font-bold">Pool Value</p>
      <div className="flex flex-col items-start gap-2">
        <span className="text-lg">0.00 ETH</span>
        <span className="text-lg">0.00 USD</span>
      </div>
    </div>
  );
};

export default PoolValue;
