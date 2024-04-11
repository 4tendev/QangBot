"use client";

import UseFormTemplate from "@/app/UseForm/UseFormTemplate";
import responseMessageFinder from "@/app/commonTs/responseMessageFinder";
import {
  passwordInput,
  usernameInput,
  trustedDeviceInput,
} from "../inputs/inputs";

import dictionary from "./dictionary.json";

import { useRouter, usePathname } from "next/navigation";

import { fetchapi } from "@/commonTsBrowser/fetchAPI";

import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import { newUserState } from "@/GlobalStates/Slices/userSlice";
import {
  newAlert,
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
        const code = response.code;
        const mode = code === 200 ? "success" : "warning";
        setGlobalState(
          newAlert({
            message: responseMessageFinder(dictionary, code, lang),
            mode: mode,
            time: 4,
          })
        );
        if (code === "200") {
          setGlobalState(newUserState(true));
          pathname.substring(0, 11) === "/user/auth"
            ? router.push("/user")
            : null;
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
