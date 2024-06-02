import React from "react";
import "./style.css";
import Link from "next/link";
import dictionary from "./dictionary.json";
import getLanguage from "@/commonTsServer/getLanguage";
const Invest = () => {
  const lang = getLanguage().lang;
  return (
    <div className="text-start  gap-x-2 w-full items-center justify-center flex sm:flex-col gorow px-9 my-5 pb-2">
      <div className="">
        <h4 className="text-[22vw] md:text-[160px] font-bold py-0 text-error leading-none w-fit">
          {dictionary.risk[lang]}
        </h4>
        <p className="text-[7vw] md:text-[50px]  font-bold py-0 leading-none">
          {dictionary.ourway[lang]}
        </p>
      </div>
      <div className="flex gap-2 items-center justify-center md:mt-[20px] mt-[3vw]  flex-col sm:flex-row ">
        <Link
          href={"/invest"}
          className="btn btn-xs btn-neutral max-w-[135px]  sm:grow  sm:min-w-40"
        >
          {dictionary.performance[lang]}
        </Link>
        <Link
          href={"/invest/participant"}
          className="btn btn-xs btn-primary max-w-[135px] shadow-2xl sm:grow sm:min-w-40"
        >
          {dictionary.participate[lang]}
        </Link>
      </div>
    </div>
  );
};

export default Invest;
