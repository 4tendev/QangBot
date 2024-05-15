"use client"
import React, { useState } from 'react'
import dictionary from "./dictionary.json"
const Pause = (props) => {
  const [paused, setPaused] = useState(false)
  const [pausing, setPausing] = useState(false)
  const botID=props.botID
  const lang= props.lang
  function deactive() {
    setPausing(true)
    try {
      fetchapi(`/bot/${botID}/`,"DELETE" ).then(
        response=>{
          setPaused(!response.status)
          if (response.isOrdersCanseled ===true)
          {
            setAlertMode("success")
            setIsOrdersCanseled(true)
            setResponseMessage(dictionary.success[lang])
            setTimeout(() => {
                location.reload()
            }, 2000);
          }
          else {
            setAlertMode("warning")
            setResponseMessage(dictionary.warning[lang])
            setIsOrdersCanseled(false)
          }
          setPausing(false)
        }
       
      )
    } catch (error) {
      setResponseMessage("Failed to Connect to server")
      setPausing(false)
    }
    
   }
  return (
    <>
    
    <button className="btn btn-sm btn-warning" onClick={()=>document.getElementById('PauseModal').showModal()}>{dictionary.pause[lang]}</button>
    <dialog id="PauseModal" className="modal">
      <div className="modal-box">
        {
         
          <>
          <h3 className="font-bold text-lg text-accent">{dictionary.attention[lang]}</h3>
          <p className="py-4 text-info"> {dictionary.action3[lang]}</p>
          <ol className='w-full text-start flex flex-col gap-3'>
            <li>
            {dictionary.cancelOrders[lang]}
            </li>
            <li>
            {dictionary.removeGrids[lang]}
            </li>
            <li>
            {dictionary.pauseState[lang]}
            </li>
          </ol>
          </>

        }


        <div className="modal-action">
          
            {/* if there is a button in form, it will close the modal */}
            <div className='flex gap-3 items-center'>

            {
            paused ===false ? <>
                <button disabled={pausing} onClick={deactive} className='btn btn-sm btn-warning'>{dictionary.pauseBot[lang]}</button>
                <form method="dialog">
                <button  className="btn btn-sm">{dictionary.dismiss[lang]}</button>
                </form>
            </>

                    :<button onClick={()=>location.reload()}  className="btn btn-sm">{dictionary.dismiss[lang]}</button>
              }
            </div>
    
        </div>
      </div>
    </dialog>
    </>

  )
}

export default Pause