"use client"
import UseFormTemplate from '@/app/common/UseForm/UseFormTemplate'
import React, { useState } from 'react'
import dictionary from "./dictionary.json"
import commonDictionary from "@/app/common/dictionary.json"
import { fetchapi } from '@/app/commonJS/fetchAPI'
import ResponseAlert from '@/app/common/Alerts/ResponseAlert'

const RemoveTOTP = (props) => {
  const [askingCode, setAskingCode] = useState(false)
  const [response, setResponse] = useState(undefined)

  const removalMode = props.removalMode
  const lang= props.lang

  async function removeTOTP (data){
    setResponse(undefined)
    const response =  await fetchapi("/user/TOTP/" ,"DELETE",data)
    if (response.code =="200"){
      setResponse(<ResponseAlert message={dictionary["success"][lang]} waiting={true} mode={"success"} />)
      setTimeout(() => {
        props.close()
      }, 2000);
    }
    else if (response.code =="400"){
      setResponse(<ResponseAlert message={dictionary["wrong"][lang]} mode={"warning"} />)
    }
    else if (response.code =="4001"){
      setResponse(<ResponseAlert message={dictionary["manyTries"][lang]} mode={"warning"} waiting={true} />)
      setTimeout(() => {
        props.close()
      }, 2000);
    }


  }
  const formTOTP = {
    inputs :
    [
      {
        autoFocus: true,
        type: "text",
        placeHolder: dictionary["TOTPCode"][lang] ,
        name: "TOTPCode",
        validations: { required: true,minLength: 6 },
        validationsMSG: {
          required: commonDictionary["required"][lang],
          minLength : dictionary["sixChar"][lang]
        }},
       
    ]
    ,


    action :dictionary["remove"][lang]
  }
  const formEmail = {
    inputs :
    [
      {
        autoFocus: true,
        type: "text",
        placeHolder: dictionary["EmailCode"][lang] ,
        name: "EmailCode",
        validations: { required: true,minLength: 6 },
        validationsMSG: {
          required: commonDictionary["required"][lang],
          minLength : dictionary["sixChar"][lang]
        }
    }
       
    ]
    ,


    action :dictionary["remove"][lang]
  }
  const [form, setForm] = useState(formTOTP)

async  function getEmailCode() {
    setAskingCode(true)
   await fetchapi("/user/TOTP/" ,"DELETE",{}).then(
    response=> {
     if (response.code == "201")  {
      setForm(formEmail) 
       setResponse(<ResponseAlert message={dictionary["emailSent"][lang]} mode={"success"} />)
       setAskingCode(null)
       }
      else {
        setAskingCode(false)
      }
    }
   )
   

    
  }


  
  return (
    <div className='text-lg font-bold  flex flex-col '>
      <div className='my-3'>
          {dictionary["removalNote"][lang]}
          
      </div>
      {
    removalMode ?
          <>
            <UseFormTemplate key={form.inputs[0].name} form = {form} action={removeTOTP} />
            {

            response}

              <button disabled={askingCode ===true }  onClick={getEmailCode} className={'w-full text-rose-500 btn btn-ghost mb-2' + (askingCode===null ? " hidden" : " ")}   >{dictionary["lostTOTP"][lang]}</button>
              </>

              :


              null

              }
    </div>
  )
}

export default RemoveTOTP