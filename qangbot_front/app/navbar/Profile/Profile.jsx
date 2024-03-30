"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAppSelector } from "@/GlobalStates/hooks";
import CheckUser from "./CheckUser"
import { isKnown } from "@/GlobalStates/Slices/userSlice";





const Profile =  () => {
    const userisKnown = useAppSelector(isKnown);

  return (
    userisKnown ===undefined ? 
    <CheckUser/>
    :
    userisKnown ===true ? 
        "userProfile"

    : 
    <Link className='flex items-center' href={"/auth"}>
        <Image alt='Profile' width={48} height={48} className='rounded-full btn btn-outline p-0 border border-info'  src={"/avatar.png"}/>
    </Link>
  
  )
}

export default Profile