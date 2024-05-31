"use client";
import { botInfo, getBot } from "@/GlobalStates/Slices/botSlice";
import { isKnown } from "@/GlobalStates/Slices/userSlice";
import { useAppSelector } from "@/GlobalStates/hooks";
import Loading from "@/app/loading";
import Auth from "@/app/user/auth/page";

export default function Template({ children }: { children: React.ReactNode }) {
  const useisknown = useAppSelector(isKnown);
  const loading = useisknown === undefined 

  return loading ? (
    <Loading />
  ) : useisknown === false ? (
    <Auth />
  ) : (
    <>{children}</>
  );
}
