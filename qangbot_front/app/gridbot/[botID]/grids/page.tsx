"use client";
import React, { useState } from "react";
import GridsTable from "./GridsTable";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import dictionary from "./dictionary.json";
import AddGrids from "./AddGrids";
export type TabType = "info" | "add";
export default function Page({ params }: { params: { botID: number } }) {
  const lang = useAppSelector(language).lang;
  const [tab, setTab] = useState<TabType>("info");

  const tabs: { [key in TabType]: JSX.Element } = {
    info: <GridsTable botID={Number(params.botID)} />,
    add: <AddGrids botID={Number(params.botID)} setTab={setTab} />,
  };

  return (
    <>
      <div className="text-2xl text-info ps-3 mt-1 text-start w-full">
        {dictionary.option[lang]}
      </div>
      <div className="w-full max-w-lg mx-auto">
        <ul className="flex px-3 mx-auto bg-base-100 ">
          {Object.keys(tabs)
            .map((tabsKey) => tabsKey as TabType)
            .map((tabsKey) => (
              <li
                className={
                  "mx-1  btn btn-xs my-2 px-2 sm:px-3 max-[320px]:px-1   max-[300px]:text-xs  " +
                  (tabsKey === tab ? " btn-accent shadow-md  " : " btn-ghost ")
                }
                key={tabsKey}
                onClick={() => setTab(tabsKey)}
              >
                {dictionary[tabsKey][lang]}
              </li>
            ))}
        </ul>
        {Object.keys(tabs)
          .map((tabsKey) => tabsKey as TabType)
          .map((tabsKey) => (
            <div key={tabsKey} className="w-full" hidden={tab !== tabsKey}>
              {tabs[tabsKey]}
            </div>
          ))}
      </div>
    </>
  );
}
