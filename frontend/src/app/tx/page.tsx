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

  const openPopup = () => {
    // Define the URL you want to open
    const url = "https://www.example.com";

    // Define the dimensions of the popup window
    const width = 600;
    const height = 400;

    // Calculate the position of the popup to center it on the screen
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    // Open the popup window with the specified dimensions and position
    window.open(
      url,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left}`,
    );
  };

  return (
    <div className="flex flex-col gap-6 items-center">
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
          <span className="text-xl">Send ETH</span>
          {(isPending || isConfirming) && (
            <span className="loading loading-spinner loading-xs mb-1" />
          )}
        </button>
        <button className="btn btn-accent" onClick={openPopup}>
          Open Popup
        </button>
      </div>
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
