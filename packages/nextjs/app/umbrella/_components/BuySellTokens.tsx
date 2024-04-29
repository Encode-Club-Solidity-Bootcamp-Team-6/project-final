import { useState } from "react";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { EtherInput } from "~~/components/scaffold-eth";

type BuyTokenProps = {
  address?: string;
};

/**
 *
 * @param address - The address of the connected account
 * @returns a component that shows the current value of the pool in ether
 */
const BuySellToken: React.FC<BuyTokenProps> = ({ address }) => {
  const [token, setToken] = useState("AAVE");
  const [action, setAction] = useState("Buy");
  const [amount, setAmount] = useState("");

  const handleToggle = () => {
    if (action === "Buy") {
      setAction("Sell");
      return;
    }
    setAction("Buy");
  };

  return (
    <div className="bg-blue-900 p-10 rounded-xl">
      <div className="flex items-center gap-4">
        <BanknotesIcon className="h-8 w-8 fill-secondary" />
        <p className="text-xl font-bold">Buy or Sell ERC20 Tokens</p>
      </div>

      <div className="flex justify-center items-center gap-2">
        Buy
        <input
          id="theme-toggle"
          type="checkbox"
          className="toggle toggle-primary bg-primary hover:bg-primary border-primary"
          onChange={handleToggle}
          checked={action === "Sell"}
        />
        Sell
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        <EtherInput placeholder={`0`} value={amount} onChange={value => setAmount(value)} />
        <span>{token}</span>
      </div>

      <div></div>
    </div>
  );
};

export default BuySellToken;
