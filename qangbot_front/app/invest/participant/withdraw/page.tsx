"use client";
import UseFormTemplate from "@/app/UseForm/UseFormTemplate";
import React, { useEffect, useState } from "react";
import type { Form } from "@/app/UseForm/UseFormTemplate";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { totpCodeInput } from "@/app/user/auth/inputs/inputs";
import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { newAlert, serverErrorAlert } from "@/GlobalStates/Slices/alert/Slice";
import responseMessageFinder from "@/app/commonTs/responseMessageFinder";
import dictionary from "./dictionary.json";
type Withdraw = {
  id: number;
  status: boolean | null;
  BTCAddress: string;
};
const Page = () => {
  const lang = useAppSelector(language).lang;
  const [withdraws, setWithdraws] = useState<Withdraw[] | undefined | false>(
    undefined
  );
  const dispatch = useAppDispatch();

  async function getWithdraws() {
    setWithdraws(undefined);
    await fetchapi("/strategy/participant/withdraw/", "GET").then(
      (response) => {
        if (response.code == "200") {
          setWithdraws(response.data);
        } else {
          setWithdraws(false);
          dispatch(serverErrorAlert(lang));
        }
      }
    );
  }
  useEffect(() => {
    getWithdraws();

    return () => {};
  }, []);

  const form: Form = {
    inputs: [
      {
        type: "text",
        placeHolder: dictionary.btcAddress[lang],
        autoComplete: "off",
        validations: { required: true },
        validationsMSG: { required: "required" },
        name: "BTCAddress",
      },
      totpCodeInput(lang),
    ],
    action: dictionary.submit[lang],
  };
  async function submit(data: any) {
    await fetchapi("/strategy/participant/withdraw/", "POST", data).then(
      (response) => {
        const code = response.code;
        if (code == 200) {
          setWithdraws((prev) => {
            return prev ? [...prev, response.data] : [response.data];
          });
          dispatch(
            newAlert({
              message: responseMessageFinder(dictionary, lang, code),
              mode: "success",
              time: 4,
            })
          );
        } else {
          dispatch(
            newAlert({
              message: responseMessageFinder(dictionary, lang, code),
              mode: "warning",
              time: 4,
            })
          );
        }
      }
    );
  }
  return (
    <div className="mx-auto max-w-lg  flex-col flex gap-3 py-3 px-5">
      <div>
        {withdraws && withdraws.length > 0 && (
          <div className=" flex flex-col gap-3">
            {dictionary.laswWithdraws[lang]}
            {withdraws.map((withdraw: Withdraw) => (
              <div
                key={withdraw.id}
                className="border  flex justify-between p-3 rounded-xl"
              >
                <div>{withdraw.BTCAddress.substring(0, 10)}</div>

                <div>
                  {withdraw.status == true ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 text-success"
                      viewBox="0 0 448 512"
                      fill="currentColor"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  ) : withdraw.status == false ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 text-error"
                      viewBox="0 0 448 512"
                      fill="currentColor"
                    >
                      <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                    </svg>
                  ) : (
                    <span className="loading loading-ring loading-xs"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {withdraws == false && (
          <svg
            onClick={getWithdraws}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-5 text-warning my-2"
            viewBox="0 0 512 512"
          >
            <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z" />
          </svg>
        )}
      </div>
      <h3 className="text-info text-xl font-bold">
        {dictionary.withdraw[lang]}
      </h3>
      <p className="ps-2">{dictionary.withdrawal[lang]}</p>
      <UseFormTemplate form={form} action={submit} />
    </div>
  );
};

export default Page;
