"use client"
import { language } from '@/GlobalStates/Slices/languageSlice'
import { useAppSelector } from '@/GlobalStates/hooks'
import React from 'react'
import dictionary from "./dictionary.json"

const Page = () => {
  const lang=useAppSelector(language).lang
  return (
    <div className='text-center w-full' >{dictionary.notFound[lang]}</div>
  )
}

export default Page