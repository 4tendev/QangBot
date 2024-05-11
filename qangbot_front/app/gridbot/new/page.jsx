import React from 'react'
import NewBotForm from "./NewBotForm"
import getData from '@/commonTsServer/getData'

const Page = async () => {
  const exchanges= await getData("/gridbot/exchange/")
  if (exchanges.code !== "200") {
   throw new Error('Server Error')
  }
  return (
      <NewBotForm exchanges={exchanges.data.exchanges} />  
  )
}

export default Page