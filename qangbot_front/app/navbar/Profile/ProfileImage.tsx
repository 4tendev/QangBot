"use client"
import Image from 'next/image'
import React from 'react'

const ProfileImage = (props : {onClick : Function}  | undefined) => {
  return (
    <Image
    onClick={ ()=> props?.onClick()}
    alt="Profile"
    role="button"
    tabIndex={0}
    width={48}
    height={48}
    className="rounded-full btn btn-outline p-0 border border-info"
    src={"/avatar.png"}
  />



  
  )
}

export default ProfileImage