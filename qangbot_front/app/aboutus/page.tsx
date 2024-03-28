import React from "react";
import dictionary from "./dictionary.json";
import Image from "next/image";
import getLanguage from "@/commonTsServer/getLanguage";

const Page = () => {
  const lang = getLanguage().lang;

  return (
    <div className="flex flex-col gap-3 mx-auto max-w-5xl px-6 sm:px-11 pb-10">
      <div className="flex max-[500px]:flex-col items-center ">
        <div className="w-1/2 max-[500px]:w-full pt-5">
          {dictionary.intro[lang]}
        </div>
        <Image
          alt="Us"
          width={468}
          height={468}
          className="rounded-full  max-[500px]:w-4/5  w-1/2"
          src={"/aboutus.png"}
        />
      </div>
      <h3 className="text-primary text-2xl mb-2 max-[550px]:my-2">
        {dictionary.mission[lang]}
      </h3>
      <div className="ps-2 mb-1">
        {dictionary.missionExplained[lang]}
        </div>
      <h3 className="text-primary text-2xl my-3 max-[550px]:my-3">
        {dictionary.whyus[lang]}
      </h3>
      <div className="ps-2 flex flex-wrap justify-between">
        <div className="my-2 sm:w-1/2 max-w-sm">
          <small className="text-lg text-info block mb-2">
            {dictionary.innovation[lang]}
          </small>
          <div className="px-3">{dictionary.innovationExplained[lang]}</div>
        </div>
        <div className="my-2 sm:w-1/2 max-w-sm">
          <small className="text-lg text-info block mb-2">
            {dictionary.accessibility[lang]}
          </small>
          <div className="px-3">{dictionary.accessibilityExplained[lang]}</div>
        </div>
        <div className="my-2 sm:w-1/2 max-w-sm">
          <small className="text-lg text-info block mb-2">
            {dictionary.transparency[lang]}
          </small>
          <div className="px-3">{dictionary.transparencyExplained[lang]}</div>
        </div>
      </div>
    </div>
  );
};

export default Page;
