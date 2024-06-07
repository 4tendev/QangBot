"use client";
import { useEffect, useState } from "react";
import dictionary from "./dictionary.json";
import { Language } from "@/settings";

const VerificationModal = (props: {
  timeRemaining: number;
  data: object;
  action: Function;
  lang: Language;
}) => {
  const [isActive, setIsActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(props.timeRemaining);
  const [response, setResponse] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [fetching, setFetching] = useState(false);

  const data = props.data;
  const action = props.action;
  const lang = props.lang;
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(
        () =>
          setTimeRemaining((prev) => {
            prev < 1 ? setIsActive(false) : null;
            return prev > 0 ? prev - 1 : prev;
          }),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [isActive]);

  function changeInput(event: any) {
    setEmailCode(event.target.value);
    if (event.target.value.length === 6) {
      setResponse("");
    }
  }

  async function tryWithVerificationCode() {
    if (!emailCode) {
      setResponse("Required");
      return;
    }
    if (emailCode && emailCode.length !== 6) {
      setResponse("Only 6 DIGIT");
      return;
    }
    setFetching(true);
    setResponse("");
    const dataWithVerificationCode = Object.assign({}, data, {
      emailCode: emailCode,
    });
    const response = await action(dataWithVerificationCode);
    if (response) {
      setResponse(response);
    }
    setFetching(false);
  }

  const minutes = Math.floor(timeRemaining / 60);
  const remainingSeconds = timeRemaining % 60;

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
        <div className="flex flex-col gap-3 w-full">
          <input
            value={emailCode}
            onChange={changeInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                tryWithVerificationCode();
              }
            }}
            type="number"
            className="w-full input input-bordered mt-3"
            placeholder={dictionary.emailCode[lang]}
          />
          {response}
        </div>
        <button
          disabled={fetching}
          onClick={tryWithVerificationCode}
          className="btn btn-primary mt-3 w-full"
        >
          {dictionary["verify"][lang]}
        </button>
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
