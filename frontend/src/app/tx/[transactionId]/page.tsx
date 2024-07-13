"use client";

import { useParams } from "next/navigation";
import { parseEther } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import axios from "axios";
import { useEffect, useState } from "react";
import { TransactionData } from "@brian-ai/sdk";

interface Metadata {
  action: string;
  data: TransactionData;
  solver: string;
  type: string;
}

export interface TxResult {
  id: string;
  metadata: Metadata;
  fromAddress: string;
  txHash: string | null;
}

export default function Tx() {
  const [txData, setTxData] = useState<TxResult | null>(null);

  const { transactionId } = useParams();

  const getTxData = async () => {
    const data = await axios
      .get(`http://localhost:8099/tx/${transactionId}`)
      .then((res) => res.data);
    setTxData(data.data);
  };

  const { sendTransaction, isPending, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    getTxData();
  }, []);

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col">
        <div>
          <span>{txData?.metadata.data.description}</span>
        </div>
      </div>
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
