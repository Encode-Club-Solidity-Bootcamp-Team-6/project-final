import { formatEther } from "viem";
import { CircleStackIcon } from "@heroicons/react/24/outline";
import { Asset } from "~~/hooks/useUmbrella";

type PoolTokensProps = {
  assets?: Asset[];
};

/**
 * @param address - The address of the connected account
 * @returns a component that shows the current tokens in the pool
 */
const PoolTokens: React.FC<PoolTokensProps> = ({ assets = [] }) => {
  return (
    <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center min-w-64 max-w-lg rounded-3xl">
      <CircleStackIcon className="h-8 w-8 fill-secondary" />
      <p className="text-xl font-bold">Pool Tokens</p>
      <div className="flex flex-col items-start gap-2">
        {assets.length === 0 && <span className="text-lg">No tokens in pool</span>}

        {assets.map(token => (
          <span key={token.tokenName} className="text-lg">
            {token.tokens.toString()} {token.tokenName} bought at {formatEther(token.initPrice)} ETH
          </span>
        ))}
      </div>
    </div>
  );
};

export default PoolTokens;
