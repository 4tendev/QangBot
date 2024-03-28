import React from 'react'
const WhyExplained = (props:{header:string , explaination:string}) => {
  return (
    <div className="my-2 sm:w-1/2 max-w-sm">
    <small className="text-lg text-info block mb-2">
      {props.header}
    </small>
    <div className="px-3"> {props.explaination}</div>
  </div>
  )
}

export default WhyExplained