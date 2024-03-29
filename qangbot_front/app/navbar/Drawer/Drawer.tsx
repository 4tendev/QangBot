import React from "react";
import Language from "../Language/Language";
import Theme from "../Theme/Theme";
import { Site_MENU } from "@/settings";
import dictionary from "../dictionary.json";
import DrawerList from "./DrawerList";
import getLanguage from "@/commonTsServer/getLanguage";

const Drawer = () => {
  const lang = getLanguage().lang;
  const toggleID : string  = "MENU"

  return (
    <div className="drawer-start md:hidden flex ">
      <input id={toggleID} type="checkbox" className="drawer-toggle " />
      <div className="drawer-content">
        <label htmlFor="menu" className="">
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>
        </label>
      </div>
      <div className="drawer-side z-10">
        <label
          htmlFor="menu"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 max-w-xs w-10/12 min-h-full bg-base-200 text-base-content">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center ">
              <Language />
              <Theme />
            </div>

            <label
              htmlFor="menu"
              aria-label="close sidebar"
              className="btn btn-ghost text-rose-600"
            >
              X
            </label>
          </div>
          {Site_MENU.map((item) => (
            <DrawerList
              key={item.name}
              link={item.link}
              text={dictionary[item.name][lang]}
              toggleID={toggleID}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
