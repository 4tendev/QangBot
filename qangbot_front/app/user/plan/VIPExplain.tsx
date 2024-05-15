import React, { useEffect, useState } from "react";
import dictionary from "./dictionary.json";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";

const VIPExplain = () => {
  const lang = useAppSelector(language).lang;
  const [vipPrice, setVIPPrice]: [undefined | false | number, Function] =
    useState(undefined);

  function checkPrice() {
    setVIPPrice(undefined);
    fetchapi("/user/vip/", "GET")
      .then((response) => {
        setVIPPrice(response.data.price);
      })
      .catch((error) => {
        setVIPPrice(false);
      });
  }

  useEffect(() => {
    checkPrice();

    return () => {};
  }, []);

  return (
    <>
      <h2 className="text-primary text-3xl  font-bold my-2">
        {dictionary.vip[lang]}
      </h2>
      <div className="text-start text-accent ps-2">
        {vipPrice === undefined ? (
          <span className="loading loading-bars loading-xs mx-1"></span>
        ) : vipPrice === false ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-8 mx-1 my-auto btn btn-xs btn-warning"
            onClick={checkPrice}
          >
            <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
          </svg>
        ) : (
          vipPrice
        )}
        <small>{dictionary.price[lang]}</small>
        <small className="text-xs block ">{dictionary.payment[lang]}</small>
      </div>
      <ul className="flex flex-wrap justify-between py-2 text-start gap-2 w-full">
        <li className="grow bg-base-300 p-2 text-sm">
          {dictionary.InfiniteBot[lang]}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 text-success inline-block mx-2 rounded-full p-1 border border-accent"
            fill="currentColor"
            viewBox="0 0 448 512"
          >
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
          </svg>
        </li>
        <li className="grow bg-base-300 p-2 text-sm">
          {dictionary.InfiniteGrid[lang]}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 text-success inline-block mx-2 rounded-full p-1 border border-accent"
            fill="currentColor"
            viewBox="0 0 448 512"
          >
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
          </svg>
        </li>
        <li className="grow bg-base-300 p-2 text-sm">
          {dictionary.interval[lang]}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 text-success inline-block mx-2 rounded-full p-1 border border-accent"
            fill="currentColor"
            viewBox="0 0 448 512"
          >
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
          </svg>
        </li>
      </ul>
    </>
  );
};

export default VIPExplain;
