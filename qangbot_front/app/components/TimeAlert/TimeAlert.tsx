"use client";
import React, { useEffect, useState } from "react";
import "./style.css";
import alertDetailFromMode from "./alertSelector";
export type TimeAlertProp = {
  message: string;
  time: number;
  mode: "error" | "warning" | "success" | "info" | null;
};

const TimeAlert = (props: { timeAlert: TimeAlertProp }) => {
  const [shouldDelete, setShouldDelete] = useState(false);
  const id = "TIMEALERT";

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setShouldDelete(true),
      props.timeAlert.time * 1000
    );

    return () => clearTimeout(timeoutId);
  }, []);
  return !shouldDelete ? (
    <div
      id={id}
      role="alert"
      className={
        "w-fit left-1/2 -translate-x-1/2 p-1 mx-auto fixed top-20 alert   changeBrightness z-50 " +
        alertDetailFromMode(props.timeAlert.mode).className
      }
    >
      {alertDetailFromMode(props.timeAlert.mode).svg}
      <span className="text-sm">{props.timeAlert.message}</span>
    </div>
  ) : null;
};

export default TimeAlert;
