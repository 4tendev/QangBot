"use client"

import  { Language   }  from '@/settings'
import React from 'react'
import dictionary from "./dictionary.json"
import config ,{Theme} from "@/tailwind.config";
import setCookie from '@/commonTsBrowser/setCookie';

const ThemeList = (props :{lang:Language} )  => {
    
    const themes :Theme[] =  config.daisyui.themes  
    const lang= props.lang
  
    function setTheme(theme :Theme ) {
      document.getElementsByTagName("html")[0]?.setAttribute("data-theme" , theme)
        setCookie("theme",theme,100 )
    }
    return (
      <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-32 max-h-48 overflow-auto">
        {themes.map(
            (theme) => (
            <li
              key={theme}>
                <input
                onClick={()=>setTheme(theme)} 
                type="radio" 
                data-theme={theme} 
                name="theme-dropdown" 
                className="theme-controller bg-base-300 btn btn-xs btn-block justify-start my-0.5" 
                aria-label= {dictionary[theme][lang]} 
                value={theme }/>
            </li>)

        )}
      </ul>
    )
}

export default ThemeList