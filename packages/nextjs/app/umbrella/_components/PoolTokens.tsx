import { CircleStackIcon } from "@heroicons/react/24/outline";

interface PoolToken {
  name: string;
  symbol: string;
  amount: number;
}

const hardcodedTokens: PoolToken[] = [
  {
    name: "Uniswap",
    symbol: "$UNI",
    amount: 10,
  },
  {
    name: "Aave",
    symbol: "$AAVE",
    amount: 5,
  },
];

type PoolTokensProps = {
  address?: string;
};

/**
 *
 * @param address - The address of the connected account
 * @returns a component that shows the current tokens in the pool
 */
const PoolTokens: React.FC<PoolTokensProps> = ({ address }) => {
  return (
    <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center min-w-64 max-w-xs max-h-72 rounded-3xl">
      <CircleStackIcon className="h-8 w-8 fill-secondary" />
      <p className="text-xl font-bold">Pool Tokens</p>
      <div className="flex flex-col items-start gap-2">
        {hardcodedTokens.map(token => (
          <span key={token.symbol} className="text-lg">
            {token.amount} {token.symbol}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PoolTokens;
