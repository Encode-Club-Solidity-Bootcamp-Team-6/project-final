"use client";

import Image from "next/image";
import BuySellToken from "./_components/BuySellTokens";
import PoolTokens from "./_components/PoolTokens";
import PoolValue from "./_components/PoolValue";
import UmbrellaSwap from "./_components/UmbrellaSwap";
import UmbrellaVoting from "./_components/UmbrellaVoting";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import useUmbrella from "~~/hooks/useUmbrella";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { currentNAV, getAssets } = useUmbrella("0xd7e9e516d57f071ba00de44bfd56b0ee9f2ab731");

  return (
    <>
      <div className="flex flex-col justify-center items-center space-x-2 mt-10">
        <Image src="/logo.webp" alt="Umbrella Logo" width={100} height={100} style={{ borderRadius: "1rem" }} />
        <p className="font-bold text-4xl">Umbrella Fund</p>
        <span>Invest in multiple ERC-20 tokens and build your portfolio.</span>

        <div className="flex flex-wrap flex-col mt-10 gap-6 justify-center">
          <div className="grid grid-cols-2 gap-10 justify-items-center">
            <PoolValue value={currentNAV} />
            <PoolTokens assets={getAssets()} />
          </div>

          <div className="grid gap-10">
            <UmbrellaSwap address={connectedAddress} />
            <BuySellToken address={connectedAddress} />
            <UmbrellaVoting address={connectedAddress} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
