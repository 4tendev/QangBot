import React from 'react'

const TextSVG = (props :{text : string , svg :JSX.Element}) => {
  return (
    <div className="w-full text-inherit btn shadow-none mb-4 rounded-none flex justify-between"> 
        <div>{props.text}</div>
        {props.svg}
    </div>
  )
}

export default TextSVG