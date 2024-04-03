import React from "react";
import WebSiteName from "../WebSiteName";
import Drawer from "./Drawer/Drawer";
import Theme from "./Theme/Theme";
import Language from "./Language/Language";
import Link from "next/link";
import dictionary from "./dictionary.json";
import getLanguage from "@/commonTsServer/getLanguage";
import Profile from "./Profile/Profile";
import { Navbar_Height, Site_MENU } from "@/settings";

const Navbar = () => {
  const lang = getLanguage().lang;
  const navbarClassName = `w-full bg-base-300 h-[${Navbar_Height}px]`
  return (
    <div className={navbarClassName} >
      <nav className="w-full flex justify-between h-full items-center px-5 md:px-11 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-5 md:hidden">
          <Drawer />
        </div>
        <div className="flex items-center grow md:grow-0">
          <div className="md:order-1">"Robot"</div>
          <div className="grow flex justify-center">
            <WebSiteName />
          </div>
        </div>
        <ul className=" hidden md:flex gap-6 text-sm">
          {Site_MENU.map((item) => (
            <li key={item.name}>
              <Link href={item.link}>{dictionary[item.name][lang]}</Link>
            </li>
          ))}
        </ul>
        <div className="flex">
          <div className="hidden sm:flex items-center">
            <Language />
            <Theme />
          </div>
          <Profile />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
