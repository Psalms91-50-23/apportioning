'use client';
import React from 'react';
import { DayToggleProps } from "../types";


const DayToggle = ({ day, type, handleWorkPatternChange, index, dayType }: DayToggleProps) => {

  return (
    <div className="flex flex-col items-center justify-center" style={{ minWidth: "87px"}} draggable={false}>
      <div className='flex flex-col '>
        <div className="justify-center items-center ">
          { dayType === "full" && (
            <span className='font-bold text-md'>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </span>
          )
          }
        </div>
        <div className="flex justify-center items-center py-1">
          { dayType === "full" && (
            <input
              className="justify-center items-center ml-2"
              type="checkbox"
              checked={type === 'full'}
              onChange={() => handleWorkPatternChange(day, type === 'full' ? '' : 'full')}
            /> 
          )
          }
          <div className="justify-center items-center ">
            { dayType === "half" && (
                <input
                  type="checkbox"
                  checked={type === 'half'}
                  onChange={() => handleWorkPatternChange(day, type === 'half' ? '' : 'half')}
                /> 
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};


export default DayToggle