"use client";

import { useRequestSnap } from "@/hooks/useRequestSnap";
import { parseEther } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

export default function Tx() {
  const requestSnap = useRequestSnap();

  const { sendTransaction, isPending, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        <button className="btn btn-accent" onClick={requestSnap}>
          Request Snap
        </button>
        <button
          className="btn btn-accent"
          onClick={() =>
            sendTransaction({
              to: "0x506dc0FDf908906Db5c01c6ee6dbfC7E02D39938",
              value: parseEther("0.0001"),
            })
          }
        >
          <span className="text-xl">Confirm</span>
          {(isPending || isConfirming) && (
            <span className="loading loading-spinner loading-xs"></span>
          )}
        </button>
      </div>
      {isConfirmed && (
        <span className="icon icon-check">
          Transaction Confirmed! Go to{" "}
          <a
            href={`https://explorer.sepolia.linea.build/tx/${hash}`}
            className="link"
            target="_blank"
          >
            Blockscout
          </a>
        </span>
      )}
    </div>
  );
}
