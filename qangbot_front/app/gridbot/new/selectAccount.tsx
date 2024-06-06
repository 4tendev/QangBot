"use client";
import Loading from "@/app/loading";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import React, { useEffect, useState } from "react";
import dictionary from "./dictionary.json";
import { useAppSelector, useAppDispatch } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import UseFormTemplate, { Form, Input } from "@/app/UseForm/UseFormTemplate";
import { newAlert } from "@/GlobalStates/Slices/alert/Slice";
type Account = {
  id: number;
  name: string;
};
const SelectAccount = (props: {
  exchangeName: string;
  setAccountID: Function;
}) => {
  const [fetching, setFetching] = useState(true);
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);
  const [account, setAccount] = useState("");
  const lang = useAppSelector(language).lang;
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<Form>({
    inputs: [],
    action: dictionary.checkValididity[lang],
  });
  async function getAccounts() {
    setFetching(true);
    await fetchapi(`/gridbot/${props.exchangeName}/account/`, "GET").then(
      (response) => {
        if (response.code !== "200") {
          throw new Error("Server Error");
        } else {
          setUserAccounts(response.data.accounts);
          const defaultInputs = [
            {
              type: "text",
              name: "name",
              placeHolder: dictionary["accountreminder"][lang],
              validations: { required: true, maxLength: 20 },
              validationsMSG: {
                required: dictionary["required"][lang],
                maxLength: dictionary["maxLength20"][lang],
              },
            },
          ];
          const inputs: Input[] = [
            ...defaultInputs,
            ...response.data.accountFields.map((field: string): Input => {
              return {
                type: "password",
                placeHolder: field,
                autoComplete: "off",
                name: field,
                validations: { required: true },
                validationsMSG: {
                  required: dictionary["required"][lang],
                },
              };
            }),
          ];
          setForm({
            inputs: inputs,
            action: dictionary.checkValididity[lang],
          });
        }
      }
    );
    setFetching(false);
  }

  useEffect(() => {
    getAccounts();

    return () => {};
  }, []);

  async function createAccount(accountFields: object) {
    await fetchapi(
      `/gridbot/${props.exchangeName}/account/`,
      "POST",
      accountFields
    ).then((response) => {
      if (response.code === "200") {
        dispatch(newAlert({ message: "OK", mode: "success", time: 3 }));
        const newAccount = { id: response.data.id, name: response.data.name };
        setAccount(newAccount.name);
        setUserAccounts((accounts) => [...accounts, newAccount]);
        props.setAccountID(newAccount.id);
      } else if (response.code === "4001") {
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

  return fetching ? (
    <Loading />
  ) : (
    <div className="max-w-md w-full">
      <select
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          setAccount(event.target.value);
          event.target.value
            ? props.setAccountID(
                userAccounts.filter(
                  (account: Account) => account.name === event.target.value
                )[0].id
              )
            : props.setAccountID(0);
        }}
        value={account}
        className={
          "select select-bordered w-full " + (!account ? "select-warning" : " ")
        }
      >
        <option value={""} className="my-1 border-2">
          {dictionary["createAccount"][lang]}
        </option>
        {userAccounts?.map((account: Account) => (
          <option
            className="my-5 border-2"
            key={account.name}
            value={account.name}
          >
            {account.name}
          </option>
        ))}
      </select>
      {account ? null : (
        <div className=" mt-2 sm:px-5">
          <UseFormTemplate form={form} action={createAccount} />
        </div>
      )}
    </div>
  );
};

export default SelectAccount;
