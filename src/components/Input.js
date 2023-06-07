import React from "react";

function Input(props) {
  return (
    <React.Fragment>
      <div className={`mt-2 ${props.inputDivClass}`}>
        <input
          id={props.input}
          name={props.input}
          type={props.type}
          autoComplete={props.autoComplete}
          onChange={props.onChange}
          value={props.value}
          required
          className={`block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${props.className}`}
        />
      </div>
    </React.Fragment>
  );
}

export default Input;
