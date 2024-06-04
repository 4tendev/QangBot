import React from "react";
import dictionary from "./dictionary.json";
import Image from "next/image";
import getLanguage from "@/commonTsServer/getLanguage";
import WhyExplained from "./WhyExplained";

const Page = () => {
  const lang = getLanguage().lang;
  const headerClass="text-primary text-2xl mb-2 max-[550px]:my-2"
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
      <h3 className={headerClass}>
        {dictionary.mission[lang]}
      </h3>
      <div className="ps-2 mb-1">{dictionary.missionExplained[lang]}</div>
      <h3 className={headerClass}>
        {dictionary.whyus[lang]}
      </h3>
      <div className="ps-2 flex flex-wrap justify-between">
        <WhyExplained
          header={dictionary.innovation[lang]}
          explaination={dictionary.innovationExplained[lang]}
        />
        <WhyExplained
          header={dictionary.accessibility[lang]}
          explaination={dictionary.accessibilityExplained[lang]}
        />
        <WhyExplained
          header={dictionary.transparency[lang]}
          explaination={dictionary.transparencyExplained[lang]}
        />
      </div>
    </div>
  );
};

export default Page;
