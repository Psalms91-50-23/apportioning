import React from 'react';
import { DateInputProps } from '@/types';

const DateInput = ({ inputTitle, inputValue, onChange, onBlur, error, inputRef, id, onFocus }:DateInputProps) => {
  return (
    <div className="flex flex-row mb-4 box-content" style={{ maxWidth: "300px" }}>
    <div className="flex flex-col">
      <label htmlFor="grossEarningsEndDate" className="block text-black-900 text-sm font-bold mb-2">
        {inputTitle}
      </label>
      <input
        type="text"
        id={id}
        value={inputValue}
        onChange={onChange}
        ref={inputRef}
        onBlur={onBlur}
        className={`w-full border rounded py-2 px-3 text-black-900${error ? ' border-red-500' : ''}`}
        onFocus={onFocus && onFocus}
      />
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