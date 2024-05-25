import React, { useState } from "react";
import { Grid } from "@/app/gridbot/types";
import dictionary from "./dictionary.json";
import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { serverErrorAlert } from "@/GlobalStates/Slices/alert/Slice";
import { deleteGrid, getBot, updateGrid } from "@/GlobalStates/Slices/botSlice";

const Actions = (props: { botID: number; grid: Grid }) => {
  const [acting, setActing] = useState(false);
  const lang = useAppSelector(language).lang;
  const dispatch = useAppDispatch();
  const gridbot = useAppSelector((state) => getBot(state, props.botID));

  async function act(action: "pause" | "resumeSell" | "resumeBuy") {
    setActing(true);
    await fetchapi(`/gridbot/grid/${props.grid.id}/`, "OPTIONS", {
      action: action,
    }).then((response) => {
      if (response.code === "200") {
        dispatch(updateGrid({ botID: props.botID, grid: response.data }));
      } else dispatch(serverErrorAlert(lang));
    });
    setActing(false);
  }
  async function remove() {
    setActing(true);
    await fetchapi(`/gridbot/grid/${props.grid.id}/`, "DELETE").then(
      (response) => {
        if (response.code === "200") {
          dispatch(deleteGrid({ botID: props.botID, gridID: props.grid.id }));
        } else dispatch(serverErrorAlert(lang));
      }
    );
    setActing(false);
  }

  return acting ? (
    <span className="loading loading-ring loading-xs"></span>
  ) : props.grid.status === 3 ? (
    <div className="w-fit flex flex-col gap-1 mx-auto">
      <button
        onClick={() => act("resumeBuy")}
        className=" btn btn-success btn-xs w-fit"
      >
        {dictionary.startBuy[lang]}
      </button>
      <button
        onClick={() => act("resumeSell")}
        className=" btn btn-xs  bg-rose-600 w-fit"
      >
        {dictionary.startSell[lang]}
      </button>
      <button onClick={remove} className=" btn btn-xs btn-warning w-full">
        {dictionary.delete[lang]}
      </button>
    </div>
  ) : (
    <button
      onClick={() => act("pause")}
      className=" btn btn-xs btn-warning w-full"
    >
      {dictionary.pause[lang]}
    </button>
  );
};

export default Actions;
