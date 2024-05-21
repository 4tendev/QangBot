"use client";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { useAppSelector } from "@/GlobalStates/hooks";
import React from "react";
const Help = ({
  children,
  props,
}: {
  children: React.ReactNode;
  props: { message: string; direction?: boolean };
}) => {
  const dir = useAppSelector(language).dir;
  return (
    <div className="indicator w-1/2">
      <>{children}</>
      <div
        className={
          "tooltip  tooltip-error top-4 end-5 indicator-item" +
          (props.direction === true
            ? dir == "ltr"
              ? " tooltip-left"
              : " tooltip-right"
            : " ")
        }
        data-tip={props.message}
      >
        <div className="indicator-item bg-base-100 text-xs text-rose-600 top-4 shadow rounded-full w-5 h-5 pt-1">
          ?
        </div>
      </div>
    </div>
  );
};

export default Help;
