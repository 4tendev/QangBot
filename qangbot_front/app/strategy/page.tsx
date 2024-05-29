import React from "react";
import Chart from "./Chart";
import getLanguage from "@/commonTsServer/getLanguage";
import getData from "@/commonTsServer/getData";
import Image from "next/image";
import dictionary from "./dictionary.json";
import Participation from "./participation";

const page = async () => {
  const history = await getData("/strategy/");

  const data = history.data;

  const lang = getLanguage().lang;
  return (
    <div className="w-full max-w-6xl mx-auto felx flex-col justify-start">
      {
        data.length >0 &&  <Chart data={data} />
      }
    

      <div className="w-full px-6 sm:px-11">
        <div className="flex w-full justify-between">
          <div className="flex  flex-col justify-center ">
            <div className=" text-lg ">
              {dictionary.OurStrategy[lang]}
            </div>
            <div className="flex flex-wrap justify-between gap-y-6 gap-x-10 ps-3 py-3  max-w-2xl">
              <div>
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
          <div className="flex items-center max-[835px]:hidden  justify-center grow">
            <Image
              alt="Risk"
              width={300}
              height={300}
              src={"/risk.png"}
            ></Image>
          </div>
        </div>
      </div>
      <Participation/>

    </div>
  );
};

export default page;
