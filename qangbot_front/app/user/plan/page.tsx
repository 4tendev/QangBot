"use client";
import React from "react";
import FreePlan from "./FreePlan";
import VIPPlan from "./VIPPlan";
import { useAppSelector } from "@/GlobalStates/hooks";
import {  isVIP } from "@/GlobalStates/Slices/userSlice";

const Page = () => {
  const userisVIP = useAppSelector(isVIP);
  return userisVIP ? <VIPPlan /> : <FreePlan /> 
};

export default Page;
