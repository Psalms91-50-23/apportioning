'use client';
import React, { useEffect, useState } from 'react';
import { DateInputProps } from '@/types';
import functions from "../functions";
const { isFirefox } = functions;
import Image from 'next/image';

const DateInput = ({ inputTitle, inputValue, onChange, onBlur , error, inputRef, onFocus, setValue, setDisplayAll }: DateInputProps) => {
    const handleDragStart = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  const [isFirefoxBrowser, setIsFirefoxBrowser] = useState(false);
  const [onHover, setOnHover] = useState<boolean>(false);

  useEffect(() => {
    setIsFirefoxBrowser(isFirefox());
  }, []);

  const onClick = () => {
    if(setDisplayAll){
      setDisplayAll(false);
    }
    if(setValue){
      setValue("");
    }
  }

  return (
    <div className="flex flex-row mb-4 box-content" style={{ maxWidth: "300px" }} draggable onDragStart={handleDragStart}>
    <div className="flex flex-col">
      <label htmlFor={inputTitle} className="block text-black-900 text-md font-bold mb-2">
        {inputTitle}
      </label>
      <div className="flex flex-row relative">
        <input
          type="text"
          id={inputTitle}
          name={inputTitle}
          value={inputValue}
          onChange={onChange}
          ref={inputRef}
          onBlur={onBlur}
          className={`w-full border rounded-lg py-2 px-3 pr-12 font-bold text-black-900${error && !isFirefoxBrowser ? ' border-red-500' : ''}`}
          onFocus={onFocus && onFocus}
        />
        { inputValue.length > 0 && (
            <img 
            className={`absolute top-1 right-1 rounded-3xl ${onHover && "big-size"}`}
            src="/cross.svg" 
            alt="Cross Icon" 
            width={35}
            height={35}
            onClick={onClick}
            onMouseEnter={()=> setOnHover(true)}
            onMouseLeave={()=> setOnHover(false)}
            
          />
        )
        }
      </div>
      {error && (
        <div className="my-3">
          <p className="text-red-700 font-bold text-xs italic">Invalid input format</p>
        </div>
      )}
    </div>
  </div>
  )
}

export default DateInput