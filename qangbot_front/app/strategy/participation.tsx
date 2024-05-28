"use client";
import React, { useEffect, useState } from "react";
import dictionary from "./dictionary.json";
import { useAppSelector } from "@/GlobalStates/hooks";
import { isKnown } from "@/GlobalStates/Slices/userSlice";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";

const Participation = () => {
  const UserIsKnown = useAppSelector(isKnown);
  const lang = useAppSelector(language).lang;
  const [value, setValue] = useState(undefined);
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
    <span className="loading loading-ring loading-xs mt-3 ms-11"></span>

  ) : UserIsKnown === false ? null : (
    <div className="ps-5 mt-3">
      {dictionary.yourShare[lang]}
      <small className="text-success text-lg ">{value}USD</small>
    </div>
  );
};

export default Participation;
