import { newAlert } from "@/GlobalStates/Slices/alert/Slice";
import { getBot, updateBot } from "@/GlobalStates/Slices/botSlice";
import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import React from "react";
import { Bot } from "../../types";
type TotalGridsProps = { botID?: number; grids: Bot["grids"] };
const TotalGrids = (props: TotalGridsProps) => {
  const bot = useAppSelector((state) => getBot(state, props.botID)) as Bot;
  const grids = props.grids;
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
      Total Grids : {grids.length}
      {props.botID && grids.length > 0 && (
        <button onClick={removeGrids} className="btn btn-xs btn-error ms-5">
          Remove All
        </button>
      )}
    </>
  );
};

export default TotalGrids;
