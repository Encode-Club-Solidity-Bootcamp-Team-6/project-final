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
    <div className="bg-blue-900 p-10 rounded-xl col-start-1 col-end-2 row-start-1 row-end-2">
      <h2 className="text-xl">Fund Distribution</h2>
      <p className="text-sm">See what ERC-20 tokens Umbrella Fund holds.</p>
    </div>
  );
};

export default UmbrellaFund;
