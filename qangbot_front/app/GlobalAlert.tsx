"use client"
import React from 'react'
import TimeAlert from './components/TimeAlert/TimeAlert'
import { useAppSelector } from "@/GlobalStates/hooks";
import { globalalert } from "@/GlobalStates/Slices/alert/Slice";


const GlobalAlert = () => {
  const newAlert = useAppSelector(globalalert)
  return (
    newAlert.message ?  
    <TimeAlert key={Math.random()} timeAlert={newAlert} /> 
    :null
  )
}

export default GlobalAlert