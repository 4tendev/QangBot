"use client";
import { botInfo, getBot } from "@/GlobalStates/Slices/botSlice";
import { isKnown } from "@/GlobalStates/Slices/userSlice";
import { useAppSelector } from "@/GlobalStates/hooks";
import Loading from "@/app/loading";
import Auth from "@/app/user/auth/page";
import { usePathname } from "next/navigation";
import NotFound from "./not-found";

export default function Template({ children }: { children: React.ReactNode }) {
  const useisknown = useAppSelector(isKnown);
  const pathname = usePathname();
  const botID = Number(pathname.substring(9, 10));
  const userBotInfo = useAppSelector(botInfo);
  const gridbot = useAppSelector((state) => getBot(state, botID));
  const loading = useisknown === undefined || userBotInfo.isLoaded === false;

  return   loading ? (
    <Loading />
  ) : useisknown === false ? (
    <Auth />
  ) : gridbot ? (
    <>{children}</>
  ) : (
    <NotFound />
  );
}
