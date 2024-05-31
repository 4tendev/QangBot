"use client";
import React, { useEffect, useState } from "react";
import dictionary from "./dictionary.json";
import { useAppSelector } from "@/GlobalStates/hooks";
import { isKnown } from "@/GlobalStates/Slices/userSlice";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import Link from "next/link";

const Participation = () => {
  const UserIsKnown = useAppSelector(isKnown);
  const lang = useAppSelector(language).lang;
  const [value, setValue] = useState<number | undefined>(undefined);
  function getUserShare() {
    fetchapi("/strategy/participant/", "GET").then((response) => {
      response.code === "200" ? setValue(response.data.value) :setValue(0) ;
    });
  }

  useEffect(() => {
    UserIsKnown !==undefined && getUserShare();
    return () => {};
  }, [UserIsKnown]);

  
  return UserIsKnown === undefined || value === undefined ? (
    <span className="loading loading-ring loading-xs "></span>
  ) : value > 0 ? (
    <div className="p-0 md:h-7   bg-base-300 relative rounded-none md:rounded w-full h-14  flex text-xs justify-between items-center text-start">
      <div dir="ltr" className="grow md:ps-1  ps-[8vw] flex items-center justify-start h-full  font-bold md:text-xs  text-[3.7vw]">
        {dictionary.share[lang]}
        {value.toLocaleString()}  {dictionary.usd[lang]}
      </div>
      <Link
        href={"/invest/participant"}
        className="md:btn-xs h-14 btn w-1/2 absolute right-0 rounded-none md:rounded btn-success "
      >
        {dictionary.modify[lang]}
      </Link>
    </div>
  ) : (
    <Link
      href={"/invest/participant"}
      className="btn  md:btn-xs w-full rounded-none md:rounded btn-success"
    >
      {dictionary.participate[lang]}
    </Link>
  );
};

export default Participation;
