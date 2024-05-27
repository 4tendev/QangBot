"use client";
import React, { useState } from "react";
import dictionary from "./dictionary.json";
import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { bots, updateBot } from "@/GlobalStates/Slices/botSlice";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { newAlert, serverErrorAlert } from "@/GlobalStates/Slices/alert/Slice";

const Info = ({ params }: { params: { botID: number } }) => {
  const botID = params.botID;
  const gridbot = useAppSelector(bots).filter((bot) => bot.id == botID)[0];
  const [acting, setActing] = useState<boolean>(false);
  const lang = useAppSelector(language).lang;
  const dispatch = useAppDispatch();
  async function actions(action: "stop" | "resume") {
    setActing(true);
    await fetchapi(`/gridbot/${botID}/`, "OPTIONS", { action: action }).then(
      (response) => {
        if (response.code == "200") {
          dispatch(updateBot(response.data));
          dispatch(
            newAlert({
              mode: "success",
              message:
                action === "stop"
                  ? dictionary.botStopped[lang]
                  : dictionary.botResumed[lang],
              time: 4,
            })
          );
        } else {
          dispatch(serverErrorAlert(lang));
        }
      }
    );
    setActing(false);
  }

  const thClassName = "text-center";
  return gridbot ? (
    <>
      <div className="text-2xl text-info ps-3 mt-1 text-start w-full">
        {dictionary.title[lang]}
      </div>
      <div className="overflow-x-auto  w-full mb-2">
        <table className="table text-center">
          <thead>
            <tr>
              <th className={thClassName}>{dictionary.botName[lang]}</th>
              <th className={thClassName}>{dictionary.accountName[lang]}</th>
              <th className={thClassName}>{dictionary.exchange[lang]}</th>
              <th className={thClassName}>{dictionary.lastheck[lang]}</th>
              <th className={thClassName}>{dictionary.interval[lang]}</th>
              <th className={thClassName}>{dictionary.status[lang]}</th>
              <th className={thClassName}>{dictionary.action[lang]}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b-0">
              <td className="font-bold text-center">{gridbot.name}</td>
              <td className="font-bold text-center">{gridbot.accountName}</td>

              <td className="flex flex-col justify-center items-center h-full">
                <div className="font-bold">{gridbot.exchangeName}</div>
                <div className="text-xs opacity-60">
                  {gridbot.contract.name}
                </div>
              </td>
              <td className="text-center">
                {gridbot.lastheck} {dictionary.seconds[lang]}
              </td>

              <td className="text-center">
                {gridbot.interval} {dictionary.seconds[lang]}
              </td>

              <td className="text-center">
                {gridbot.status === undefined ? (
                  <span className="loading loading-dots loading-xs"></span>
                ) : gridbot.status === true ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3  mx-auto text-success"
                    fill="currentColor"
                    viewBox="0 0 384 512"
                  >
                    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 text-warning mx-auto"
                    fill="currentColor"
                    viewBox="0 0 320 512"
                  >
                    <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
                  </svg>
                )}
              </td>

              <td className="text-center">
                {gridbot.status === undefined ? (
                  <span className="loading loading-dots loading-xs"></span>
                ) : gridbot.status === true ? (
                  <button
                    disabled={acting}
                    onClick={() => actions("stop")}
                    className="btn btn-sm btn-warning"
                  >
                    {dictionary.stop[lang]}
                  </button>
                ) : (
                  <button
                    disabled={acting}
                    onClick={() => actions("resume")}
                    className="btn btn-sm btn-primary"
                  >
                    {dictionary.resume[lang]}
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  ) : null;
};

export default Info;
