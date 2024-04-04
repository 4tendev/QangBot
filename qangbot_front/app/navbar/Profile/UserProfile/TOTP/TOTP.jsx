import React, { useEffect, useState } from "react";
import dictionary from "../../UserProfile/TOTP/dictionary.json";
import { fetchapi } from "@/app/commonJS/fetchAPI";
import SetTOTP from "./SetTOTP/SetTOTP";
import RemoveTOTP from "./RemoveTOTP/RemoveTOTP";
import TextSVG from "../TextSVG"
const TOTP = (props) => {
  const [isTOTPActive, setIsTOTPActive] = useState(null);
  const [creationMode, setCreationMode] = useState(false);
  const [removalMode, setRemovalMode] = useState(false);

  const MODALID="TOTPMODAL"
  const TOTPSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 mt-0.5"
      fill="currentColor"
      width="20"
      viewBox="0 0 640 512"
    >
      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c1.8 0 3.5-.2 5.3-.5c-76.3-55.1-99.8-141-103.1-200.2c-16.1-4.8-33.1-7.3-50.7-7.3H178.3zm308.8-78.3l-120 48C358 277.4 352 286.2 352 296c0 63.3 25.9 168.8 134.8 214.2c5.9 2.5 12.6 2.5 18.5 0C614.1 464.8 640 359.3 640 296c0-9.8-6-18.6-15.1-22.3l-120-48c-5.7-2.3-12.1-2.3-17.8 0zM591.4 312c-3.9 50.7-27.2 116.7-95.4 149.7V273.8L591.4 312z" />
    </svg>
  );

  const lang = props.lang;
  const onClick = props.onClick;

  useEffect(() => {
    fetchapi("/user/TOTP/").then((response) => {
      if (response.code == "200") {
        setIsTOTPActive(true);
      } else if (response.code == "4010") {
        setIsTOTPActive(false);
      }
    });

    return () => {};
  }, []);

  return (
    <>
      <button
        onClick={() => document.getElementById(MODALID).showModal()}
        className="w-full "
      >
        <TextSVG text={dictionary.settings[lang]}  svg={TOTPSVG}/>
      </button>
      <dialog id={MODALID} className="modal">
        <div className="modal-box max-w-md">
          {creationMode !== true ? (
            <h3 className="font-bold text-lg text-info">
              {isTOTPActive
                ? dictionary.protected[lang]
                : dictionary.notProtected[lang]}
            </h3>
          ) : null}

          {isTOTPActive ? (
            <>
              <RemoveTOTP
                close={onClick}
                removalMode={removalMode}
                lang={lang}
              />

              <button
                onClick={() => setRemovalMode(true)}
                className={
                  "my-4 btn btn-warning w-full " +
                  (removalMode ? " hidden" : " ")
                }
              >
                {dictionary.remove[lang]}
              </button>
            </>
          ) : (
            <>
              <SetTOTP
                close={onClick}
                creationMode={creationMode}
                lang={lang}
              />
              <button
                onClick={() => setCreationMode(true)}
                className={
                  "my-4 btn btn-success w-full " +
                  (creationMode ? " hidden" : " ")
                }
              >
                {dictionary.start[lang]}
              </button>
            </>
          )}
          <div className="modal-action w-full mt-0">
            <form method="dialog" className="w-full">
              <button onClick={onClick} className="btn w-full">
                {dictionary.close[lang]}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default TOTP;
