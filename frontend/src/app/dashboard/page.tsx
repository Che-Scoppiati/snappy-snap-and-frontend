"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TxResult } from "../tx/[transactionId]/page";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState<TxResult[]>([]);
  const account = useAccount();

  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch(`/api/tx/`);
      const data = await response.json();
      setTransactions(data.tx.data);
    }
    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col text-white">
      <h1>Dashboard</h1>
      <section className="">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Transaction Id</th>
                <th>Address</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                ? transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="font-bold">{tx.txHash}</td>
                      <td>{tx.fromAddress}</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">
                          details
                        </button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
            {/* foot */}
            <tfoot></tfoot>
          </table>
        </div>
      </section>
    </div>
  );
};
export default DashboardPage;