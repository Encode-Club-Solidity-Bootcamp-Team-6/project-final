"use client";

import Image from "next/image";
import BuySellToken from "./_components/BuySellTokens";
import PoolTokens, { PoolToken } from "./_components/PoolTokens";
import PoolValue from "./_components/PoolValue";
import UmbrellaSwap from "./_components/UmbrellaSwap";
import UmbrellaVoting from "./_components/UmbrellaVoting";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import useUmbrella from "~~/hooks/useUmbrella";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { currentNAV, getAssets, tokenNames, tokenValues } = useUmbrella("0xAdd171f041fa71F533Cec6Fe62BD935461F81401");

  const tokens = generatePoolTokens(tokenNames, tokenValues);

  return (
    <>
      <div className="flex flex-col justify-center items-center space-x-2 mt-10">
        <Image src="/logo.webp" alt="Umbrella Logo" width={100} height={100} style={{ borderRadius: "1rem" }} />
        <p className="font-bold text-4xl">Umbrella Fund</p>
        <span>Invest in multiple ERC-20 tokens and build your portfolio.</span>

        <div className="flex flex-wrap flex-col mt-10 gap-6 justify-center">
          <div className="grid gap-8 grid-cols-2 grid-rows-2">
            <PoolTokens tokens={tokens} />
            <BuySellToken address={connectedAddress} />
            <UmbrellaSwap address={connectedAddress} />
            <UmbrellaVoting address={connectedAddress} />
          </div>
        </div>
      </div>
    </>
  );
};

const generatePoolTokens = (tokenNames: string[], tokenValues: string[]): PoolToken[] => {
  const tokens = tokenNames.map((name, index) => {
    return {
      name,
      value: BigInt(tokenValues[index]),
    };
  });

  return tokens;
};

export default Home;