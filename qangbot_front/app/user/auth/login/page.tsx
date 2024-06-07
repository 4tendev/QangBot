"use client";

import UseFormTemplate from "@/app/UseForm/UseFormTemplate";
import responseMessageFinder from "@/app/commonTs/responseMessageFinder";
import {
  passwordInput,
  emailInput,
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
import { useState } from "react";
import EmailVerificationModal from "@/app/user/EmailVerification/EmailVerificationModal";
import TOTPlVerificationModal from "@/app/totpVerification/TOTPVerificationModal"
import Alert from "@/app/components/Alert/Alert";

const Page = () => {
  const [modalVerification, setModalVerification]: [
    JSX.Element | undefined,
    Function
  ] = useState(undefined);

  const setGlobalState = useAppDispatch();
  const lang = useAppSelector(language).lang;
  const router = useRouter();
  const pathname = usePathname();
  const form = {
    inputs: [
      emailInput(lang),
      passwordInput(lang),
      trustedDeviceInput(lang),
    ],
    action: dictionary.login[lang],
  };

  async function login(data: any) {
   return await fetchapi("/user/", "PATCH", (data = data))
      .then((response) => {
        const code = response.code;
        const mode = code === "200" ? "success" : "warning";
        switch (code) {
          case "200":
            setModalVerification(undefined);
            setGlobalState(newUserState(response.data))
            pathname.substring(0, 11) === "/user/auth"
              ? router.push("/user")
              : null;
            break;
          case "400":
              setModalVerification(undefined);
              break;
          case "4007" :
            return (
              <Alert
                alert={{
                  message: responseMessageFinder(dictionary, lang, code),
                  mode: "warning",
                }}
              />
            );
          case "4006" :
            setModalVerification(
              <TOTPlVerificationModal
                key={Math.random()}
                action={login}
                data={data}
                lang={lang}
              />
            );
            return;            
          case "429":
            setModalVerification(
              <EmailVerificationModal
                key={Math.random()}
                action={login}
                data={data}
                timeRemaining={response.data.timeRemaining}
                lang={lang}
              />
            );
            return;
          case "4291":
            return (
              <Alert
                alert={{
                  message: responseMessageFinder(dictionary, lang, code),
                  mode: "warning",
                }}
              />
            );
          case "4290":
            setModalVerification(undefined);
            break;
          default:
            break;
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
      <UseFormTemplate form={form} action={login} />
      {modalVerification ? modalVerification : null}
    </div>
  );
};

export default Page;
