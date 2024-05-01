import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { Asset } from "~~/hooks/useUmbrella";

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
  assets?: Asset[];
};

export const data = {
  labels: hardcodedTokens.map(token => `${Math.round(token.amount)} ${token.symbol}`),
  datasets: [
    {
      label: "Tokens in Pool",
      data: hardcodedTokens.map(token => token.amount),
      borderWidth: 1,
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
    },
  ],
};

export const options = {
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      marginTop: 10,
      labels: {
        color: "#ffffff",
      },
    },
  },
};

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * @param address - The address of the connected account
 * @returns a component that shows the current tokens in the pool
 */
const PoolTokens: React.FC<PoolTokensProps> = ({ assets = [] }) => {
  return (
    <div className="flex flex-col text-center items-center bg-base-100 p-10 rounded-xl">
      <div className="flex justify-center items-center gap-2">
        <CurrencyDollarIcon className="h-8 w-8 fill-secondary" />
        <p className="text-xl font-bold">Pool Distribution</p>
      </div>
      {/* @ts-ignore */}
      <Doughnut type="doughnut" data={data} options={options} />
    </div>
  );
};

export default PoolTokens;
