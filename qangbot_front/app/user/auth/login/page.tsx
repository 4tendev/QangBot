"use client";

import UseFormTemplate from "@/app/UseForm/UseFormTemplate";

import {
  passwordInput,
  usernameInput,
  trustedDeviceInput,
} from "../inputs/inputs";
import dictionary from "./dictionary.json";
import React from "react";

import { useRouter, usePathname } from "next/navigation";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import { newUserState } from "@/GlobalStates/Slices/userSlice";
import {
  newAlert,
  serverErrorAlert,
  connectionErrorAlert,
} from "@/GlobalStates/Slices/alert/Slice";
import { language } from "@/GlobalStates/Slices/languageSlice";

const Page = () => {
  const setGlobalState = useAppDispatch();
  const lang = useAppSelector(language).lang;
  const router = useRouter();
  const pathname = usePathname();
  const form = {
    inputs: [
      usernameInput(lang),
      passwordInput(lang),
      trustedDeviceInput(lang),
    ],
    action: dictionary.login[lang],
  };

  async function login(data: any) {
    await fetchapi("/user/", "PATCH", (data = data))
      .then((response) => {
        switch (response.code) {
          case "200":
            setGlobalState(newUserState(true));
            setGlobalState(
              newAlert({
                mode: "success",
                message: dictionary.code200[lang],
                time: 3,
              })
            );
            pathname === "/user/auth" ? router.push("/user") : null;
            break;
          case "400":
            setGlobalState(
              newAlert({
                mode: "warning",
                message: dictionary.code400[lang],
                time: 4,
              })
            );
            break;
          case "429":
            setGlobalState(
              newAlert({
                mode: "warning",
                message: dictionary.code429[lang],
                time: 4,
              })
            );
            break;
          case "500":
            setGlobalState(serverErrorAlert(lang));
            break;
          default:
            break;
        }
      })
      .catch((resson) => {
        setGlobalState(connectionErrorAlert(lang));
      });
  }
  return (
    <div className="mx-auto max-w-md px-3">
      <UseFormTemplate form={form} action={login} />
    </div>
  );
};

export default Page;
