"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { GetTxResult } from "../tx/[transactionId]/page";
import axios, { AxiosResponse } from "axios";
import { TokenDetails } from "@/components/TokenDetails";
import { getShortAddress } from "@/lib/utils";

const DashboardPage = () => {
  const [isPersonal, setIsPersonal] = useState<boolean>(false);
  const [isLoadingTransactions, setIsLoadingTransactions] =
    useState<boolean>(true);

  const [transactions, setTransactions] = useState<GetTxResult[]>([]);
  const account = useAccount();
  // go here to see other chains https://www.blockscout.com/chains-and-projects
  const baseBlockscout = "https://eth-sepolia.blockscout.com";
  console.log("chain", account.chain);

  useEffect(() => {
    async function fetchTransactions() {
      const bloc = await getBlockscoutTransaction(
        "0x37c2e21bc8fe1977e3b9e8eafebe71774e28d1cf64b01988ece77cb8094c1a70",
      );
      const response = await fetch(`/api/tx/`);
      const data = await response.json();
      setTransactions(data.tx.data);
      setIsLoadingTransactions(false);
    }
    fetchTransactions();
  }, []);

  const getAllTransactions = async () => {
    setIsPersonal(false);
    setIsLoadingTransactions(true);
    const response = await fetch(`/api/tx/`);
    const data = await response.json();
    setTransactions(data.tx.data);
    setIsLoadingTransactions(false);
  };

  const getMyTransactions = async () => {
    setIsPersonal(true);
    setIsLoadingTransactions(true);
    const response = await fetch(`/api/tx/account/${account.address}`);
    const data = await response.json();
    setTransactions(data.tx.data);
    setIsLoadingTransactions(false);
  };

  async function getBlockscoutTransaction(txHash: string) {
    // reference https://eth-sepolia.blockscout.com/api-docs#operations-default-get_tx
    const data = axios.get(`${baseBlockscout}/api/v2/transactions/${txHash}`);
    return data;
  }

  return (
    <div className="flex flex-col text-white w-full">
      <section className="flex flex-col gap-5 items-center justify-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="overflow-x-auto h-[60vh] w-[80vw]">
          <div role="tablist" className="tabs tabs-boxed w-[50%]">
            <a
              role="tab"
              className={`tab ${isPersonal ? "" : "tab-active"}`}
              onClick={getAllTransactions}
            >
              All Transaction
            </a>
            <a
              role="tab"
              className={`tab ${isPersonal ? "tab-active" : ""}`}
              onClick={getMyTransactions}
            >
              My Transactions
            </a>
          </div>
          <div className={`collapse bg-transparent`}>
            <input type="radio" name="my-accordion-1" defaultChecked />
            <div className="collapse-title text-xl font-medium w-full flex gap-1 justify-between">
              <p className="w-1/4">Transaction</p>
              <p className="w-1/4">Action</p>
              <div className="flex gap-1 w-1/4">Solver</div>
              <p className="w-1/4">From Address</p>
            </div>
          </div>
          {!isLoadingTransactions && transactions
            ? transactions.map((tx, index) => (
                <div
                  className={`collapse ${index % 2 === 0 ? "bg-base-300" : "bg-base-100"}`}
                  key={tx.id}
                >
                  <input
                    type="radio"
                    name="my-accordion-1"
                    defaultChecked={index === 0 ? true : false}
                  />
                  <div className="collapse-title text-xl font-medium w-full flex gap-1 justify-between">
                    <p className="w-1/4">
                      <a
                        href={`${baseBlockscout}/address/0x76333b4B92Ca51b692FAB95Bf48A77d60681A965`}
                        style={{ zIndex: 2 }}
                        target="_blank"
                      >
                        {getShortAddress(tx.txHash)}
                      </a>
                    </p>
                    <p className="w-1/4">
                      {tx.metadata?.action.charAt(0).toUpperCase() +
                        tx.metadata?.action.slice(1)}
                    </p>
                    <div className="flex gap-1 w-1/4">
                      {tx.metadata?.solver.charAt(0).toUpperCase() +
                        tx.metadata?.solver.slice(1)}
                      <Image
                        src={`/images/${tx.metadata?.solver.toLowerCase()}_logo.png`}
                        alt={`${tx.metadata?.solver} Logo`}
                        width={30}
                        height={30}
                        className="w-6 h-6"
                      />
                    </div>
                    <p className="w-1/4">{getShortAddress(tx.fromAddress)}</p>
                  </div>
                  <div className="collapse-content flex flex-col gap-4">
                    <hr className="w-full border border-1 border-white/10" />
                    <div className="flex gap-1 justify-around">
                      <div className="flex flex-col gap-1">
                        <TokenDetails
                          token={tx.metadata.data.fromToken}
                          amount={tx.metadata.data.fromAmount}
                          isFrom={true}
                          address={tx.metadata.data.fromAddress}
                          size="sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <TokenDetails
                          token={tx.metadata.data.toToken}
                          amount={tx.metadata.data.toAmount}
                          isFrom={false}
                          address={tx.metadata.data.toAddress}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null}
          {isLoadingTransactions && (
            <span className="loading loading-spinner loading-lg" />
          )}
        </div>
      </section>
    </div>
  );
};
export default DashboardPage;
