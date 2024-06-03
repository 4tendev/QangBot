"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import dictionary from "./dictionary.json";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import Loading from "../../loading";

type Payment = {
  address: string;
  price: number;
};

const VIPPayment = () => {
  const [payment, setPayment] = useState<Payment | undefined>(undefined);
  const lang = useAppSelector(language).lang;

  const router = useRouter();

  async function getPayment() {
    payment ??
      (await fetchapi("/user/vip/update/", "GET").then((response) => {
        response.code == "200" && setPayment(response.data);
      }));
  }

  async function checkSent() {
    if (payment) {
      const response = await fetchapi("/user/vip/update/", "POST", {
        address: payment.address,
      });
      if (response.code == "200") {
        response.data.paid == true && router.push("/user/plan");
      } else {
      }
    }
  }

  const copyToClipboard = async () => {
    payment && (await navigator.clipboard.writeText(payment.address));
  };

  useEffect(() => {
    getPayment();
    const interval = setInterval(checkSent, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [payment]);

  return payment ? (
    <div className="px-5 sm:px-11 max-w-md mx-auto">
      <div className="text-primary text-xl font-bold my-3 text-center">
        {dictionary.year[lang]}
      </div>
      <small>{dictionary.scan[lang]}</small>
      <div className="bg-white p-3 m-2 my-3 w-fit mx-auto">
        <QRCode
          size={200}
          value={`bitcoin:${payment.address}?amount=${payment.price}&label=1Year%20QANGBOT%20VIP`}
        />
      </div>
      <small> {dictionary.address[lang]}</small>
      <small
        className="unselectable border rounded mx-1 btn px-1 btn-xs btn-info"
        onClick={copyToClipboard}
      >
        {" "}
        {payment.address.substring(0, 5) +
          "..." +
          payment.address.substring(payment.address.length - 3)}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-3 inline-block mx-1"
          fill="currentColor"
          onClick={copyToClipboard}
        >
          <path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z" />
        </svg>
      </small>

      <div className="mt-2 flex items-center">
        <small className="me-1">{dictionary.amount[lang]}</small>
        <small className="text-lg text-info">{payment.price} BTC</small>
        <span className="loading loading-ring loading-sm mx-3  text-accent"></span>
      </div>

      <div className="flex items-center"></div>

      <Link href={"./"} className="btn w-full btn-ghost mx-2">
        {dictionary.dismiss[lang]}
      </Link>
    </div>
  ) : (
    <Loading />
  );
};

export default VIPPayment;
