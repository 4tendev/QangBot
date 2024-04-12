"use client";
import React, { useEffect, useState } from "react";
import "./style.css";
import alertDetailFromMode from "../alertSelector";
import Alert from "../Alert";

export interface TimeAlertProp extends Alert {
  time: number;
}
const TimeAlert = (props: { timeAlert: TimeAlertProp }) => {
  const [shouldDelete, setShouldDelete] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setShouldDelete(true),
      props.timeAlert.time * 1000
    );

    return () => clearTimeout(timeoutId);
  }, []);
  return !shouldDelete ? (
    <div
      role="alert"
      className={
        "w-full sm:max-w-fit max-sm:rounded-none flex justify-center h-fit left-1/2 -translate-x-1/2 px-5 p-2 fixed gap-2 alert shadow-xl changeBrightness z-50 " +
        alertDetailFromMode(props.timeAlert.mode).className
      }
    >
      {alertDetailFromMode(props.timeAlert.mode).svg}
      <span className="text-sm ">{props.timeAlert.message}</span>
    </div>
  ) : null;
};

export default TimeAlert;
