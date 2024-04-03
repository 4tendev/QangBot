"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/GlobalStates/hooks";
import CheckUser from "./CheckUser";
import { isKnown } from "@/GlobalStates/Slices/userSlice";
import UserProfile from "./UserProfile/UserProfile";
import ProfileImage from "./ProfileImage";

const Profile = () => {
  const userisKnown = useAppSelector(isKnown);

  return userisKnown === undefined ? (
    <CheckUser />
  ) : userisKnown === true ? (
    <UserProfile />
  ) : (
    <Link className="flex items-center" href={"/auth"}>
      <ProfileImage />
    </Link>
  );
};

export default Profile;
