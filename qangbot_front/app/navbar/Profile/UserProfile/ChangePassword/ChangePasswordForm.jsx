import React from 'react'
import  {newPasswordInput, passwordInput, repeatPasswordInput} from "@/app/auth/inputs"
import UseFormTemplate from '@/app/common/UseForm/UseFormTemplate'
import ResponseAlert from '@/app/common/Alerts/ResponseAlert'
import { fetchapi } from '@/app/commonJS/fetchAPI'
import dictionary from "./dictionary.json"
const ChangePasswordForm = (props) => {
    const lang=props.lang
    const form = {
        inputs:[
            passwordInput(lang),
            newPasswordInput(lang),
            repeatPasswordInput(lang)

        ]
        ,
        action : dictionary.changePassword[lang]


    }
    const action = async function (data) {
      if (data.newPassword !== data.repeatPassword){
       return <ResponseAlert mode={"warning"}   message={dictionary.samePasswordError[lang]} />
      }
      const response = await fetchapi("/user/"  ,"PATCH" ,data)
      if (response.code == "200"){
        setTimeout(() => {
            location.reload()
        }, 2000);
        return <ResponseAlert mode={"success"} waiting={true}  message={dictionary.successChange[lang]} />
      }
      else {
        return <ResponseAlert mode={"warning"}   message={dictionary.passwordError[lang]} />
      }
    }

  return (
    <UseFormTemplate form={form} action={action}/>
  )
}

export default ChangePasswordForm