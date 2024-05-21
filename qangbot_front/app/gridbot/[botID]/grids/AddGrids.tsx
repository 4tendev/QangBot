import React, { useState } from "react";
import dictionary from "./dictionary.json";
import GridForm from "./GridForm/GridForm";
import { useAppDispatch, useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { Bot } from "../../types";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import { addGrids } from "@/GlobalStates/Slices/botSlice";
import { newAlert } from "@/GlobalStates/Slices/alert/Slice";
import { TabType } from "./page";

const AddGrids = (props: {
  botID: number;
  setTab: React.Dispatch<React.SetStateAction<TabType>>;
}) => {
  const lang = useAppSelector(language).lang;

  const [reviewMode, setReviewMode] = useState<boolean>(false);
  const [creating, setCreating] = useState(false);
  const [grids, setGrids] = useState<Bot["grids"]>([]);
  const dispatch = useAppDispatch();
  async function CreateGrids() {
    setCreating(true);
    await fetchapi(`/gridbot/${props.botID}/grids/`, "POST", {
      grids: grids,
    }).then((response) => {
      if (response.code === "200") {
        dispatch(addGrids({ botID: props.botID, grids: response.data }));
        setReviewMode(false);
        setGrids([]);
        props.setTab("info");
        dispatch(newAlert({ message: "ok", mode: "success", time: 5 }));
      }
    });
    setCreating(false);
  }

  return (
    <div className="py-2">
      <h5 className="text-xl text-warning px-3">important notice</h5>
      <p className="px-5 mb-2">
        To check size and price Unit u must check contract information in below
      </p>
      <GridForm
        creationLimit={null}
        reviewMode={reviewMode}
        setReviewMode={setReviewMode}
        grids={grids}
        setGrids={setGrids}
      />

      {reviewMode && (
        <>
          {grids && (
            <div>
              All grids Start with{" "}
              {grids[0].nextPosition === 1 ? "Selling " : "Buying "}
            </div>
          )}
          <div>
            <button
              onClick={CreateGrids}
              disabled={creating}
              className="btn  mx-auto  btn-success w-1/2 mt-5"
            >
              {dictionary.create[lang]}{" "}
            </button>
            <button
              onClick={() => setReviewMode(false)}
              className="btn  mx-auto btn-ghost w-1/2 mt-3"
            >
              {dictionary.dismiss[lang]}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddGrids;
