"use client";
import React, { useState } from "react";
import dictionary from "./dictionary.json";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { useAppSelector } from "@/GlobalStates/hooks";
import Login from "./login/page";

const Auth = () => {
  type TabType = "login" | "register";
  const [tab, setTab]: [TabType, Function] = useState("login");
  const lang = useAppSelector(language).lang;

  const tabs: { [key in TabType]: React.JSX.Element } = {
    login: <Login />,
    register: <Login />,
  };
  return (
    <div className="w-full max-w-lg mx-auto">
      <ul className="flex px-3 mx-auto bg-base-100 ">
        {Object.keys(tabs)
          .map((tabsKey) => tabsKey as TabType)
          .map((tabsKey) => (
            <li
              className={
                "mx-1  btn my-2 px-2 sm:px-3 max-[320px]:px-1   max-[300px]:text-xs  " +
                (tabsKey === tab ? " btn-accent  " : " btn-ghost ")
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
  );
};

export default Auth;
