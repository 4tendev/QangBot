"use client";
import React, { useState } from "react";
import dictionary from "./dictionary.json";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { getBot } from "@/GlobalStates/Slices/botSlice";
import { Bot } from "../../types";
import CoveredRange from "./CoveredRange";
import TotalGrids from "@/app/gridbot/[botID]/grids/TotalGrids";

type GridsTableProps =
  | { botID: number; grids?: never  }
  | { botID?: never; grids: Bot["grids"] };

const GridsTable = (props: GridsTableProps) => {
  const botID = props.botID;
  const gridbot = useAppSelector((state) => getBot(state, props.botID))

  const grids = props?.grids ?? (gridbot?.grids as Bot["grids"]);
  const thClassName = "max-[360px]:p-1.5 text-center";
  const tdClassName = "max-[320px]: p-1 text-center";
  const lang = useAppSelector(language).lang;
  const [acting, setActing] = useState(false);

  const [sort, setSort] = useState<[boolean, "status" | "buy" | "size"]>([
    false,
    "status",
  ]);
  const copiedGrids = [...grids];
  const sortedGrids = copiedGrids.sort(function (a: any, b: any) {
    return sort[0] ? a[sort[1]] - b[sort[1]] : b[sort[1]] - a[sort[1]];
  });

  return (
    <>
      <ul className="ps-10 flex py-2 flex-col gap-1 text-sm">
        <li>
          <TotalGrids botID={botID} grids={grids} />
        </li>

        <li>
          <CoveredRange grids={grids} />
        </li>
      </ul>
      <div className="overflow-x-auto  max-h-96">
        <table className="table ">
          <thead>
            <tr>
              <th
                className={thClassName}
                onClick={() => setSort((prev) => [!prev[0], "buy"])}
              >
                {dictionary.priceRange[lang]}
              </th>
              <th
                className={thClassName}
                onClick={() => setSort((prev) => [!prev[0], "size"])}
              >
                {dictionary.size[lang]}
              </th>
              {botID && (
                <>
                  <th
                    className={thClassName}
                    onClick={() => setSort((prev) => [!prev[0], "status"])}
                  >
                    {dictionary.status[lang]}
                  </th>

                  <th
                    className={thClassName}
                    onClick={() => setSort((prev) => [!prev[0], "status"])}
                  >
                    {dictionary.actions[lang]}
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedGrids.map((grid) => (
              <tr key={grid.id}>
                <td className={tdClassName}>
                  <div className=" text-success ">{grid.buy}</div>
                  <div className="text-rose-600">{grid.sell}</div>
                </td>

                <td className={tdClassName}>{grid.size}</td>
                {botID && (
                  <>
                    <td className={tdClassName}>
                      {grid.status !== 3 ? (
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

                    <td className={tdClassName}>
                      {acting ? (
                        <span className="loading loading-ring loading-xs"></span>
                      ) : grid.status === 3 ? (
                        <div className="w-fit flex flex-col gap-1 mx-auto">
                          <button className=" btn btn-success btn-xs w-fit">
                            {dictionary.startBuy[lang]}
                          </button>
                          <button className=" btn btn-xs  bg-rose-600 w-fit">
                            {dictionary.startSell[lang]}
                          </button>
                          <button className=" btn btn-xs btn-warning w-full">
                            {dictionary.delete[lang]}
                          </button>
                        </div>
                      ) : (
                        <button className=" btn btn-xs btn-warning w-full">
                          {dictionary.pause[lang]}
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GridsTable;
