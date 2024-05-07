"use client";
import React, { useEffect } from "react";
import FreePlan from "./FreePlan";
import VIPPlan from "./VIPPlan";
import { useAppSelector } from "@/GlobalStates/hooks";
import { isKnown, isVIP } from "@/GlobalStates/Slices/userSlice";
import Auth from "../auth/page";

const Page = () => {
  const userisKnown = useAppSelector(isKnown);
  const userisVIP = useAppSelector(isVIP);

  useEffect(() => {
    return () => {};
  }, []);

  return userisKnown ? userisVIP ? "VIP" : <FreePlan /> : <Auth />;
};

export default Page;
