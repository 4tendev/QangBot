import { newAlert } from "@/GlobalStates/Slices/alert/Slice";
import { getBot, updateBot } from "@/GlobalStates/Slices/botSlice";
import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import React from "react";
import { Bot } from "../../types";

const TotalGrids = (props: { botID: number }) => {
  const bot = useAppSelector((state) => getBot(state, props.botID)) as Bot;
  const dispatch = useAppDispatch();
  function removeGrids() {
    fetchapi(`/gridbot/${props.botID}/grids/`, "DELETE").then((resposne) => {
      if (resposne.code == "200") {
        const newBotState = { ...bot };
        newBotState.grids = [];
        dispatch(updateBot(newBotState));
        dispatch(newAlert({ message: "OK", mode: "success", time: 5 }));
      }
    });
  }
  return (
    <>
      Total Grids : {bot.grids.length}{" "}
      {bot.grids.length > 0 && (
        <button onClick={removeGrids} className="btn btn-xs btn-error ms-5">
          Remove All
        </button>
      )}
      
    </>
  );
};

export default TotalGrids;
