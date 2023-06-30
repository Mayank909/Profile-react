import React from 'react'


function label(props) {
let labelFor = props.labelFor
  return (
    <>
    <label
    htmlFor={labelFor}
    className={`block text-sm font-medium leading-6 text-gray-900 ${props.className}`}
    >
    {props.children} 
    </label>
    </>
  )
}

export default label