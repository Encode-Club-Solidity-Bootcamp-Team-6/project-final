type UmbrellaFundProps = {
  address?: string;
};

/**
 *
 * @param address - The address of the connected account
 * @returns a component that shows the distribution of the Umbrella Fund
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UmbrellaFund: React.FC<UmbrellaFundProps> = ({ address }) => {
  return (
    <div className="bg-blue-900 p-10 rounded-xl col-start-1 col-end-4 row-start-1 row-end-2 grid grid-cols-3 gap-8">
      <div className="flex flex-col items-center justify-evenly">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">Total Value Locked</h2>
          {/* TODO */}
          <p className="text-2xl">XXX ETH</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">Number of Holders</h2>
          {/* TODO */}
          <p className="text-2xl">XXX,XXX</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">Return on Investment</h2>
          {/* TODO */}
          <p className="text-2xl">+ XXX %</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-evenly">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl">Fund Distribution</h2>
          <p className="text-sm">See what ERC-20 tokens Umbrella Fund holds.</p>
        </div>
        {/* TODO */}
        <div className="w-[100%] h-[100%] bg-black text-center">Let&apos;s show some pie chart here</div>
      </div>
      <div className="flex flex-col items-center justify-evenly">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">My Balance</h2>
          {/* TODO */}
          <p className="text-2xl">+ XXX %</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">Fund Allocation</h2>
          {/* TODO */}
          <p className="text-2xl">0.XX %</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl text-gray-300">Return on Investment</h2>
          {/* TODO */}
          <p className="text-2xl">+ XXX %</p>
        </div>
      </div>
    </div>
  );
};

export default UmbrellaFund;
