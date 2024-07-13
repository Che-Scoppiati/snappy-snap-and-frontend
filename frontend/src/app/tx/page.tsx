"use client";

import { useRequestSnap } from "@/hooks/useRequestSnap";
import { parseEther } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

export default function Tx() {
  const { sendTransaction, isPending, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="flex flex-col gap-6 items-center">
      <button
        className="btn btn-accent"
        onClick={() =>
          sendTransaction({
            to: "0x506dc0FDf908906Db5c01c6ee6dbfC7E02D39938",
            value: parseEther("0.0001"),
          })
        }
      >
        <span className="text-xl">Send ETH</span>
        {(isPending || isConfirming) && (
          <span className="loading loading-spinner loading-xs mb-1" />
        )}
      </button>
      {isConfirmed && (
        <span className="icon icon-check text-2xl">
          Transaction Confirmed! Go to{" "}
          <a
            href={`https://explorer.sepolia.linea.build/tx/${hash}`}
            target="_blank"
          >
            Blockscout
          </a>
        </span>
      )}
    </div>
  );
}
