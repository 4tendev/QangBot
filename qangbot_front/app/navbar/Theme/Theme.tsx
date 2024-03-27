import React from 'react';
import dictionary from "./dictionary.json" ;
import getLanguage from '@/commonTsServer/getLanguage';
import ThemeList from './ThemeList';


const Theme = () => {

    const lang =getLanguage().lang
    
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost flex justify-between w-fit m-1">
        <div >
          {dictionary["theme"][lang]}
        </div>
        <svg width="12px" height="12px" className="h-2 w-2 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
      </div>
      <ThemeList lang={lang}/>
    </div>
  )
}

export default Theme