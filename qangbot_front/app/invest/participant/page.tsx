"use client";
import React, { useEffect, useState } from "react";
import Deposit from "./deposit/page";
import Link from "next/link";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";

const Page = () => {
  const [shareValue, setshareValue] = useState<number | undefined>(undefined);
  function getUserShare() {
    fetchapi("/strategy/participant/", "GET").then((response) => {
      response.code === "200" && setshareValue(response.data.value);
    });
  }
  useEffect(() => {
    getUserShare();

    return () => {};
  }, []);

  return (
    <div>
      <div className="flex justify-center md:justify-start alert  rounded-none h-12 md:ps-11 md:text-start absolute top-[80px] p-0  w-full left-0">
        <div className="w-full font-bold flex justify-center md:me-80">
          <button className="">
            {"Current Share Value  : "}
            {shareValue?.toLocaleString() ?? (
              <span className="loading loading-ring loading-xs"></span>
            )}
            { " USD"}
          </button>
        </div>
      </div>
      <div className="mt-12 mb-14">
        <Deposit />
      </div>
      {shareValue && shareValue > 0 ? (
        <div className="w-full fixed  left-0 md:top-20 md:mt-3 md:left-1/2 bottom-0 md:flex gap-3">
          <Link
            href={"/invest"}
            className="w-1/2 md:w-24 md:btn-xs md:rounded btn btn-neutral rounded-none"
          >
            History
          </Link>
          <button className="w-1/2   md:w-24 md:btn-xs md:rounded btn  btn-primary rounded-none">
            Withdraw
          </button>
        </div>
      ) : (
        <div className="w-full fixed  left-0 md:top-20 md:mt-3 md:left-1/2 bottom-0 md:flex gap-3">
          <Link
            href={"/invest"}
            className="w-full md:w-24 md:btn-xs md:rounded btn btn-neutral rounded-none"
          >
            History
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;