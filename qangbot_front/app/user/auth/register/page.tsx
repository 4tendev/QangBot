"use client";

import UseFormTemplate from "@/app/UseForm/UseFormTemplate";
import {
  passwordInput,
  trustedDeviceInput,
  emailInput,
  repeatPasswordInput,
} from "../inputs/inputs";
import responseMessageFinder from "@/app/commonTs/responseMessageFinder";

import dictionary from "./dictionary.json";

import { fetchapi } from "@/commonTsBrowser/fetchAPI";

import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import { newUserState } from "@/GlobalStates/Slices/userSlice";
import {
  newAlert,
  connectionErrorAlert,
} from "@/GlobalStates/Slices/alert/Slice";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { useState } from "react";

import EmailVerificationModal from "@/app/user/EmailVerification/EmailVerificationModal";
import Alert from "@/app/components/Alert/Alert";

const Page = () => {
  const setGlobalState = useAppDispatch();
  const lang = useAppSelector(language).lang;
  const router = useRouter();
  const pathname = usePathname();
  const [emailVerification, setEmailVerification]: [
    JSX.Element | undefined,
    Function
  ] = useState(undefined);
  const form = {
    inputs: [
      emailInput(lang),
      passwordInput(lang),
      repeatPasswordInput(lang),
      trustedDeviceInput(lang),
    ],
    action: dictionary.register[lang],
  };

  async function register(data: any) {
    if (data.password !== data.repeatPassword) {
      setGlobalState(
        newAlert({
          mode: "warning",
          message: dictionary.notMatchPassword[lang],
          time: 4,
        })
      );
      return;
    }
    return await fetchapi("/user/", "POST", (data = data))
      .then((response) => {
        const code = response.code;
        const mode = code.substring(0, 1) === "2" ? "success" : "warning";
        if (code === "201") {
          setEmailVerification(
            <EmailVerificationModal
              key={Math.random()}
              action={register}
              data={data}
              timeRemaining={response.data.timeRemaining}
              lang={lang}
            />
          );
          return;
        }
        if (code === "200") {
          pathname.substring(0, 11) === "/user/auth"
            ? router.push("/user")
            : null;
          setGlobalState(newUserState(response.data));
        }

        if (code === "4004") {
          return (
            <Alert
              alert={{
                message: responseMessageFinder(dictionary, lang, code),
                mode: "warning",
              }}
            />
          );
        }

        if (code === "4003") {
          setEmailVerification(undefined);
        }
        setGlobalState(
          newAlert({
            message: responseMessageFinder(dictionary, lang, code),
            mode: mode,
            time: 4,
          })
        );
      })
      .catch((resson) => {
        setGlobalState(connectionErrorAlert(lang));
      });
  }
  return (
    <div className="mx-auto max-w-md px-3">
      <UseFormTemplate form={form} action={register} />
      {emailVerification ? emailVerification : null}
    </div>
  );
};

export default Page;
