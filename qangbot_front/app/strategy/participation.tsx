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
      response.code === "200" && setValue(response.data.value);
    });
  }

  useEffect(() => {
    getUserShare();
    return () => {};
  }, [UserIsKnown]);

  return UserIsKnown === undefined || value === undefined ? (
    <span className="loading loading-ring loading-xs "></span>
  ) : value > 0 ? (
    <button  className="p-0 md:h-7   bg-base-300 relative rounded-none md:rounded w-full h-14  flex text-xs justify-between items-center text-start">
      <div className="grow md:ps-1  ps-[10vw] flex items-center justify-start h-full  font-bold md:text-xs  text-[3.7vw]">
        Share ~ { value.toLocaleString()} USD
      </div>

      <Link href={"/strategy/participant"} className="md:btn-xs h-14 btn w-1/2 absolute right-0 rounded-none md:rounded btn-success ">
        Modify  Share
      </Link>
    </button>
  ) : (
    <Link href={"/strategy/participant"} className="btn  md:btn-xs w-full rounded-none md:rounded btn-success">
      Participate
    </Link>
  );
};

export default Participation;
