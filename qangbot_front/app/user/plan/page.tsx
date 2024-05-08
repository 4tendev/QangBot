"use client";
import React from "react";
import FreePlan from "./FreePlan";
import VIPPlan from "./VIPPlan";
import { useAppSelector } from "@/GlobalStates/hooks";
import { isKnown, isVIP } from "@/GlobalStates/Slices/userSlice";
import Auth from "../auth/page";

const Page = () => {
  const userisKnown = useAppSelector(isKnown);
  const userisVIP = useAppSelector(isVIP);
  return userisKnown ? userisVIP ? <VIPPlan /> : <FreePlan /> : <Auth />;
};

export default Page;
