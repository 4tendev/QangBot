import React from 'react'
import Chart from './Chart'
import getLanguage from '@/commonTsServer/getLanguage'
import getData from '@/commonTsServer/getData'

const page = async() => {
  const history = await getData("/strategy/")
  
  const data = history.data


  const lang=getLanguage().lang
  return (
    <Chart lang={lang}  data ={data} />
  )
}

export default page