"use client";
import React, { useState } from "react";

import dictionary from "./dictionary.json";
import { useAppSelector, useAppDispatch } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import SelectAccount from "./selectAccount";
import SelectContract from "./selectContract";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { addBot } from "@/GlobalStates/Slices/botSlice";
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
        dispatch(addBot(response.data.gridbot));
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
    <div className="flex flex-col gap-3 py-3 items-center px-5 max-w-md mx-auto">
      <select
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          setExchangeName(event.target.value as string);
          event.target.value
            ? setExchangeID(
                exchanges.filter(
                  (exchange: Exchange) => exchange.name === event.target.value
                )[0].id
              )
            : setExchangeID(0);
        }}
        className="select select-bordered w-full  px-4 mx-3"
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
                  (botName ? " " : " input-error")
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
          disabled={
            exchangeName && contractID && accountID && botName ? false : true
          }
          onClick={createBot}
          className="btn btn-success w-full "
        >
          {dictionary.createBot[lang]}
        </button>
      </>
    </div>
  );
};

export default Page;
