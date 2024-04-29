"use client";

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
        <UmbrellaSwap address={connectedAddress} />
        <UmbrellaVoting address={connectedAddress} />
      </div>
    </>
  );
};

export default Home;