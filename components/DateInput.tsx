'use client';
import React, { useEffect, useState } from 'react';
import { DateInputProps } from '@/types';
import functions from "../functions";
const { isFirefox } = functions;

const DateInput = ({
  inputTitle,
  inputValue,
  onChange,
  onBlur,
  error,
  inputRef,
  onFocus,
  setValue,
  setDisplayAll,
  id
}: DateInputProps) => {

  const [isFirefoxBrowser, setIsFirefoxBrowser] = useState(false);
  const [onHover, setOnHover] = useState<boolean>(false);

  useEffect(() => {
    setIsFirefoxBrowser(isFirefox());
  }, []);

  const onClick = () => {
    if (setDisplayAll) {
      setDisplayAll(false);
    }
    if (setValue) {
      setValue("");
    }
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement | HTMLInputElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-row w-full mb-4 flex-1" 
    // style={{ maxWidth: "550px" }}
     draggable={false}>
      <form className="flex flex-col relative w-full">
        <label htmlFor={id} className="block text-black-900 text-md font-bold mb-2">
          {inputTitle}
        </label>
        <div className="flex flex-row w-full relative">
          <input
            type="text"
            placeholder='12/12/2023'
            id={id}
            name={id}
            value={inputValue}
            onChange={onChange}
            ref={inputRef}
            onBlur={onBlur}
            className={`w-full border rounded-lg py-2 px-3 pr-12 font-bold text-black-900 ${error && !isFirefoxBrowser ? 'border-red-500' : ''}`}
            onFocus={onFocus && onFocus}
            draggable={false} onDragStart={handleDragStart}
          />
          {inputValue.length > 0 && (
            <img
              className={`absolute top-1 right-1 rounded-3xl ${onHover && "big-size"}`}
              src="/cross.svg"
              alt="Cross Icon"
              width={35}
              height={35}
              onClick={onClick}
              onMouseEnter={() => setOnHover(true)}
              onMouseLeave={() => setOnHover(false)}
              draggable="false"
            />
          )}
        </div>
        {error && (
          <div className="my-3">
            <p className="text-red-700 font-bold text-xs italic">
              Invalid input format
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default DateInput;
