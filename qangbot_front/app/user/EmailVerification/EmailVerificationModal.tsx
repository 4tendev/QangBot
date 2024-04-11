"use client";
import UseFormTemplate from "../../UseForm/UseFormTemplate";
import { useEffect, useState } from "react";
import dictionary from "./dictionary.json";
import { emailCodeInput } from "../auth/inputs/inputs";
import { Language } from "@/settings";

const VerificationModal = (props: {
  timeRemaining: number;
  data: object;
  action: Function;
  lang: Language;
}) => {
  const [isActive, setIsActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(props.timeRemaining);
  const data = props.data;
  const action = props.action;
  const lang = props.lang;
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(
        () => setTimeRemaining((prev) => (prev > 0 ? prev - 1 : prev)),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [isActive]);

  function tryWithVerificationCode(dataCode: object) {
    const dataWithVerificationCode = Object.assign({}, data, dataCode);
    return action(dataWithVerificationCode);
  }

  const minutes = Math.floor(timeRemaining / 60);
  const remainingSeconds = timeRemaining % 60;
  const defaultform = {
    inputs: [emailCodeInput(lang)],
    action: dictionary.verify[lang],
  };
  return (
    <div className={isActive ? "modal modal-open" : "modal"}>
      <div className="modal-box">
        <h3 className="font-bold text-lg text-info">
          {dictionary["verificationSent"][lang]}
        </h3>
        <div className="flex items-center gap-2">
          <p className="py-4 max-[555px]:text-sm ">
            {dictionary["verificationSentMessage"][lang]}
          </p>
          <div className="flex gap-2">
            {minutes ? (
              <div>
                <span className="countdown font-mono text-accent text-xl">
                  <span className="mx-1" style={{ "--value": minutes } as any}>
                    {minutes}
                  </span>
                </span>
                {dictionary["minute"][lang]}
              </div>
            ) : null}
            <div>
              <span className="countdown font-mono text-xl text-accent">
                <span
                  className="mx-1"
                  style={{ "--value": remainingSeconds } as any}
                >
                  {remainingSeconds}
                </span>
              </span>
              {dictionary["seccond"][lang]}
            </div>
          </div>
        </div>
        <UseFormTemplate form={defaultform} action={tryWithVerificationCode} />

        <button
          onClick={() => setIsActive(false)}
          className="btn btn-ghost w-full"
        >
          {dictionary["dismiss"][lang]}
        </button>
      </div>
    </div>
  );
};

export default VerificationModal;
