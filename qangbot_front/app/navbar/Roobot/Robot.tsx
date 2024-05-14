"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import dictionary from "./dictionary.json";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { bots, newBotInfo, BotInfo } from "@/GlobalStates/Slices/botSlice";

import { useAppSelector, useAppDispatch } from "@/GlobalStates/hooks";
import { isKnown } from "@/GlobalStates/Slices/userSlice";

const Robot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const dispatch = useAppDispatch();

  const lang = useAppSelector(language).lang;
  const botList = useAppSelector(bots);
  const userIsKnown = useAppSelector(isKnown);
  const [error, setError]: [boolean | undefined, Function] =
    useState(undefined);
  async function getBots(): Promise<BotInfo | void> {
    setError(undefined);
    try {
      const response = await fetchapi("/gridbot/", "GET");
      response.code ? setError(false) : null;
      if (response.code == "400") {
        return { bots: [], canCreateBot: undefined ,isLoaded :true };
      }
      const botInfo :BotInfo =response.data
      botInfo.isLoaded =true
      return botInfo;
    } catch (error) {
      setError(true);
    }
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);
  const handleItemClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    error === undefined
      ? getBots().then((response) => {
          response ? dispatch(newBotInfo(response)) : null;
        })
      : null;

    return () => {};
  }, [error]);

  useEffect(() => {
    error !== undefined ? setError(undefined) : null;

    return () => {};
  }, [userIsKnown]);

  const liClassName = "h-12 w-full p-0 flex items-center";

  return error === true ? (
    <button
      className="btn btn-warning btn-xs ms-4 "
      onClick={() => setError(undefined)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16"
        width="16"
        viewBox="0 0 512 512"
      >
        <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z" />
      </svg>
    </button>
  ) : error === undefined ? (
    <span className="loading loading-dots loading-sm ms-5 mt-2"></span>
  ) : (
    <div className="dropdown dropdown-start ">
      <div
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        role="button"
        className=""
      >
        <div className="flex relative text-success hover:bg-transparent btn btn-ghost max-[300px]:ms-3   max-[350px]:ms-5 ms-10  p-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 640 512"
            className="w-10"
          >
            <path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z" />
          </svg>
          {botList.filter((bot) => !bot.status).length > 0 ? (
            <svg
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 absolute end-0 top-1 text-rose-600"
              viewBox="0 0 64 512"
            >
              <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
            </svg>
          ) : null}
        </div>
      </div>

      {isOpen && (
        <ul
          ref={dropdownRef}
          tabIndex={0}
          className="dropdown-content rounded-none z-[2] mt-4 py-1 shadow bg-base-200  w-56"
        >
          {botList?.map((bot) => (
            <li key={bot.id} className={liClassName}>
              <Link
                onClick={handleItemClick}
                className="w-full text-xs relative pt-4 px-4  btn shadow-none rounded-none flex justify-between "
                href={"/gridbot/" + bot.id}
              >
                <div className="absolute top-1.5 left-0 ps-3 text-start text-xs text-primary">
                  {bot.name}
                  {bot.status ? null : (
                    <small className="text-rose-600"> !?</small>
                  )}
                </div>

                <div>{bot.exchangeName}</div>
                {bot.contractName}
              </Link>
            </li>
          ))}
          <li
            key={"TEST"}
            onClick={handleItemClick}
            className="btn p-0 w-full rounded-none shadow-none text-info"
          >
            <Link
              className="w-full h-full pt-4"
              onClick={handleItemClick}
              href={"/gridbot/test"}
            >
              {dictionary["test"][lang]}
            </Link>
          </li>

          <li
            key={"CREATE!"}
            className="btn p-0 w-full rounded-none shadow-none text-success"
          >
            <Link
              className="w-full h-full pt-4 "
              onClick={handleItemClick}
              href={"/gridbot/new"}
            >
              {dictionary["create"][lang]}
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Robot;
