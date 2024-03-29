"use client"
import React from 'react'
import Link from 'next/link'

const DrawerList = (props :{link : string ,text:string,toggleID :string}) => {
    function closeDrawer() {
        document.getElementById(props.toggleID)?.click()
    }
  return (
    <li onClick={closeDrawer}><Link href={props.link}>{props.text}</Link></li>
  )
}

export default DrawerList