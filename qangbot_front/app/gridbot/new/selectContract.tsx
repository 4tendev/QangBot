"use client";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import React, { useEffect, useState } from "react";
import dictionary from "./dictionary.json";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import Link from "next/link";

type Contract = {
  name: string;
  id: number;
  url: string;
};
type ContractState = Contract | undefined;
const SelectContract = (props: {
  exchangeName: string;
  setContractID: Function;
}) => {
  const [fetching, setFetching] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contract, setContract]: [ContractState, Function] =
    useState<ContractState>(undefined);
  const lang = useAppSelector(language).lang;
  async function getContracts() {
    fetching
      ? await fetchapi(`/gridbot/${props.exchangeName}/contract/`, "GET").then(
          (response) => {
            if (response.code !== "200") {
              throw new Error("Server Error");
            } else {
              setContracts(response.data.contracts);
            }
          }
        )
      : null;
    setFetching(false);
  }
  useEffect(() => {
    getContracts();
    return () => {};
  }, [fetching]);

  return (
    <>
      <select
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          if (event.target.value) {
            const contract: Contract = contracts.filter(
              (contract: Contract) => contract.name === event.target.value
            )[0];
            setContract(contract);
            props.setContractID(contract.id); // or event.target.value as null
          } else {
            setContract(undefined);
            props.setContractID(0);
          }
        }}
        value={contract !== undefined ? contract.name : ""}
        className={
          "select select-bordered w-full max-w-md " +
          (!contract ? " select-warning " : " ")
        }
      >
        <option value={""} className="my-1 border-2">
          {dictionary["selectContract"][lang]}
        </option>
        {contracts?.map((contract: Contract) => (
          <option
            className="my-5 border-2"
            key={contract.name}
            value={contract.name}
          >
            {contract.name}
          </option>
        ))}
      </select>
      {contract ? (
        <Link
          href={contract.url}
          target="blank"
          className="link text-start w-full max-w-md px-2 link-info"
        >
          {dictionary.contractInfo[lang]}
        </Link>
      ) : null}
    </>
  );
};

export default SelectContract;
