"use client";

import PoolTokens from "./_components/PoolTokens";
import PoolValue from "./_components/PoolValue";
import UmbrellaSwap from "./_components/UmbrellaSwap";
import UmbrellaVoting from "./_components/UmbrellaVoting";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex flex-col justify-center items-center space-x-2 mt-10">
        <h1 className="text-[40px]">Umbrella Fund</h1>
        <p>Invest in multiple ERC-20 tokens and build your portfolio.</p>
        <div className="grid grid-cols-2 gap-10 justify-items-center">
          <UmbrellaSwap address={connectedAddress} />
          <UmbrellaVoting address={connectedAddress} />
          <PoolValue address={connectedAddress} />
          <PoolTokens address={connectedAddress} />
        </div>
      </div>
    </>
  );
};

export default Home;
