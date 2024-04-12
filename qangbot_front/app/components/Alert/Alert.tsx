import React from "react";
import alertDetailFromMode from "./alertSelector";

type Alert = {
  message: string;
  mode: "error" | "warning" | "success" | "info" | null;
};

const Alert = (props: { alert: Alert }) => {
  return (
    <div
      role="alert"
      className={
        "w-full  flex justify-start h-fit  px-5 p-2  gap-2 alert shadow-xl   " +
        alertDetailFromMode(props.alert.mode).className
      }
    >
      {alertDetailFromMode(props.alert.mode).svg}
      <span className="text-sm ">{props.alert.message}</span>
    </div>
  );
};

export default Alert;
