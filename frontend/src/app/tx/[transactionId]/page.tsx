"use client";

import { useParams } from "next/navigation";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import axios from "axios";
import { useEffect, useState } from "react";
import { TransactionData } from "@brian-ai/sdk";
import Image from "next/image";
import { TokenDetails } from "@/components/TokenDetails";
import { FaArrowRightLong } from "react-icons/fa6";
import { parseEther } from "viem";

interface Metadata {
  action: string;
  data: TransactionData;
  solver: string;
  type: string;
}
export interface GetTxResult {
  id: string;
  metadata: Metadata;
  fromAddress: string;
  txHash: string | null;
}

export default function Tx() {
  const [txMetadata, setTxMetadata] = useState<Metadata | null>(null);

  const { transactionId } = useParams();

  const getTxData = async () => {
    const data = await axios
      .get(`http://localhost:8099/tx/${transactionId}`)
      .then((res) => res.data);
    const getTxResult: GetTxResult = data.data;
    setTxMetadata(getTxResult.metadata);
  };

  const { sendTransaction, isPending, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    getTxData();
  }, []);

  return txMetadata ? (
    <div className="flex flex-col gap-16 items-center w-[60rem] glass rounded-[2.5rem] p-10">
      {/* HEADER */}
      <div className="flex w-full justify-between">
        <span className="text-5xl">
          {txMetadata?.action.charAt(0).toUpperCase() +
            txMetadata?.action.slice(1)}
        </span>
        <div className="flex flex-col items-end gap-1">
          <span className="text-lg leading-none text-zinc-300">Solver</span>
          <div className="flex gap-2">
            <span className="text-2xl leading-none mt-[0.1rem]">
              {txMetadata?.solver}
            </span>
            <Image
              src={`/images/${txMetadata?.solver}_logo.png`}
              alt={`${txMetadata?.solver} Logo`}
              width={30}
              height={30}
              className="w-6 h-6"
            />
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-[40%_20%_40%] gap-0 justify-items-center items-center w-full">
        <TokenDetails
          token={txMetadata?.data.fromToken}
          amount={txMetadata.data.fromAmount}
        />
        <div className="col-span-1 w-fit">
          <FaArrowRightLong color="white" className="w-[60px] h-[60px]" />
        </div>
        <TokenDetails
          token={txMetadata?.data.toToken}
          amount={txMetadata.data.toAmount}
        />
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
        <span className="text-xl">Confirm</span>
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
  ) : (
    <div>Loading...</div>
  );
}
