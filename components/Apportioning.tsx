'use client';
import React, { useState,useEffect, ChangeEvent, useRef, RefObject } from 'react';

import functions from "../functions";
const { createDateFormat, replaceCommas, overlapDateRangeString,  convertToInitialDateFormat, dateOnBlur, handleEarningsOnBlur, earningsRegex, countDays, countWorkDays } = functions;
import {  PatternOfWorkInput } from "../types";
import { DateInput, Output, DayToggle } from '.';

const EzyApportioning = () => {
  const [grossEarnings, setGrossEarnings] = useState<string>("0.00");
  const earningsRef = useRef<HTMLInputElement>(null);
  const grossStartDateRef = useRef<HTMLInputElement>(null);
  const grossEndDateRef = useRef<HTMLInputElement>(null);
  const pwcStartDateRef = useRef<HTMLInputElement>(null);
  const pwcEndDateRef = useRef<HTMLInputElement>(null);
  const [incapacity, setIncapacity] = useState<object>({ dofi: true, dosi: false} );
  //input dates gross earnings
  const [grossEarningsStartDate, setGrossEarningsStartDate] = useState<string>('');
  const [grossEarningsEndDate, setGrossEarningsEndDate] = useState<string>('');
  const [isGrossEarningCompleted, setIsGrossEarningCompleted] = useState<boolean>(false);
  //gross input date errors
  const [grossEarningsInputError, setGrossEarningsInputError] = useState<boolean>(false);
  const [grossStartDateError, setGrossStartDateError] = useState<boolean>(false)
  const [grossEndDateError, setGrossEndDateError] = useState<boolean>(false);
  //gross completed boolean
  const [isGrossStartDateCompleted, setIsGrossStartDateCompleted] = useState<boolean>(false);
  const [isGrossEndDateCompleted, setIsGrossEndDateCompleted] = useState<boolean>(false);
  //pwc input dates
  const [pwcStartDate, setPwcStartDate] = useState<string>('');
  const [pwcEndDate, setPwcEndDate] = useState<string>('');
  //pwc error input dates
  const [pwcStartError, setPwcStartError] = useState<boolean>(false)
  const [pwcEndError, setPwcEndError] = useState<boolean>(false)
  const [pwcStartCompleted, setPwcStartCompleted] = useState<boolean>(false);
  const [pwcEndCompleted, setPwcEndCompleted] = useState<boolean>(false);
  //counted days for work pattern 
  const [singleDayGrossWP, setSingleDayGrossWP] = useState<string>("0");
  const [totalGrossForPeriodReduction, setTotalGrossForPeriodReduction] = useState<string>("0");
  const [daysCounted, setDaysCounted] = useState<string>("0");
  const [workPatternDaysCounted, setWorkPatternDaysCounted] = useState<string>("0");
  const [countDaysOverlapWithPWC, setCountDaysOverlapWithPWC] = useState<string>("0");
  const [dateRangeWithPWC, setDateRangeWithPWC] = useState({
    start: "",
    end: ""
  });
  const [isWPSelected, setIsWPSelected] = useState<boolean>(false);
  const [isAllFieldEntered, setIsAllFieldEntered] = useState<boolean>(false);
    
  const initialPattern: PatternOfWorkInput = {
      sunday: '',
      monday: 'full',
      tuesday: 'full',
      wednesday: 'full',
      thursday: 'full',
      friday: 'full',
      saturday: '',
  };

  const [displayAll, setDisplayAll] = useState<boolean>(false);
  const [workPattern, setWorkPattern] = useState<PatternOfWorkInput>(initialPattern);

  const [workDays, setWorkDays] = useState<number>(0);

  const handleWorkPatternChange = (day: keyof PatternOfWorkInput, type: string) => {
      setWorkPattern(prevPattern => ({
      ...prevPattern,
      [day]: type === prevPattern[day] ? '' : type,
      }));
  };

  const isAllFieldCompleted = ():boolean => {
    if(isGrossStartDateCompleted && isGrossEndDateCompleted && pwcStartCompleted && pwcEndCompleted && isWPSelected && grossEarnings !== "0.00"){
      setDisplayAll(true);
      return true;
    }else{
      return false;
    }
  } 

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = () => {
    setDisplayAll(false);
    setIsAllFieldEntered(false);       
  }
    
  const handleGrossEarningsFocus = (): void => {
      setIsAllFieldEntered(false);
      setGrossEarningsInputError(false);
      setDisplayAll(false);
      // Clear the input if the value 
      if (grossEarnings === '0.00' ||  grossEarnings === "NaN" || grossEarnings === "NaN.00" || grossEarnings === ".00" ) {
          setGrossEarnings('');
      } else if (grossEarnings.includes('.') && grossEarnings.endsWith('.00')) {
          // Remove '.00' if the decimal part is '00'
          setGrossEarnings(grossEarnings.split('.')[0]);
      } else if (!grossEarnings.includes('.')) {
          // Add '.00' if no dot and decimal places are present
          setGrossEarnings(`${grossEarnings}.00`);
      }
  };
    
  const onChange = (e: ChangeEvent<HTMLInputElement>, setValue: Function, inputRef: RefObject<HTMLInputElement>, setError: Function, setCompleted?: Function) => {
    let inputValue = e.target.value;
    if(inputRef.current === earningsRef.current){
      if(inputValue === ""){
        inputValue = "0.00";
      }
      setError(false);
      setValue(inputValue);
    }
    else if(setCompleted && inputRef.current){
      setValue(inputValue);
      setCompleted(true);  
    }
  }
    
    const onSubmitErrorSet = () => {
      if(!earningsRegex.test(grossEarnings) || grossEarnings === "0.00"){
        setGrossEarningsInputError(true);
      }
      if(isGrossStartDateCompleted === false){
        setGrossStartDateError(true);
      }
      if(isGrossEndDateCompleted === false){
        setGrossEndDateError(true);
      }
      if(pwcStartCompleted === false){
        setPwcStartError(true);
      }
      if(pwcEndCompleted === false){
        setPwcEndError(true);
      }
      return;
    }

    const onSubmit = async () => {
      onSubmitErrorSet();
      let isAllFilled = isAllFieldCompleted();
      if(isAllFilled){
          
          const daysCountNoWp = countDays(grossEarningsStartDate, grossEarningsEndDate);
          setDaysCounted(daysCountNoWp.toString());
          //convert date format from dd/mm/yyy to yyyy/mm/dd as it is more accurate for counting days, eg april was 1 day off using original format
          const grossDateStart =  createDateFormat(grossEarningsStartDate) ?? new Date(grossEarningsStartDate);
          const grossDateEnd =  createDateFormat(grossEarningsEndDate) ?? new Date(grossEarningsEndDate);
          const daysCountWp =  countWorkDays(new Date(grossDateStart), new Date(grossDateEnd), workPattern);
          //converting string to number and replacing commas with empty string for the purpose of calculating
          const grossEarningsNum = Number(replaceCommas(grossEarnings));
          const singleDayGrossWP = Number(grossEarningsNum/daysCountWp);
          setSingleDayGrossWP(singleDayGrossWP.toString());
          const tempTotalGrossReduction = Number(singleDayGrossWP * daysCountWp);
          setTotalGrossForPeriodReduction(tempTotalGrossReduction.toString());
          setWorkPatternDaysCounted(daysCountWp.toString()); 
          //finding start and end date for overlap
          const tempObject =  overlapDateRangeString(grossEarningsStartDate,grossEarningsEndDate, pwcStartDate, pwcEndDate);
          const { start, end } = tempObject;
          const wage_pwc_overlap_days =  countWorkDays(new Date(start), new Date(end), workPattern);
          const totalOverlapReduction = singleDayGrossWP * wage_pwc_overlap_days;
          setCountDaysOverlapWithPWC(wage_pwc_overlap_days.toString());
          setTotalGrossForPeriodReduction(totalOverlapReduction.toString());
          //converting date format back to original format dd/mm/yyyy
          const originalDateFormat = convertToInitialDateFormat(start, end);
          setDateRangeWithPWC({
            start: originalDateFormat.start,
            end: originalDateFormat.end
          });
          setIsAllFieldEntered(true);
          setDisplayAll(true);
    }else {
      setIsAllFieldEntered(false);
    }

  }

  useEffect(() => {
    const isAtLeastOneDaySelected = (pattern: PatternOfWorkInput): boolean => {
      return Object.values(pattern).some((value) => value === "half" || value ==="full");
    };

    let selected = isAtLeastOneDaySelected(workPattern);
    setIsAllFieldEntered(false);
    if(selected){
      setIsWPSelected(true);
    }else {
      setIsWPSelected(false);
    }
  }, [workPattern]);

  const { start, end } = dateRangeWithPWC;
  const tempObject = {
    grossEarnings,
    grossEarningsStartDate,
    grossEarningsEndDate,
    daysCounted,
    workPatternDaysCounted,
    pwcStartDate,
    pwcEndDate,
    start,
    end,
    countDaysOverlapWithPWC,
    totalGrossForPeriodReduction,
    singleDayGrossWP
  }
  return (
    <div className="flex flex-1 box-border min-h-screen flex-col">
      <p className='text-2xl font-bold italic mb-5'>PWC Apportioning</p>
      <div className="flex flex-col">
        <div className="flex flex-row ">
          <div>
            <div className="flex flex-row">
              <div className="flex justify-end items-end">
                <span className='font-bold'>Full</span>
              </div>
              <div className="flex flex-row">
                {Object.keys(initialPattern).map((day, index) => (
                  <div key={`${index} ${workPattern[day as keyof PatternOfWorkInput]}`} > 
                    <DayToggle
                      dayType='full'
                      index={index}
                      key={day}
                      day={day as keyof PatternOfWorkInput}
                      type={workPattern[day as keyof PatternOfWorkInput]}
                      handleWorkPatternChange={handleWorkPatternChange}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className='flex flex-row'>
              <div className="flex items-end justify-end">
                <span className='font-bold'>Half</span>
              </div>
              <div  className="flex flex-row justify-center items-center">
                {Object.keys(initialPattern).map((day, index) => (
                  <div 
                    key={`${index} ${workPattern[day as keyof PatternOfWorkInput]}`} 
                    className='flex items-center justify-center'
                  > 
                    <DayToggle
                      dayType='half'
                      index={index}
                      key={day}
                      day={day as keyof PatternOfWorkInput}
                      type={workPattern[day as keyof PatternOfWorkInput]}
                      handleWorkPatternChange={handleWorkPatternChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mb-5">
        { !isWPSelected && (
          <p className='font-bold italic'>Please choose a work pattern</p>
        )
        }
      </div>
      <div className="flex flex-col w-full mb-4 space-x-4" style={{ maxWidth: "300px" }}>
        <div className="">
          <label htmlFor="grossEarnings" className="block text-black-900 text-sm font-bold mb-2">
            Gross Earnings
          </label>
          <input
            type="text"
            id={`grossEarnings`}
            ref={earningsRef}
            value={grossEarnings}
            onChange={(e) => onChange(e, setGrossEarnings, earningsRef, setGrossEarningsInputError)}
            onBlur={() => handleEarningsOnBlur(grossEarnings,setGrossEarnings,setGrossEarningsInputError, setIsGrossEarningCompleted)}
            onFocus={handleGrossEarningsFocus}
            className={`w-full border rounded py-2 px-3 text-black-900$ {grossEarningsInputError ? 'border-red-500' : ''}`}
            style={{ maxWidth: "300px" }}
          />
        </div>
        {grossEarningsInputError && (
          <div className="my-3">
            <p className="text-red-700 font-bold text-xs italic">Please add a value</p>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="mb-5">
          <p className='font-bold mb-2'>Acceptable date formats for input field</p>
          <p className='text-sm italic'>011123 or 01112023 or 1/11/2023 or 1/11/23 or 01/11/23 or 01/11/2023</p>
        </div>
        <div className="flex flex-row w-full mb-4 space-x-5">
          <DateInput 
            inputTitle="Gross Earnings Start Date" inputValue={grossEarningsStartDate} 
            onChange={(e) => onChange( e, setGrossEarningsStartDate,  grossStartDateRef, setGrossStartDateError, setIsGrossStartDateCompleted )} 
            onBlur={() => dateOnBlur({ dateValue: grossEarningsStartDate, setDateValue: setGrossEarningsStartDate, setDateError: setGrossStartDateError, setDateCompleted: setIsGrossStartDateCompleted, setDisplayAll })} 
            error={grossStartDateError} inputRef={grossStartDateRef} 
            onFocus={handleFocus}
          />
          <DateInput 
            inputTitle="Gross Earnings End Date" inputValue={grossEarningsEndDate} 
            onChange={(e) => onChange( e, setGrossEarningsEndDate,  grossEndDateRef, setGrossEndDateError, setIsGrossEndDateCompleted )} 
            onBlur={() => dateOnBlur({ dateValue: grossEarningsEndDate, setDateValue: setGrossEarningsEndDate, setDateError: setGrossEndDateError, setDateCompleted: setIsGrossEndDateCompleted, setDisplayAll })} 
            error={grossEndDateError} inputRef={grossEndDateRef} 
            onFocus={handleFocus}
          />
        </div>
        <div className="flex flex-row w-full mb-4 space-x-5">
          <DateInput 
            inputTitle="PWC Start Date" inputValue={pwcStartDate} 
            onChange={(e) => onChange( e, setPwcStartDate,  pwcStartDateRef, setPwcStartError, setPwcStartCompleted )} 
            onBlur={() => dateOnBlur({ dateValue: pwcStartDate, setDateValue: setPwcStartDate, setDateError: setPwcStartError, setDateCompleted: setPwcStartCompleted , setDisplayAll })} 
            error={pwcStartError} inputRef={pwcStartDateRef} 
            onFocus={handleFocus}
          />
          <DateInput 
            inputTitle="PWC  End Date" inputValue={pwcEndDate} 
            onChange={(e) => onChange( e, setPwcEndDate,  pwcEndDateRef, setPwcEndError, setPwcEndCompleted )} 
            onBlur={() => dateOnBlur({ dateValue: pwcEndDate, setDateValue: setPwcEndDate, setDateError: setPwcEndError, setDateCompleted: setPwcEndCompleted, setDisplayAll })} 
            error={pwcEndError} inputRef={pwcEndDateRef} 
            onFocus={handleFocus}
          />
        </div>
        <div className='mb-5'>
          <button 
            className="font-bold italic text-lg p-3 rounded-md bg-green-300 hover:bg-green-700 hover:text-white"
            onClick={onSubmit}> Calculate 
          </button>
        </div>
        { isAllFieldEntered && displayAll ? (
          <Output {...tempObject}/>
        ):
        (
          <div className="">
            <p className={`font-bold ${!isAllFieldEntered? 'text-red-700' : 'text-black-900'}`}> Please fill out all input fields </p>
          </div>
        )
       }
      </div>
    </div>
  )
}

export default EzyApportioning