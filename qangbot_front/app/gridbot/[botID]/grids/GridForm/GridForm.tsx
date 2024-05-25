"use client";
import React, { useState } from "react";
import Help from "./Help";
import dictionary from "./dictionary.json";
import VIPRequired from "../../../VIPRequired";
import GridsTable from "../GridsTable";
import { Bot } from "@/app/gridbot/types";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";

const GridForm = (props: {
  grids: Bot["grids"];
  reviewMode: boolean;
  setReviewMode: Function;
  setGrids: Function;
  creationLimit: number | null;
}) => {
  const setGrids = props.setGrids;
  const grids = props.grids;
  const lang = useAppSelector(language).lang;
  const [size, setSize] = useState<number | "">("");
  const [range, setRange] = useState<number | "">("");
  const [startPrice, setStartPrice] = useState<number | "">("");
  const [count, setCount] = useState<number | "">("");
  const [dynamicSize, setDynamicSize] = useState(true);
  const [dynamicRange, setDynamicRange] = useState(true);
  const [requiredMessage, setRequiredMessage] = useState(false);
  const [minusMessage, setMinusMessage] = useState(false);
  const [startPosition, setStartPosition] = useState(1);
  const reviewMode = props.reviewMode;
  const setReviewMode = props.setReviewMode;
  function review() {
    if (!size || !range || !startPrice || !count) {
      setRequiredMessage(true);
      return;
    }
    if (size <= 0 || range <= 0 || startPrice <= 0 || count <= 0) {
      setMinusMessage(true);
      return;
    }
    const grids = [];
    const rangeRate = range / startPrice;
    const sizeRate = size / startPrice;
    let nextBuyPrice = Number(startPrice);
    for (let index = 0; index < count; index++) {
      const gridbuyPrice = dynamicRange
        ? nextBuyPrice
        : Number(startPrice + index * range);
      nextBuyPrice += Number(rangeRate * nextBuyPrice);
      const gridsellPrice = dynamicRange
        ? Number(gridbuyPrice + rangeRate * gridbuyPrice)
        : Number(startPrice + (index + 1) * range);
      grids.push({
        id: index,
        sell: gridsellPrice.toFixed(4),
        buy: gridbuyPrice.toFixed(4),
        status: 1,
        size: dynamicSize
          ? Number((gridbuyPrice * sizeRate).toFixed(4))
          : Number(size).toFixed(4),
        nextPosition: startPosition,
      });
    }
    setGrids(grids);
    setReviewMode(true);
  }
  if (minusMessage) {
    if (+size > 0 && +range > 0 && +startPrice > 0 && +count > 0) {
      setMinusMessage(false);
    }
  }
  if (requiredMessage) {
    if (size && range && startPrice && count) {
      setRequiredMessage(false);
    }
  }

  return reviewMode ? (
    <>
      <GridsTable grids={grids} />
    </>
  ) : props.creationLimit !== null && props.creationLimit < 1 ? (
    <VIPRequired />
  ) : (
    <div className=" flex flex-col gap-3 max-[300px]:w-gap-1 px-3">
      <div className="gap-2 flex">
        <Help props={{ message: dictionary.startPriceHelp[lang] }}>
          <input
            type="number"
            className="input input-sm input-bordered w-full "
            placeholder={dictionary.startPrice[lang]}
            value={startPrice}
            onChange={(event) =>
              setStartPrice(
                event.target.value ? Number(event.target.value) : ""
              )
            }
          />
        </Help>
        <Help props={{ direction: true, message: dictionary.countHelp[lang] }}>
          <input
            value={count}
            onChange={(event) =>
              Number(event.target.value) > 0
                ? setCount(
                    props.creationLimit
                      ? Math.min(
                          Number(event.target.value),
                          Number(props.creationLimit)
                        )
                      : Number(event.target.value)
                  )
                : setCount("")
            }
            type="number"
            placeholder={dictionary.count[lang]}
            className="input-sm w-full input input-bordered "
          />
        </Help>
      </div>
      <div className="flex items-center gap-1">
        <input
          className="input min-[375px]:grow input-sm input-bordered w-1/2 max-[320px]:w-2/5  "
          type="number"
          placeholder={dictionary.gridSize[lang]}
          onChange={(event) =>
            setSize(event.target.value ? Number(event.target.value) : "")
          }
          value={size}
        />
        <div className="flex w-1/2 items-center  justify-start  gap-1 text-xs ms-3">
          {dictionary.constant[lang]}
          <input
            type="checkbox"
            className="toggle toggle-xs bg-primary hover:bg-primary"
            checked={dynamicSize}
            onChange={() => setDynamicSize((prev) => !prev)}
          />
          {dictionary.dynamic[lang]}
          <div
            className={
              "tooltip  tooltip-error " +
              (lang == "en" ? " tooltip-left" : " tooltip-right")
            }
            data-tip={
              dynamicSize
                ? dictionary.dynamicSizeHelp[lang]
                : dictionary.constantSizeHelp[lang]
            }
          >
            <div className=" bg-base-100 text-xs text-rose-500  shadow rounded-full w-6 h-6 pt-1.5">
              ?
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <input
          className="input min-[375px]:grow input-sm input-bordered w-1/2 max-[320px]:w-2/5  "
          type="number"
          placeholder={dictionary.gridRange[lang]}
          onChange={(event) =>
            setRange(event.target.value ? Number(event.target.value) : "")
          }
          value={range}
        />
        <div className="flex w-1/2 items-center  justify-start  gap-1 text-xs ms-3">
          {dictionary.constant[lang]}
          <input
            type="checkbox"
            className="toggle  toggle-xs bg-primary hover:bg-primary"
            checked={dynamicRange}
            onChange={() => setDynamicRange((prev) => !prev)}
          />
          {dictionary.dynamic[lang]}
          <div
            className={
              "tooltip   tooltip-error " +
              (lang == "en" ? " tooltip-left" : " tooltip-right")
            }
            data-tip={
              dynamicRange
                ? dictionary.dynamicRangeHelp[lang]
                : dictionary.constantRangeHelp[lang]
            }
          >
            <div className=" bg-base-100 text-xs text-rose-500  shadow rounded-full w-6 h-6 pt-1.5">
              ?
            </div>
          </div>
        </div>
      </div>
      <select
        value={startPosition}
        onChange={(event) => setStartPosition(Number(event.target.value))}
        className="select select-sm select-bordered"
      >
        <option value="1">{dictionary.sellPosition[lang]}</option>
        <option value="2">{dictionary.buyPosition[lang]}</option>
      </select>
      <div className="px-4 text-rose-400">
        {requiredMessage && dictionary.required[lang]}
        {minusMessage && dictionary.minus[lang]}
      </div>

      <button
        onClick={review}
        className="btn max-w-sm mx-auto btn-primary block w-full "
      >
        {dictionary.review[lang]}
      </button>
    </div>
  );
};

export default GridForm;
