import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { formatEther } from "viem";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { Asset } from "~~/hooks/useUmbrella";

export interface PoolToken {
  name: string;
  amount: bigint;
  value: bigint;
}

type PoolTokensProps = {
  tokens: PoolToken[];
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
 * @param tokens - The pool tokens of the fund
 * @returns a component that shows the current tokens in the pool
 */
const PoolTokens: React.FC<PoolTokensProps> = ({ tokens }) => {
  const data = {
    labels: tokens.map(token => `${formatEther(token.value)} ${token.name}`),
    datasets: [
      {
        label: "Tokens in Pool",
        data: tokens.map(token => token.value),
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

  return (
    <div className="flex flex-col text-center items-center bg-base-100 p-10 rounded-xl">
      <div className="flex justify-center items-center gap-2">
        <CurrencyDollarIcon className="h-8 w-8 fill-secondary" />
        <p className="text-xl font-bold">Pool Distribution</p>
      </div>
      {/* @ts-ignore */}
      {tokens.length > 0 ? <Doughnut type="doughnut" data={data} options={options} /> : <p>No tokens in pool</p>}
    </div>
  );
};

export default PoolTokens;
