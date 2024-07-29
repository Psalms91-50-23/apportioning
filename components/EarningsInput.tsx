'use client';
import React, { useEffect, useState } from 'react';
import functions from "../functions";
const { isFirefox } = functions;
import { EarningsInputProp } from '@/types';

const EarningsInput = ({
    title,
    id,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    inputRef,
    setDisplayAll,
    setIsClicked
  }: EarningsInputProp) => {

    const [isFirefoxBrowser, setIsFirefoxBrowser] = useState(false);

    useEffect(() => {
      setIsFirefoxBrowser(isFirefox());
    }, []);
    
    const handleFocusChange = () => {
      if(onFocus){
        onFocus();
      }
      setDisplayAll(false);
      setIsClicked(false);
    }

// Conditionally define text color based on isFirefoxBrowser
  const inputStyle: React.CSSProperties = {
    color: isFirefoxBrowser ? 'black' : '', 
    maxWidth: "300px", 
    fontWeight: "700"
  };

    return (
      <div className="flex flex-col w-full mb-4 space-x-4" style={{ maxWidth: "300px" }}>
        <div className="">
          <label htmlFor={id} className={`block text-black-900 text-xl font-bold mb-2`}>
            {title}
          </label>
          <input
            placeholder='300.54'
            type="text"
            id={id}
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={() => handleFocusChange()}
            className={`w-full border rounded-lg py-2 px-3 ${isFirefoxBrowser ? `text-blue-900` : "text-black-900"} ${error ? ' border-red-500' : ''}`}
            style={inputStyle}
          />
        </div>
        {error || !value || value == "0.00" && (
          <div className="my-3">
            <p className="text-red-900 font-bold text-s italic">Please add a value</p>
          </div>
        )}
      </div>
    );
  };
  
  export default EarningsInput;