import { getBot } from "@/GlobalStates/Slices/botSlice";
import { useAppSelector } from "@/GlobalStates/hooks";
import React from "react";
import { Bot, Grid } from "../../types";

const CoveredRange = (props: { grids: Bot["grids"] }) => {
  const grids = props.grids;
  function mergeRanges(objs: Grid[]) {
    // Sort objects based on the 'buy' value
    const objects = [...objs];
    objects.sort((a, b) => a.buy - b.buy);

    const mergedRanges = [];
    let currentRange = { ...objects[0] };

    for (let i = 1; i < objects.length; i++) {
      const obj = { ...objects[i] };

      if (currentRange.sell >= obj.buy) {
        currentRange.sell = Math.max(currentRange.sell, obj.sell);
      } else {
        mergedRanges.push({ buy: currentRange.buy, sell: currentRange.sell });
        currentRange = obj;
      }
    }

    mergedRanges.push({ buy: currentRange.buy, sell: currentRange.sell });

    return mergedRanges;
  }
  const unPausedGrids = grids.filter((grid) => grid.status !== 3);
  const ranges =
    unPausedGrids.length > 0 ? mergeRanges(unPausedGrids) : undefined;
  return (
    <div  className="flex items-center w-full">
      {unPausedGrids.length > 0 && (
        <>
          Covered Range :
          {ranges?.map((range) => (
            <div
              className="flex items-center px-1"
              key={range.buy + range.sell}
            >
              <div className="text-success text-xs">({range.buy}</div>-
              <div className="text-rose-600 text-xs">{range.sell})</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CoveredRange;
