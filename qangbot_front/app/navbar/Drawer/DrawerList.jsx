"use client"
import React from 'react'
import Link from 'next/link'

const DrawerList = (props) => {
    function closeDrawer() {
        document.getElementById("menu").click()
    }
  return (
    <li onClick={closeDrawer}><Link href={props.link}>{props.text}</Link></li>
  )
}

export default DrawerList