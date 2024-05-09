import getLanguage from '@/commonTsServer/getLanguage'
import React from 'react'
import dictionary from"./dictionary.json"
import Link from 'next/link'

const Page = () => {
    const lang=getLanguage().lang

    return (
      <div className='relative h-full w-fit'>
  
      <div  className='max-w-6xl px-6 h-full overflow-auto sm:px-11 pt pt-3 '>
  
      <h3 className='font-bold text-lg my-1'>
      
      {dictionary.what[lang]}
      </h3>
      <div className='ps-2'>
      
      {dictionary.AiNotice[lang]}
  
  
  
  
  <br />
  
      {dictionary.explain[lang]}
  
     
      <h4 className='text-lg my-2 text-info'>
      {dictionary.benefits[lang]}
      </h4> 
      <ul className='ps-1'>
          <li>
              <div className='text-primary'>
              {dictionary.emotionFree[lang]}
  
              </div>
              {dictionary.emotionFreeExplain[lang]}
      
          </li>
          <li>
          <div className='text-primary'>
              {dictionary.noneStop[lang]}
   
              </div>
              {dictionary.noneStopExplain[lang]}
              
          </li>
      </ul>
  
  
  </div>
  <h3 className='font-bold text-lg my-1'>
  {dictionary.How[lang]}
  
      </h3>
      <div className='ps-2'>
  
      <h4 className='text-lg my-1 text-info'>
      
      {dictionary.setup[lang]}
      </h4>
      <p className='ps-1'>
      
      {dictionary.setupExplain[lang]}
      </p>
  
      <h4 className='text-lg my-1 text-info'>
      
      {dictionary.execution[lang]}
  
      </h4>
      <p className='ps-1'>
      
      {dictionary.executionExplain[lang]}
      </p>
  
      </div>
  
      <h3 className='font-bold text-lg my-1'>
  
      {dictionary.start[lang]}
      </h3>
      <div className='ps-2'>
  
      <h4 className='text-lg my-1 text-info'>
  
      {dictionary.createAccount[lang]}
      </h4>
      <p className='ps-1'>
      
      {dictionary.SignUp[lang]}
      </p>
      
      <h4 className='text-lg my-1 text-info'>
      {dictionary.api[lang]}
      </h4>
      <p className='ps-1'>
      {dictionary.createBot[lang]}
  
      </p>
      <h4 className='text-lg my-1 text-info'>
      
      {dictionary.config[lang]}
  
      </h4>
      <p className='ps-1'>
      
      {dictionary.configExplain[lang]}
      </p>
   
      <h4 className='text-lg my-1 text-info'>
      
      {dictionary.monitor[lang]}
      </h4>
      <p className='ps-1'> 
      
      {dictionary.monitorExplain[lang]}
  </p>
  
      </div>
      <div className='mt-5 sm:mb-6 mb-20 flex flex-col '>
      {dictionary.action[lang]}
      <Link href={"/gridbot/new"} className='  sm:top-0 sm:w-60 sm:shadow-xl sm:me-6 md:me-11 end-0 mt-3  w-screen  bottom-0 btn btn-lg sm:btn-sm absolute btn-success rounded-none '>    {dictionary.freeCreate[lang]}
  </Link>
  
      </div>
  
      </div>
      </div>
  
   )
  }

export default Page