"use client";

import { useParams } from "next/navigation";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  useSwitchChain,
} from "wagmi";
import axios from "axios";
import { useEffect, useState } from "react";
import { TransactionData } from "@brian-ai/sdk";
import Image from "next/image";
import { TokenDetails } from "@/components/TokenDetails";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdSwapHoriz } from "react-icons/md";
import { abiNftLinea } from "./nft-abi-linea";
import { walletConnectProvider } from "@/context";
import { getExplorerUrlByChainId } from "@/config/costants";
import confetti from "canvas-confetti";

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
const BACKEND_URL = process.env.BACKEND_URL;

export default function Tx() {
  const [txMetadata, setTxMetadata] = useState<Metadata | null>(null);
  const account = useAccount();
  const {
    data: hashMint,
    isPending: isPendingMint,
    writeContract,
    error: errorMint,
  } = useWriteContract();
  errorMint && console.log("error mint", errorMint);

  const { transactionId } = useParams();

  const getTxData = async () => {
    const data = await axios
      .get(`/api/tx/${transactionId}`)
      .then((res) => res.data);
    const getTxResult: GetTxResult = data.tx.data;
    setTxMetadata(getTxResult.metadata);
  };

  const {
    sendTransaction,
    isPending: isTxPending,
    data: hash,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { isLoading: isConfirmingMint, isSuccess: isConfirmedMint } =
    useWaitForTransactionReceipt({ hash: hashMint });

  useEffect(() => {
    getTxData();
  }, []);

  const mintNft = async () => {
    // get a random uint tokenId from 2 to 100
    const tokenId = Math.floor(Math.random() * 99) + 2;
    console.log("minting nft", tokenId);
    try {
      writeContract({
        address: "0x0d677fd109a1be0f32028c43aea4a1481a015402", // linea sepolia nft
        // address: "0xe9c31ab9a6dbd39aad1bd82d3713084742e38197", // linea mainnet nft
        abi: abiNftLinea,
        functionName: "safeMint",
        args: [
          account.address,
          BigInt(tokenId),
          "https://ipfs.io/ipfs/Qmbks95fQRb3zsnsWSHVFAHd6iLBGuM8otSJyVjzXLBNgM",
        ],
      });
    } catch (e) {
      console.error("error mint", e);
    }
    console.log("minted", hashMint);
  };

  const chainId = walletConnectProvider.getState().selectedNetworkId;
  const txChainId = txMetadata?.data.fromChainId;
  const wrongChain = chainId && txChainId && chainId !== txChainId;

  const { isPending: isSwitchChainPending, switchChain } = useSwitchChain();

  useEffect(() => {
    if (wrongChain) {
      switchChain({ chainId: txChainId });
    }
  }, [chainId, txChainId]);

  const explorerUrl = getExplorerUrlByChainId(txChainId);

  useEffect(() => {
    if (isConfirmed) {
      confetti({
        particleCount: 200,
        spread: 70,
      });
    }
  }, [isConfirmed]);

  return txMetadata ? (
    <div className="flex flex-col gap-12 items-center w-[60rem] glass rounded-[2.5rem] p-10">
      {/* HEADER */}
      <div className="flex w-full justify-between">
        <span className="text-[2.5rem] leading-1">
          {txMetadata?.action.charAt(0).toUpperCase() +
            txMetadata?.action.slice(1)}
        </span>
        <div className="flex flex-col items-end gap-1">
          <span className="text-lg leading-none text-zinc-300">Solver</span>
          <div className="flex gap-2">
            <span className="text-2xl leading-none">{txMetadata?.solver}</span>
            <Image
              src={`/images/${txMetadata?.solver.toLowerCase()}_logo.png`}
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
          token={txMetadata.data.fromToken}
          amount={txMetadata.data.fromAmount}
          isFrom={true}
          address={txMetadata.data.fromAddress}
        />
        <div className="col-span-1 w-fit">
          {txMetadata?.action === "transfer" && (
            <FaArrowRightLong color="white" className="w-[60px] h-[60px]" />
          )}
          {txMetadata?.action === "swap" && (
            <MdSwapHoriz color="white" className="w-[80px] h-[80px]" />
          )}
          {txMetadata?.action === "bridge" && (
            <FaArrowRightLong color="white" className="w-[60px] h-[60px]" />
          )}
        </div>
        <TokenDetails
          token={txMetadata?.data.toToken}
          amount={txMetadata.data.toAmount}
          isFrom={false}
          address={txMetadata.data.toAddress}
        />
      </div>

      {!isConfirmed && (
        <button
          className="btn btn-accent"
          onClick={() => {
            wrongChain
              ? switchChain({ chainId: txChainId })
              : sendTransaction(txMetadata.data.steps?.[0] as any);
          }}
          disabled={isSwitchChainPending || isTxPending || isConfirming}
        >
          <span className="text-xl">
            {wrongChain ? "Switch Chain" : "Confirm"}
          </span>
          {(isTxPending || isConfirming) && (
            <span className="loading loading-spinner loading-xs" />
          )}
        </button>
      )}
      {isConfirmed && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">Transaction Successful 🤝</span>
          <span className="text-xl">
            View more details on{" "}
            <a href={`${explorerUrl}/tx/${hash}`} target="_blank">
              Blockscout
            </a>
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-2xl">
          Now you are an OG user of Snappy with Brian
        </h1>
        <button className="btn btn-accent" onClick={mintNft}>
          {isPendingMint || isConfirmingMint ? "Minting..." : "Mint your NFT"}
        </button>
        {hashMint}
        {isConfirmedMint && (
          <div className="flex flex-col gap-4 items-center">
            <span className="icon icon-check text-2xl">
              NFT Minted! Go to{" "}
              <a
                href={`https://explorer.sepolia.linea.build/tx/${hashMint}`}
                target="_blank"
              >
                Blockscout
              </a>
            </span>
          </div>
        )}
      </div>
    </div>
  ) : (
    <span className="loading loading-spinner loading-lg" />
  );
}
