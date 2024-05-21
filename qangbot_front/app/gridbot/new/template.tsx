"use client";
import { canAddBot, newBotInfo } from "@/GlobalStates/Slices/botSlice";
import { isKnown } from "@/GlobalStates/Slices/userSlice";

import { useAppSelector, useAppDispatch } from "@/GlobalStates/hooks";
import { useEffect } from "react";
import { fetchapi } from "@/commonTsBrowser/fetchAPI";
import Loading from "@/app/loading";
import VIPRequired from "../VIPRequired";
import Auth from "@/app/user/auth/page";
export default function Template({ children }: { children: React.ReactNode }) {
  const canCreateBot = useAppSelector(canAddBot);
  const useisknown = useAppSelector(isKnown);
  const dispatch = useAppDispatch();
  useEffect(() => {
    canCreateBot === undefined
      ? fetchapi("/gridbot/", "GET").then((response) => {
          response.code === "200" ? dispatch(newBotInfo(response.data)) : null;
        })
      : null;
    return () => {};
  }, []);

  return useisknown ? (
    canCreateBot === undefined ? (
      <Loading></Loading>
    ) : canCreateBot === true ? (
      <>{children}</>
    ) : (
      <VIPRequired />
    )
  ) : useisknown === undefined ? (
    <Loading></Loading>
  ) : (
    <Auth />
  );
}
