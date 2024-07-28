'use client';
import React, { useEffect, useState, useRef } from 'react';
import { DateInputProps } from '@/types';
import functions from "../functions";
const { isFirefox, beyondLTE_EndDate } = functions;

const DateInput = ({ 
  inputTitle, inputValue, onChange, 
  onBlur, error, inputRef, onFocus, 
  text, setValue, setDisplayAll, customStyle }: DateInputProps) => {

  const [hover, setHover] = useState<boolean>(false);
  const [isFirefoxBrowser, setIsFirefoxBrowser] = useState(false);

  const onClick = () => {
    if(setDisplayAll){
      setDisplayAll(false);
    }
    if(setValue){
      setValue("");
    }
    if(inputRef?.current){
      inputRef.current.focus();
    }
  }

useEffect(() => {
  const handleDragStart = (e: DragEvent) => {
  e.preventDefault();
  };

  const inputElement = inputRef?.current;
  if (inputElement) {
    inputElement.addEventListener('dragstart', handleDragStart);
  }

  return () => {
    if (inputElement) {
      inputElement.removeEventListener('dragstart', handleDragStart);
    }
  };
}, [inputRef]);

useEffect(() => {
  setIsFirefoxBrowser(isFirefox());
}, []);

  return (
    <div className="flex flex-col mb-4 w-full" 
         draggable="false"
     >
      <div className="flex flex-col border-box" >
        <label htmlFor={inputTitle} 
         draggable={false}
          className="block text-black-900 text-md font-bold mb-2" >
          {inputTitle}
        </label>
        <div className="flex flex-row relative w-full"
         draggable={false}
         >
          <input
            draggable={false}
            type="text"
            id={inputTitle}
            value={inputValue}
            onChange={onChange}
            ref={inputRef}
            onBlur={onBlur}
            className={`no-select no-drag w-full border rounded-lg py-2 px-3 pr-12 font-bold text-black-900 ${error && !isFirefoxBrowser ? ' border-red-500' : ''}`}
            onFocus={onFocus && onFocus}
            name={inputTitle}
            style={customStyle && customStyle}
            placeholder="12/12/2023"
          />
          { inputValue.length > 0 && (
            <img 
              draggable="false"
              className={`absolute top-1 right-1 rounded-3xl ${hover && "big-size"}`}
              src={hover ? `/cross.svg`:`/crossStatic.svg`} 
              alt="Cross Icon" 
              width={35}
              height={35}
              onClick={onClick}
              onMouseEnter={()=> setHover(true)}
              onMouseLeave={()=> setHover(false)}  
              
            />
            )
          }
        </div>
        { text && (
          <p className='pt-2' draggable={false}>{text}</p>
        )
        }
      </div>
      {error && (
        <div className="flex-1 my-3" draggable={false}>
          <p  draggable={false} className="text-red-700 font-bold text-xs italic">
            Invalid input format
          </p>
        </div>
      )}
    </div>
  )
}

export default DateInput