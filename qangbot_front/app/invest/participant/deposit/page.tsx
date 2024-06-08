"use client";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import dictionary from "./dictionary.json";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import Loading from "@/app/loading";
import { totpActivated } from "@/GlobalStates/Slices/userSlice";
import Link from "next/link";

type Transaction = {
  txHash: string;
  amount: number;
  share: number | null;
};

type DepositAddress = {
  address: string;
  transactions: Transaction[];
};

const Page = () => {
  const [depositAddress, setDepositAddress] = useState<
    undefined | DepositAddress
  >(undefined);
  const lang = useAppSelector(language).lang;
  const isTOTPActivated = useAppSelector(totpActivated);

  function URI(depositAddress: DepositAddress) {
    return `bitcoin:${depositAddress.address}?label=Share`;
  }

  const fetchMempool = async (): Promise<void> => {
    try {
      if (depositAddress) {
        const response = await fetch(
          `https://mempool.space/api/address/${depositAddress.address}/txs/mempool`
        );
        if (response.ok) {
          const transactions = await response.json();
          for (let index = 0; index < transactions.length; index++) {
            const tx = transactions[index];
            if (
              !depositAddress.transactions.find(
                (transaction) => transaction.txHash == tx.txid
              )
            ) {
              const address = depositAddress.address;
              const utxo = tx.vout.find(
                (utxo: any) => utxo.scriptpubkey_address == address
              );

              if (utxo) {
                const newTransaction: Transaction = {
                  txHash: tx.txid,
                  amount: utxo.value / 10000000,
                  share: null,
                };

                setDepositAddress((prev) => {
                  if (prev) {
                    return {
                      address: address,
                      transactions: [newTransaction, ...prev.transactions],
                    };
                  }
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function getDepositAddress() {
    fetchapi("/strategy/participant/deposit/", "GET").then((response) => {
      setDepositAddress(response.data);
    });
  }
  const copyToClipboard = async () => {
    depositAddress &&
      (await navigator.clipboard.writeText(depositAddress.address));
  };

  useEffect(() => {
    const intervalId = setInterval(fetchMempool, 120000);
    return () => {
      clearInterval(intervalId);
    };
  }, [depositAddress]);
  useEffect(() => {
    getDepositAddress();

    return () => {};
  }, []);

  return depositAddress ? (
    <>
      <div className="px-5 sm:px-11 max-w-md mx-auto flex flex-col items-center justify-center gap-2">
        <div className="text-accent text-xl font-bold my-1 text-center">
          {dictionary.deposit[lang]}
        </div>
        {isTOTPActivated ? (
          <>
            <div>
              <small className="block">{dictionary.convertProcess[lang]}</small>

              <small>{dictionary.processTime[lang]}</small>
              <small className="block">
                <small className="text-lg text-info">
                  {dictionary.fee[lang]}
                </small>
              </small>
            </div>

            <div className="bg-white p-3 m-2 my-3 w-fit mx-auto">
              <QRCode size={200} value={URI(depositAddress)} />
            </div>
            <div className="relative w-full p-0">
              <small> {dictionary.address[lang]}</small>
              <button
                onClick={copyToClipboard}
                className="unselectable border rounded mx-1 btn px-1 btn-xs btn-warning"
              >
                {" "}
                {depositAddress.address.substring(0, 5) +
                  "..." +
                  depositAddress.address.substring(
                    depositAddress.address.length - 3
                  )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-3 inline-block mx-1 "
                  fill="currentColor"
                >
                  <path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <Link className="btn btn-success btn-sm text-xs" href={"/user/totp"}>
            {dictionary.totpActivate[lang]}{" "}
          </Link>
        )}
        {depositAddress.transactions.length > 0 && (
          <>
            <div className="text-start w-full text-xl">
              {dictionary.recentTransactions[lang]}
            </div>
            <div className=" flex flex-col gap-3 py-3 border rounded-2xl w-full text-xs">
              <div className="flex justify-between    px-3">
                <div>{dictionary.BTC[lang]} </div>
                <div>{dictionary.equivalentShare[lang]}</div>
              </div>
              {depositAddress.transactions.map((transaction) => (
                <div
                  key={transaction.txHash}
                  className="flex justify-between relative mx-4"
                >
                  {Math.abs(transaction.amount)} BTC
                  {transaction.share ? (
                    <>
                      <div className="absolute left-1/2">
                        {transaction.share > 0 ? "->" : "<-"}
                      </div>
                      <div>{Math.abs(transaction.share)} USD</div>
                    </>
                  ) : (
                    <span className="loading loading-ring loading-xs "></span>
                  )}{" "}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Page;
