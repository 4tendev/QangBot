import Link from "next/link";
import React from "react";
import dictionary from "./dictionary.json";
import VIPExplain from "./VIPExplain";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";

const FreePlan = () => {
  const lang = useAppSelector(language).lang;
  return (
    <div className="py-5 flex flex-col justify-center text-center px-5 sm:px-11">
      <h1 className="text-xl text-info">{dictionary.FreePlan[lang]}</h1>
      <ul className="flex flex-wrap max-w-lg text-sm justify-between my-3 text-start gap-2 px-3 mx-auto">
        <li>{dictionary.botCreationLimit[lang]}</li>
        <li>{dictionary.gridLimitation[lang]}</li>
        <li>{dictionary.intervalLimitation[lang]}</li>
      </ul>
      <div className="border border-neutral-600 mx-auto max-w-lg shadow-2xl rounded-xl my-3 p-4 w-full">
        <VIPExplain  />
        <Link href={"plan/update"} className="btn btn-success w-full">
          {dictionary.upgrade[lang]}
        </Link>
      </div>
    </div>
  );
};

export default FreePlan;
