"use client";
import { useState } from "react";
import dictionary from "./dictionary.json";
import { Language } from "@/settings";

const VerificationModal = (props: {
  data: object;
  action: Function;
  lang: Language;
}) => {
  const [isActive, setIsActive] = useState(true);
  const data = props.data;
  const action = props.action;
  const lang = props.lang;
  const [totpCode, settotpCode] = useState("");
  const [response, setResponse] = useState("");
  const [fetching, setFetching] = useState(false);

  function changeInput(event: any) {
    settotpCode(event.target.value);
    if (event.target.value.length === 6) {
      setResponse("");
    }
  }

  async function tryWithVerificationCode() {
    if (!totpCode) {
      setResponse(dictionary.required[lang]);
      return;
    }
    if (totpCode && totpCode.length !== 6) {
      setResponse(dictionary["6digit"][lang]);
      return;
    }
    setFetching(true);
    setResponse("");
    const dataWithVerificationCode = Object.assign({}, data, {
      TOTPCode: totpCode,
    });
    const response = await action(dataWithVerificationCode);
    if (response) {
      setResponse(response);
    }
    setFetching(false);
  }

  return (
    <div className={isActive ? "modal modal-open" : "modal"}>
      <div className="modal-box">
        <h3 className="font-bold text-lg text-info">
          {dictionary["verification"][lang]}
        </h3>
        <div className="flex flex-col gap-3 w-full">
          <input
            value={totpCode}
            onChange={changeInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                tryWithVerificationCode();
              }
            }}
            type="number"
            className="w-full input input-bordered mt-3"
            placeholder={dictionary.totpCode[lang]}
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
