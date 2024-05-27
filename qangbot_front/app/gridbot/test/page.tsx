import React from "react";
import Chart from "./Chart";
import Chart100k from "./Chart100k";

import Image from "next/image";
import dictionary from "./dictionary.json";
import getLanguage from "@/commonTsServer/getLanguage";

const Page = () => {
  const lang = getLanguage().lang;
  return (
    <div className="w-full max-w-6xl p-5 px-5 sm:px-11 pb-14">
      <div className="ps-3 mb-5 gap-3 flex flex-col min-[770px]:flex-row items-center">
        <div>
          <h1 className="font-bold text-3xl sm:text-4xl text-start text-info">
            {dictionary.testDecide[lang]}
          </h1>
          <p className="pt-3">{dictionary.testDecideExplain[lang]}</p>
        </div>
        <div className="min-[770px]:w-1/2 w-full shrink-0">
          <Image
            alt={"Test Example"}
            className="w-full shadow-lg"
            height={1000}
            src={"/GridTest.png"}
            width={1000}
          ></Image>
        </div>
      </div>
      <h2 className="text-xl text-accent">{dictionary.example[lang]}</h2>
      <p className="p-3">{dictionary.exampleintro[lang]}</p>
      <Chart />
      <br />
      {dictionary.offGrids[lang]}

      <Chart100k />
    </div>
  );
};

export default Page;
