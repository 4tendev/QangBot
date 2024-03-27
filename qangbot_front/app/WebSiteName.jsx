
import Link from 'next/link'
import React from 'react'
import dictionary from "@/app/dictionary.json"
import getLanguage from '@/commonTsServer/getLanguage'


const WebSiteName =  () => {

  const lang= getLanguage().lang

  return (
        <Link 
          className={ 'text-2xl text-primary max-[310px]:text-xl ' +  ( getLanguage() == "fa" ? " " : " font-mono ") } 
          href={"/"}
        > 
          {dictionary.WebSiteName[lang]} 
        </Link>
    )
}


export default WebSiteName