import React, { useState } from "react";
import dictionary from "./dictionary.json";
import GridForm from "./GridForm/GridForm";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { Bot } from "../../types";

const AddGrids = (props: { botID: number }) => {
  const lang = useAppSelector(language).lang;

  const [reviewMode, setReviewMode] = useState<boolean>(false);
  const [creating, setCreating] = useState(false);
  const [grids, setGrids] = useState<Bot["grids"]>([]);

  return (
    <div className="py-3">
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
