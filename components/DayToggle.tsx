'use client';
import React from 'react';
import { DayToggleProps } from "../types";


const DayToggle = ({ day, type, handleWorkPatternChange, index, dayType, length }: DayToggleProps) => {

  return (
    <div className="flex flex-row">
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
          <div className="flex justify-center items-center py-1 pt-2">
            { dayType === "full" && (
              <input
                className="justify-center items-center ml-2"
                type="checkbox"
                checked={type === 'full'}
                onChange={() => handleWorkPatternChange(day, type === 'full' ? '' : 'full')}
              /> 
            )
            }
            <div className="flex items-end justify-end pt-2">
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
      {/* <div className="">
        { dayType === "full" && index === length && (
          <div className="flex flex-row space-x-4 justify-end items-end m-0 p-0">
              <input
                className='flex justify-end items-end'
                type="checkbox"
                checked={type === 'half'}
                onChange={() => handleWorkPatternChange(day, type === 'half' ? '' : 'half')}
              /> 
              <p className='flex items-center'>All Full</p>
            </div>
          )
          }
          { dayType === "half" && index === length && (
            <div className="flex space-x-4 justify-center m-0 p-0">
              <input
                className='flex justify-center'
                type="checkbox"
                checked={type === 'half'}
                onChange={() => handleWorkPatternChange(day, type === 'half' ? '' : 'half')}
              /> 
              <p className='flex m-0 p-0'>All Half</p>
            </div>
            )
          }
      </div> */}
    </div>
  );
};


export default DayToggle