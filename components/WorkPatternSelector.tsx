'use client';
import React from 'react';
import { WorkPatternSelectorProps } from '@/types';

const WorkPatternSelector = ({
  workPattern,
  handleWorkPatternChange,
  isWPSelected,
  setDisplayAll,
  setIsClicked
}: WorkPatternSelectorProps) => {

  const handleChange = (day: string) => {
    handleWorkPatternChange(day)
    setDisplayAll(false);
    setIsClicked(false);
  }

  return (
    <div className="flex flex-col flex-wrap">
      <div className="flex flex-row flex-wrap items-center">
        {Object.keys(workPattern).map((day,num) => (
        <form key={day} className={`flex items-center ${num === 0 ?`py-3 pr-3` : `p3 pr-3`}`}>
            <input
              type="checkbox"
              id={`workPatternDay${day}${num}`}
              checked={workPattern[day]}
              onChange={() => handleChange(day)}
              className="mr-2 text-black-900 w-4 h-4 hover:cursor-pointer"
              name={`workPatternDay${day}${num}`}
            />
            <label className="font-bold" htmlFor={`workPatternDay${day}${num}`}>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
        </form>
        ))}
      </div>
      <div className="text-center">
        {!isWPSelected && (
          <p className="font-bold italic">Please choose a work pattern</p>
        )}
      </div>
    </div>
  );
};

export default WorkPatternSelector;
