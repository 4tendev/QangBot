"use client";
import React from "react";
import UserProfile from "../navbar/Profile/UserProfile/UserProfile";
import { isKnown } from "@/GlobalStates/Slices/userSlice";
import Auth from "./auth/page";
import { useAppSelector } from "@/GlobalStates/hooks";
const Page = () => {
  const userisKnown = useAppSelector(isKnown);
  return userisKnown ? <UserProfile /> : <Auth />;
};

export default Page;
