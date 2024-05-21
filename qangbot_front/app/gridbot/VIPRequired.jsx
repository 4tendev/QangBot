"use client";
import Link from "next/link";
import React from "react";
import dictionary from "./dictionary";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
const VIPRequired = () => {
  const lang = useAppSelector(language).lang;
  return (
    <div className="my-3 px-5  text-info max-w-lg mx-auto">
      {dictionary.vipRequired[lang]}
      <br />
      <div className="flex flex-wrap gap-2 items-center mt-3">
        <Link className="btn btn-success btn-sm w-full " href={"/user/plan"}>
          {dictionary.becomeVIP[lang]}{" "}
        </Link>
      </div>
    </div>
  );
};

export default VIPRequired;
