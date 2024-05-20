"use client";
import React, { useState } from "react";

import dictionary from "./dictionary.json";

import { language } from "@/GlobalStates/Slices/languageSlice";
import { useAppSelector } from "@/GlobalStates/hooks";

import Login from "./login/page";
import Register from "./register/page";
import ResetPassword from "./resetpassword/page";

const Auth = () => {
  type TabType = "login" | "register" | "resetPassword";
  const [tab, setTab] = useState<TabType>("login");
  const lang = useAppSelector(language).lang;

  const tabs: { [key in TabType]: JSX.Element } = {
    login: <Login />,
    register: <Register />,
    resetPassword: <ResetPassword />,
  };
  return (
    <div className="w-full max-w-lg mx-auto">
      <ul className="flex px-3 mx-auto bg-base-100 ">
        {Object.keys(tabs)
          .map((tabsKey) => tabsKey as TabType)
          .map((tabsKey) => (
            <li
              className={
                "mx-1 btn-sm btn my-2 px-2 sm:px-3 max-[320px]:px-1   max-[300px]:text-xs  " +
                (tabsKey === tab ? " btn-accent shadow-md" : " btn-ghost ")
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
