"use client";
import { newUserState, totpActivated } from "@/GlobalStates/Slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import UseFormTemplate from "@/app/UseForm/UseFormTemplate";
import React, { useEffect } from "react";
import dictionary from "./dictionary.json";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { authenticator } from "otplib";
import QRCode from "react-qr-code";
import { emailCodeInput } from "../../auth/inputs/inputs";
import { Form } from "@/app/UseForm/UseFormTemplate";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { newAlert, serverErrorAlert } from "@/GlobalStates/Slices/alert/Slice";
import { useRouter } from "next/navigation";
import responseMessage from "@/app/commonTs/responseMessageFinder";
const Page = () => {
  const generatedSecretKey = authenticator.generateSecret();
  const router = useRouter();
  const isTOTPActivated = useAppSelector(totpActivated);
  const lang = useAppSelector(language).lang;
  const dispatch = useAppDispatch();
  const inputs: Form["inputs"] = [
    {
      type: "number",
      name: "TOTPCode",
      validations: { required: true, maxLength: 6, minLength: 6 },
      validationsMSG: {
        required: dictionary["required"][lang],
        maxLength: dictionary["sixDigit"][lang],
        minLength: dictionary["sixDigit"][lang],
      },
      autoComplete: "off",
      placeHolder: dictionary["scannedTOTP"][lang],
    },
  ];

  isTOTPActivated &&
    inputs.push({
      type: "number",
      name: "currentTOTPCode",
      validations: { required: true, maxLength: 6, minLength: 6 },
      validationsMSG: {
        required: dictionary["required"][lang],
        maxLength: dictionary["sixDigit"][lang],
        minLength: dictionary["sixDigit"][lang],
      },
      autoComplete: "off",
      placeHolder: dictionary["currentTOTP"][lang],
    });
  inputs.push(emailCodeInput(lang));

  const form: Form = {
    inputs,
    action: dictionary["update"][lang],
  };

  async function askEmailCode() {
    await fetchapi("/user/totp/", "GET")
      .then((response) => {
        response.code == "200"
          ? dispatch(
              newAlert({ message: dictionary.emailCodeSent[lang], mode: "success", time: 5 })
            )
          : dispatch(serverErrorAlert(lang));
      })
      .catch((error) => dispatch(serverErrorAlert(lang)));
  }
  askEmailCode;

  useEffect(() => {
    askEmailCode();
    return () => {};
  }, []);

  async function update(data: any) {
    const requiredData = { ...data };
    requiredData.TOTPKey = generatedSecretKey;
    fetchapi("/user/totp/", "POST", requiredData).then((response) => {
      const code = response.code;
      if (code == "200") {
        dispatch(
          newAlert({ message: dictionary.totpUpdated[lang], mode: "success", time: 5 })
        );
        dispatch(newUserState(response.data));
        router.push("/user");
      } else {
        dispatch(
          newAlert({
            message: responseMessage(dictionary, lang, code),
            mode: "warning",
            time: 5,
          })
        );
      }
    });
  }
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedSecretKey);
  };
  return (
    <div className="h-full flex flex-col w-full">
      <div className="text-center px-2">
        {dictionary.scan[lang]} <br />
        {dictionary.touch[lang]}
        <small
          onClick={copyToClipboard}
          className="link text-xl mx-1 text-primary"
        >
          {dictionary.here[lang]}
        </small>{" "}
        {dictionary.copy[lang]}
        <div className="p-3 m-1 w-56 mx-auto bg-white ">
          <QRCode
            size={200}
            value={`otpauth://totp/QANG?secret=${generatedSecretKey}`}
          />
        </div>
      </div>
      <div className="grow sm:grow-0 sm:h-fit sm:max-w-md mx-auto w-full">
        <UseFormTemplate action={update} form={form} />
      </div>
    </div>
  );
};
export default Page;
