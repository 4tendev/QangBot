"use client";
import React, { useState } from "react";
import dictionary from "./dictionary.json";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { useAppSelector } from "@/GlobalStates/hooks";
const Auth = () => {
  type TabType = "login" | "register";

  const [tab, setTab]: [TabType, Function] = useState("login");
  const lang = useAppSelector(language).lang;

  const tabs: { [key in TabType]: string } = {
    login: "Login",
    register: "Register",
  };
  return (
    <div className="px-5 sm:px-11 w-full max-w-lg mx-auto">
      <ul className="flex  mx-auto bg-base-100 ">
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
            {dictionary[tabsKey][lang]}
          </div>
        ))}
    </div>
  );
};

export default Auth;
