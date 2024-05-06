"use client";
import UseFormTemplate from "@/app/UseForm/UseFormTemplate";
import React from "react";
import {
  passwordInput,
  newPasswordInput,
  repeatPasswordInput,
} from "../auth/inputs/inputs";
import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import responseMessageFinder from "@/app/commonTs/responseMessageFinder";
import dictionary from "./dictionary.json";
import { language } from "@/GlobalStates/Slices/languageSlice";

import { newAlert } from "@/GlobalStates/Slices/alert/Slice";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { isKnown } from "@/GlobalStates/Slices/userSlice";
import Auth from "../auth/page";
const Page = () => {
  const userisKnown = useAppSelector(isKnown);
  const lang = useAppSelector(language).lang;
  const setGlobalState = useAppDispatch();
  const changePasswordForm = {
    inputs: [
      passwordInput(lang),
      newPasswordInput(lang),
      repeatPasswordInput(lang),
    ],
    action: "change",
  };

  async function changePassword(data: {
    password: string;
    repeatPassword: string;
    newPassword: string;
  }) {
    if (data.newPassword !== data.repeatPassword) {
      setGlobalState(
        newAlert({
          message: dictionary.notSamePassword[lang],
          mode: "warning",
          time: 4,
        })
      );
      return;
    }
    await fetchapi("/user/", "PUT", data).then((response) => {
      const code = response.code;
      const mode = code.substring(0, 1) === "2" ? "success" : "warning";

      setGlobalState(
        newAlert({
          message: responseMessageFinder(dictionary, lang, code),
          mode: mode,
          time: 4,
        })
      );
    });
  }

  return userisKnown === true ? (
    <div className="max-w-lg mx-auto">
      Change Password
      <UseFormTemplate form={changePasswordForm} action={changePassword} />
    </div>
  ) : (
    <Auth />
  );
};

export default Page;
