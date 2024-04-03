"use client"
import { fetchapi } from '@/app/commonJS/fetchAPI'
import React, { useEffect, useState } from 'react'
import { authenticator } from 'otplib';
import QRCode from 'react-qr-code';
import ResponseAlert from '@/app/common/Alerts/ResponseAlert';
import dictionary from "./dictionary.json"

const SetTOTP = (props) => {
  const [checking, setChecking] = useState(undefined)
  const [secretKey, setSecretKey] = useState("")
  const [otpAuthUri, setOtpAuthUri] = useState("")
  const [totpCode, setTotpCode] = useState("")
  const [responseAlert, setRresponseAlert] = useState(null)

    const creationMode =props.creationMode
    const lang=props.lang
    useEffect(() => {
      const generatedSecretKey = authenticator.generateSecret();
      setSecretKey(generatedSecretKey)
      return () => {
      }
    }, [])

    useEffect(() => {
      if (creationMode) {

        setOtpAuthUri( `otpauth://totp/QANG?secret=${secretKey}`)
       

      }
      return () => {
      }
    }, [creationMode])

    const copyToClipboard = async () => {

      await navigator.clipboard.writeText(secretKey);

    };
  async  function setTOTP() {
      setChecking(true)

      await  fetchapi("/user/TOTP/","POST",{key :secretKey ,TOTPCode :totpCode }  ).then(
          response => {response.code =="200" ? setRresponseAlert(<ResponseAlert mode="success" waiting={true} message= {dictionary.successCode[lang]}/>):setRresponseAlert(<ResponseAlert  mode={"warning"} message={dictionary.wrongCode[lang]} />)
         
          response.code =="200" ? setTimeout(() => {
            props.close()
          }, 2000) :null

          response.code =="200" ? setChecking(null)  : setChecking(undefined)

        }
        )
    }
  return (
    creationMode ===true ? <div className='pb-4'>
      {dictionary.scan[lang]} <br />{dictionary.touch[lang]}<small onClick={copyToClipboard} className='link text-xl mx-1 text-primary'>{dictionary.here[lang]}</small> {dictionary.copy[lang]}
    <div className='p-3 m-3 w-56 mx-auto bg-white '>
    < QRCode size={200} value={otpAuthUri} />
    </div>
{dictionary.writeCode[lang]}    <input value={totpCode} autoFocus={true} onChange={(event)=>setTotpCode(event.target.value   )} type="text" className='input input-bordered w-full my-2 'placeholder={dictionary.TOTPCode[lang]} />
    {responseAlert}
    <button onClick={setTOTP} disabled={checking===true} className={'btn mt-1  w-full btn-success '+ ( checking===null  ?"hidden ":  " ") }  >{dictionary.verify[lang]}</button>
        
    </div>
    :
    <>
    
    <div className='text-sm mt-3 '>
{dictionary.securityNote[lang]}    </div>


    </>


  )
}

export default SetTOTP