"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import dictionary from "../plan/dictionary.json";
import VIPExplain from "./VIPExplain";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";

import { vipExpiration } from "@/GlobalStates/Slices/userSlice";
const VIPPlan = () => {
  const lang = useAppSelector(language).lang;
  const vipExpirationDate = useAppSelector(vipExpiration);
  return (
    <div className="py-5 flex flex-col justify-center text-center  px-5 sm:px-11">
      <h1 className="text-xl text-info ">{dictionary.VIPPlan[lang]}</h1>
      <p className="text-start text-xs mx-auto">
        {dictionary.expiry[lang]}{" "}
        <span className="countdown text-rose-600 font-bold m-3 font-mono text-2xl">
          {vipExpirationDate}
        </span>
      </p>
      <div className="border border-neutral-600 max-w-lg shadow-2xl rounded-xl my-3 p-4 w-full mx-auto">
        <VIPExplain />
        <Link href={"plan/update"} className="btn btn-success w-full">
          {dictionary.update[lang]}
        </Link>
      </div>
    </div>
  );
};

export default VIPPlan;
