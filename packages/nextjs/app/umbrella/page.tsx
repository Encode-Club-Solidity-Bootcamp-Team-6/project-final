"use client";

import PoolTokens from "./_components/PoolTokens";
import PoolValue from "./_components/PoolValue";
import UmbrellaSwap from "./_components/UmbrellaSwap";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex flex-col justify-center items-center space-x-2 mt-10">
        <h1 className="text-[40px]">Umbrella Fund</h1>
        <p>Invest in multiple ERC-20 tokens and build your portfolio.</p>
        <div className="flex flex-wrap flex-col gap-6 justify-center">
          <div className="grid grid-cols-2 gap-10 justify-items-center">
            <PoolValue address={connectedAddress} />
            <PoolTokens address={connectedAddress} />
          </div>

          <div className="grid gap-10 ">
            <UmbrellaSwap address={connectedAddress} />
            {/* <UmbrellaVoting address={connectedAddress} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
