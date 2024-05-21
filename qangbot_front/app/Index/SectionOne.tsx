import React from "react";
import dictionary from "./dictionary.json";
import Link from "next/link";
import getLanguage from "@/commonTsServer/getLanguage";
const SectionOne = () => {
  const lang = getLanguage().lang;
  return (
    <div>
      <h1 className="font-black subpixel-antialiased text-center text-[80px]	mt-3 max-[1000px]:text-[9vw]">
        {dictionary.isVolatile[lang]}
        <div className="text-primary text-[100px] max-[1000px]:text-[11vw]">
          {dictionary.GridBot[lang]}
        </div>
        {dictionary.exploreGridBot[lang]}
      </h1>
      <p className="text-center sm:px-12 px-8 py-3 sm:text-xl">
        {dictionary.gridbenefits[lang]}
      </p>
      <div className="flex justify-center py-1 px-9">
        <div className="w-1/2 pe-1 max-w-xs">
          <Link
            href={"gridbot/new"}
            className="btn  btn-sm sm:btn-md text-xs w-full btn-success"
          >
            {dictionary.createFree[lang]}
          </Link>
        </div>
        <div className="w-1/2 ps-1 max-w-xs">
          <Link
            href={"gridbot/test"}
            className="btn btn-sm sm:btn-md text-xs w-full  btn-accent"
          >
            {dictionary.backTest[lang]}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
