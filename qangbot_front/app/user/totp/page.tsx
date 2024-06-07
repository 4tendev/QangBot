"use client";
import { totpActivated } from "@/GlobalStates/Slices/userSlice";
import { useAppSelector } from "@/GlobalStates/hooks";
import Link from "next/link";
import React from "react";
import dictionary from "./dictionary.json";
import { language } from "@/GlobalStates/Slices/languageSlice";

const Page = () => {
  const isTOTPActivated = useAppSelector(totpActivated);
  const lang = useAppSelector(language).lang;
  return isTOTPActivated ? (
    <div className="flex text-xs alert alert-success rounded-none sm:rounded gap-3 sm:my-3 mx-auto items-center justify-between sm:max-w-md px-5">
      {dictionary.protected[lang]}
      <Link
        href={"/user/totp/update"}
        className="btn text-center  btn-neutral sm:btn-xs fixed sm:static left-0 bottom-0 w-full sm:w-fit rounded-none sm:rounded"
      >
        {dictionary.change[lang]}
      </Link>
    </div>
  ) : (
    <div className=" mx-auto sm:max-w-md ">
      <div className="flex  text-xs alert alert-warning rounded-none sm:rounded  gap-3 sm:my-3 items-center justify-between px-5">
        {dictionary.notProtected[lang]}
        <Link
          href={"/user/totp/update"}
          className="btn btn-success sm:btn-xs fixed sm:static left-0 bottom-0 w-full sm:w-fit rounded-none sm:rounded"
        >
          {dictionary.activate[lang]}
        </Link>
      </div>
      <div className="px-5">{dictionary.authenticatorApp[lang]}</div>
    </div>
  );
};

export default Page;
