"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BuySellToken from "./_components/BuySellTokens";
import PoolTokens from "./_components/PoolTokens";
import UmbrellaSwap from "./_components/UmbrellaSwap";
import UmbrellaVoting from "./_components/UmbrellaVoting";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import useUmbrella from "~~/hooks/useUmbrella";

const Home: NextPage = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { address: connectedAddress } = useAccount();
  const {
    currentNAV,
    deposit,
    approve,
    withdraw,
    buyAsset,
    getAssets,
    poolTokens,
    isLoading,
    latestWriteError,
    latestHash,
    latestTxMessage,
    userBalanceUMB,
  } = useUmbrella("0x3727D3aF2558fCd8e99fB5C51f782eE4B4bef09b");

  useEffect(() => {
    if (latestTxMessage) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [latestTxMessage]);

  return (
    <>
      <div className="flex flex-col justify-center items-center space-x-2 mt-10">
        <Image src="/logo.webp" alt="Umbrella Logo" width={100} height={100} style={{ borderRadius: "1rem" }} />
        <p className="font-bold text-4xl">Umbrella Fund</p>
        <span>Invest in multiple ERC-20 tokens and build your portfolio.</span>

        <div className="flex flex-wrap flex-col mt-10 gap-6 justify-center">
          <div className="grid gap-8 grid-cols-2 grid-rows-2">
            <PoolTokens tokens={poolTokens} />
            <BuySellToken address={connectedAddress} buyAsset={buyAsset} />
            <UmbrellaSwap onBuy={deposit} onSell={withdraw} balanceUMB={userBalanceUMB} approve={approve} />
            <UmbrellaVoting address={connectedAddress} />
          </div>
        </div>

        {latestTxMessage && showNotification && (
          <div
            role="alert"
            className={`alert ${
              latestWriteError ? "alert-error" : latestHash ? "alert-success" : "alert-info"
            } fixed top-5 right-5 max-w-md z-50`}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>{latestTxMessage}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
