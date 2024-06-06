"use client";
import React, { useState } from "react";

import dictionary from "./dictionary.json";
import { useAppSelector, useAppDispatch } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import SelectAccount from "./selectAccount";
import SelectContract from "./selectContract";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { updateBot } from "@/GlobalStates/Slices/botSlice";
import { newAlert } from "@/GlobalStates/Slices/alert/Slice";
import { useRouter } from "next/navigation";

type Exchange = {
  id: number;
  name: string;
  accountRequirement: string[];
};

const Page = (props: { exchanges: Exchange[] }) => {
  const [exchangeName, setExchangeName] = useState("");
  const [accountID, setAccountID] = useState(0);
  const [contractID, setContractID] = useState(0);
  const [exchangeID, setExchangeID] = useState(0);
  const [botName, setBotName] = useState("");
  const lang = useAppSelector(language).lang;
  const exchanges = props.exchanges;
  const dispatch = useAppDispatch();
  const router = useRouter();
  function resetDefault() {
    setBotName("");
    setContractID(0);
    setAccountID(0);
    setExchangeID(0);
  }

  async function createBot() {
    await fetchapi("/gridbot/", "POST", {
      name: botName,
      contractID: contractID,
      accountID: accountID,
      exchangeID: exchangeID,
    }).then((response) => {
      if (response.code === "200") {
        dispatch(
          newAlert({
            message: dictionary.successCreateBot[lang],
            mode: "success",
            time: 3,
          })
        );
        dispatch(updateBot(response.data.gridbot));
        router.push(`/gridbot/${response.data.gridbot.id}`);
      } else {
        dispatch(
          newAlert({
            message: dictionary.authProblem[lang],
            mode: "warning",
            time: 3,
          })
        );
      }
    });
  }
  return (
    <div className="flex flex-col md:flex-row py-2 gap-2">
      <div className="w-full max-w-md text-start mx-auto px-5">
        <h3 className="text-info text-2xl text-start">
          {dictionary.notice[lang]}
        </h3>
        <p className="ps-1 py-1">{dictionary.avoidTrade[lang]}</p>
      </div>

      <div className="flex w-full flex-col gap-3 items-center px-5 max-w-md mx-auto">
        <select
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setExchangeName(event.target.value as string);
            event.target.value
              ? setExchangeID(
                  exchanges.filter(
                    (exchange: Exchange) => exchange.name === event.target.value
                  )[0].id
                )
              : resetDefault();
          }}
          className={
            "select select-bordered w-full  px-4 mx-3" +
            (!exchangeName ? " select-warning" : " ")
          }
        >
          <option value={""} className="my-1 border-2">
            {dictionary["pickExchange"][lang]}
          </option>
          {exchanges?.map((exchange) => (
            <option
              className="my-5 border-2"
              key={exchange.name}
              value={exchange.name}
            >
              {exchange.name}
            </option>
          ))}
        </select>
        {exchangeName ? (
          <>
            <SelectAccount
              exchangeName={exchangeName}
              setAccountID={setAccountID}
            />
            {accountID > 0 ? (
              <>
                <input
                  type="text"
                  value={botName}
                  onChange={(event) =>
                    event.target.value.length < 20
                      ? setBotName(event.target.value)
                      : null
                  }
                  autoFocus
                  className={
                    "input input-bordered w-full max-w-md " +
                    (botName ? " " : " input-warning ")
                  }
                  placeholder={dictionary.botreminder[lang]}
                />
                <SelectContract
                  exchangeName={exchangeName}
                  setContractID={setContractID}
                />
              </>
            ) : null}
          </>
        ) : null}
        <>
          <button

            onClick={createBot}
            className={
              "btn btn-success w-full " +
              (exchangeName && contractID && accountID && botName
                ? " "
                : " hidden")
            }
          >
            {dictionary.createBot[lang]}
          </button>
        </>
      </div>
    </div>
  );
};

export default Page;
