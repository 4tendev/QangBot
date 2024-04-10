import React from 'react'

const TextSVG = (props :{text : string , svg :JSX.Element}) => {
  return (
    <div className="w-full h-full text-inherit btn shadow-none items-center rounded-none flex justify-between"> 
        <div>{props.text}</div>
        {props.svg}
    </div>
  )
}

export default TextSVG