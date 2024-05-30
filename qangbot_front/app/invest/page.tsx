import React from "react";
import Chart from "./Chart";
import getLanguage from "@/commonTsServer/getLanguage";
import getData from "@/commonTsServer/getData";
import Image from "next/image";
import dictionary from "./dictionary.json";
import Participation from "./participation";

const page = async () => {
  const history = await getData("/strategy/1/history/");
  const data = history.data;
  const lang = getLanguage().lang;
  return (
    <div className="w-full max-w-6xl mx-auto felx flex-col justify-start pb-12">
      {data.length > 0 && <Chart data={data} />}
      <div className="w-full ">
        <div className="flex w-full justify-between pe-5">
          <div className="flex sm:ps-11 ps-5 flex-col justify-center py-1">
            <div className=" sm:text-xl  text-md ">
              {dictionary.OurStrategy[lang]}
            </div>
            <div className="flex flex-wrap justify-between gap-y-3 gap-x-10 ps-3 py-2 max-w-2xl">
              <div className="py-1">
                <h3 className="text-primary">{dictionary.assumptions[lang]}</h3>
                <ul className="ps-2">
                  <li>{dictionary.adoption[lang]}</li>
                  <li>{dictionary.cycle[lang]} </li>
                  <li>{dictionary.volatile[lang]} </li>
                </ul>
              </div>
              <div>
                <h3 className="text-primary">
                  {dictionary.considerations[lang]}
                </h3>
                <ul className="ps-2">
                  <li>{dictionary.averages[lang]}</li>
                  <li>{dictionary.log[lang]} </li>
                  <li>{dictionary.hype[lang]}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-primary">{dictionary.risk[lang]}</h3>
                <ul className="ps-2">
                  <li>{dictionary.exchange[lang]}</li>
                  <li>{dictionary.cryptocurrency[lang]}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full md:w-fit flex-col fixed bottom-0 md:static  block md:flex  items-center justify-center  ">
            <Image
              className="hidden md:block"
              alt="Risk"
              width={350}
              height={350}
              src={"/risk.png"}
            ></Image>
            <div className="p-0  md:btn-xs left-0 md:absolute  md:top-[85px] md:left-[37%] bottom-0 w-full md:max-w-64 rounded-none ">
              <Participation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
