"use client";
import { useState, useRef, useEffect } from "react";

import Link from "next/link";

import dictionary from "./dictionary.json";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { useAppSelector } from "@/GlobalStates/hooks";

import Lougout from "./Logout/Lougout";

import ProfileImage from "../ProfileImage";
import TextSVG from "./TextSVG";

import {menuList} from "@/app/user/UserMenu"

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef  = useRef<HTMLUListElement | null>(null);
  const lang = useAppSelector(language).lang;

  useEffect(() => {
    const handleClickOutside = (event : MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node )) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = () => {
    setIsOpen(false);
  };
  const liClassName = "h-10 w-full flex items-center";


  return (
    <div className="dropdown dropdown-end ">
      <div className="h-full flex items-center "  >
        <ProfileImage onClick={()=> setIsOpen(true)}/>
      </div>

      {isOpen && (
        <ul
          ref={dropdownRef}
          tabIndex={0}
          className="dropdown-content  shadow-lg z-[1] mt-4 py-2  bg-base-200  w-52"
        >
          {menuList.map((item) => (
            <li key={item.textKey} className={liClassName}>
              <Link
                onClick={handleItemClick}
                className="w-full"
                href={item.href}
              >
                <TextSVG  svg={item.svg} text={ dictionary[item.textKey][lang]} />

              </Link>
            </li>
          ))}
          <li className={liClassName} >
            <Lougout />
          </li>
        </ul>
      )}
    </div>
  );
}
