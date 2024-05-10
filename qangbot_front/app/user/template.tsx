"use client";
import { isKnown } from "@/GlobalStates/Slices/userSlice";
import Auth from "./auth/page";
import { useAppSelector } from "@/GlobalStates/hooks";

export default function Template({ children }: { children: React.ReactNode }) {
  const userisKnown = useAppSelector(isKnown);

  return userisKnown === undefined ? (
    <div className="w-full flex justify-center">
      <span className="loading loading-bars loading-lg mt-10 "></span>
    </div>
  ) : userisKnown ? (
    <>{children}</>
  ) : (
    <Auth />
  );
}
