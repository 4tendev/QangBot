"use client";
import React, { useState } from "react";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { useAppSelector, useAppDispatch } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import dictionary from "./dictionary.json";
import { newUserState  } from "@/GlobalStates/Slices/userSlice";
import {
  newAlert,
  serverErrorAlert,
  connectionErrorAlert,
} from "@/GlobalStates/Slices/alert/Slice";
import TextSVG from "../TextSVG";
const Lougout = () => {
  const [fetching, setFetching] = useState(false);
  const lang = useAppSelector(language).lang;
  const setGlobalState = useAppDispatch();

  async function logout() {
    if (fetching === false) {
      setFetching(true);
      try {
        const response = await fetchapi("/user/", "DELETE");
        if (response.code == "200") {
          setGlobalState(newUserState(response.data));
          setGlobalState(
            newAlert({
              message: dictionary.logedout[lang],
              mode: "success",
              time: 3,
            })
          );
        } else {
          setGlobalState(serverErrorAlert(lang));
        }
      } catch (error) {
        setGlobalState(connectionErrorAlert(lang));
      }
      setFetching(false);
    }
  }
  const svg =
    fetching === false ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4"
        fill="currentColor"
        viewBox="0 0 512 512"
      >
        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
      </svg>
    ) : (
      <span className="loading loading-bars loading-xs"></span>
    );
  return (
    <div onClick={logout} className=" h-full w-full text-rose-600 ">
      <TextSVG text={dictionary["logout"][lang]} svg={svg} />
    </div>
  );
};

export default Lougout;
