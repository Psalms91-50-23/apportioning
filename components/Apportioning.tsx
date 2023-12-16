'use client';

import React, { useState,useEffect, ChangeEvent, useRef, RefObject } from 'react';
import {  differenceInDays } from "date-fns";
import functions from "../functions";
const { createDateFromFormat, replaceCommas, overlapDateRangeString,  convertToInitialDateFormat, dateOnBlur, handleEarningsOnBlur, earningsRegex, includeLastDay } = functions;
import { PatternOfWork } from "../types";
import { DateInput, Output } from '.';

const Apportioning = () => {
    const [grossEarnings, setGrossEarnings] = useState<string>("0.00");
    const earningsRef = useRef<HTMLInputElement>(null);
    const grossStartDateRef = useRef<HTMLInputElement>(null);
    const grossEndDateRef = useRef<HTMLInputElement>(null);
    const pwcStartDateRef = useRef<HTMLInputElement>(null);
    const pwcEndDateRef = useRef<HTMLInputElement>(null);
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
    const initialWorkPattern: PatternOfWork = {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      };

    const [workPattern, setWorkPattern] = useState<PatternOfWork>(initialWorkPattern);
    const handleWorkPatternChange = (day: keyof PatternOfWork): void => {
      setWorkPattern((prevWorkPattern) => ({
        ...prevWorkPattern,
        [day]: !prevWorkPattern[day],
      }));
    };

    const countDays = (startDateString: string, endDateString: string): number => {
      let tempStartDate = createDateFromFormat(startDateString) ?? new Date(startDateString) ;
      let tempEndDate = createDateFromFormat(endDateString) ?? new Date(endDateString);
      let daysCounted: number = (differenceInDays(tempEndDate, tempStartDate))+includeLastDay;
      return daysCounted;
    }; 

    const isAllFieldCompleted = ():boolean => {
      if(isGrossStartDateCompleted && isGrossEndDateCompleted && pwcStartCompleted && pwcEndCompleted && isWPSelected && grossEarnings !== "0.00"){
        return true;
      }else{
        return false;
      }
    }

    const countWorkDays = (startDate: Date, endDate: Date, workPattern: PatternOfWork): number => {
      let count = 0;
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        const dayKey = Object.keys(workPattern)[dayOfWeek] as keyof PatternOfWork;
    
        if (workPattern[dayKey]) {
          count++;
        }
        // Increment the date by one day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return count;
    };  

    const handleFocus: React.FocusEventHandler<HTMLInputElement> = () => {
        setIsAllFieldEntered(false);       
    }
    
    const handleGrossEarningsFocus = (): void => {
        setIsAllFieldEntered(false);
        setGrossEarningsInputError(false);
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
          const grossDateStart =  createDateFromFormat(grossEarningsStartDate) ?? new Date(grossEarningsStartDate);
          const grossDateEnd =  createDateFromFormat(grossEarningsEndDate) ?? new Date(grossEarningsEndDate);
          const daysCountWp =  countWorkDays(grossDateStart,grossDateEnd, workPattern);
          //converting string to number and replacing commas with empty string for the purpose of calculating
          const grossEarningsNum = Number(replaceCommas(grossEarnings));
          const singleDayGrossWP = Number(grossEarningsNum/daysCountWp);
          setSingleDayGrossWP(singleDayGrossWP.toString());
          const tempTotalGrossReduction = Number(singleDayGrossWP * daysCountWp);
          setTotalGrossForPeriodReduction(tempTotalGrossReduction.toString());
          setWorkPatternDaysCounted(daysCountWp.toString()); 
          //finding start and end date for overlap
          const tempOject =  overlapDateRangeString(grossEarningsStartDate,grossEarningsEndDate, pwcStartDate, pwcEndDate);
          const start  = new Date(tempOject.start);
          const end = new Date(tempOject.end);
          const wage_pwc_overlap_days =  countWorkDays(start, end, workPattern);
          const totalOverlapReduction = singleDayGrossWP * wage_pwc_overlap_days;
          setCountDaysOverlapWithPWC(wage_pwc_overlap_days.toString());
          setTotalGrossForPeriodReduction(totalOverlapReduction.toString());
          //converting date format back to original format dd/mm/yyyy
          const originalDateFormat = convertToInitialDateFormat(tempOject.start, tempOject.end);
          setDateRangeWithPWC({
            start: originalDateFormat.start,
            end: originalDateFormat.end
          });
          setIsAllFieldEntered(true);
    }else {
      setIsAllFieldEntered(false);
    }

  }

  useEffect(() => {
    const isAtLeastOneDaySelected = (pattern: PatternOfWork): boolean => {
      return Object.values(pattern).some((value) => value === true);
    };
    setIsAllFieldEntered(false);
    let selected = isAtLeastOneDaySelected(workPattern);
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
      <div className="flex flex-col flex-wrap">
        <div className="flex flex-row flex-wrap items-center">
          {Object.keys(workPattern).map((day) => (
            <div key={day} className="items-center p-3">
              <input
                type="checkbox"
                id={`workPatternDay${day}`}
                checked={workPattern[day as keyof PatternOfWork]}
                onChange={() => handleWorkPatternChange(day as keyof PatternOfWork)}
                className="mr-2 text-black-900"
              />
              <label htmlFor={`workPatternDay${day}`}>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
            </div>
          ))}
        </div>
        <div className="text-center mb-5">
          { !isWPSelected && (
            <p className='font-bold italic'>Please choose a work pattern</p>
          )
          }
        </div>
      </div>
      <div className="flex flex-col w-full mb-4 space-x-4" style={{ maxWidth: "300px" }}>
        <div className="">
          <label htmlFor="grossEarnings" className="block text-black-900 text-sm font-bold mb-2">
            Gross Earnings
          </label>
          <input
            type="text"
            id={`${grossEarnings}`}
            ref={earningsRef}
            value={grossEarnings}
            onChange={(e) => onChange(e, setGrossEarnings, earningsRef, setGrossEarningsInputError)}
            // onChange={(e) => setGrossEarnings(e.target.value)}
            onBlur={() => handleEarningsOnBlur(grossEarnings,setGrossEarnings,setGrossEarningsInputError, setGrossStartDateError, setIsGrossEarningCompleted)}
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
          <p className='text-xs italic'>011123 or 01112023 or 1/11/2023 or 1/11/23 or 01/11/23 or 01/11/2023</p>
        </div>
        <div className="flex flex-row w-full mb-4 space-x-5">
          <DateInput 
            inputTitle="Gross Earnings Start Date" inputValue={grossEarningsStartDate} 
            onChange={(e) => onChange( e, setGrossEarningsStartDate,  grossStartDateRef, setGrossStartDateError, setIsGrossStartDateCompleted )} 
            onBlur={() => dateOnBlur({ dateValue: grossEarningsStartDate, setDateValue: setGrossEarningsStartDate, setDateError: setGrossStartDateError, setDateCompleted: setIsGrossStartDateCompleted })} 
            error={grossStartDateError} inputRef={grossStartDateRef} id={`${grossEarningsStartDate}`} onFocus={handleFocus}
          />
          <DateInput 
            inputTitle="Gross Earnings End Date" inputValue={grossEarningsEndDate} 
            onChange={(e) => onChange( e, setGrossEarningsEndDate,  grossEndDateRef, setGrossEndDateError, setIsGrossEndDateCompleted )} 
            onBlur={() => dateOnBlur({ dateValue: grossEarningsEndDate, setDateValue: setGrossEarningsEndDate, setDateError: setGrossEndDateError, setDateCompleted: setIsGrossEndDateCompleted })} 
            error={grossEndDateError} inputRef={grossEndDateRef} id={`${grossEarningsEndDate}`} onFocus={handleFocus}
          />
        </div>
        <div className="flex flex-row w-full mb-4 space-x-5">
          <DateInput 
            inputTitle="PWC Start Date" inputValue={pwcStartDate} 
            onChange={(e) => onChange( e, setPwcStartDate,  pwcStartDateRef, setPwcStartError, setPwcStartCompleted )} 
            onBlur={() => dateOnBlur({ dateValue: pwcStartDate, setDateValue: setPwcStartDate, setDateError: setPwcStartError, setDateCompleted: setPwcStartCompleted })} 
            error={pwcStartError} inputRef={pwcStartDateRef} id={`${pwcStartDate}`} onFocus={handleFocus}
          />
          <DateInput 
            inputTitle="PWC  End Date" inputValue={pwcEndDate} 
            onChange={(e) => onChange( e, setPwcEndDate,  pwcEndDateRef, setPwcEndError, setPwcEndCompleted )} 
            onBlur={() => dateOnBlur({ dateValue: pwcEndDate, setDateValue: setPwcEndDate, setDateError: setPwcEndError, setDateCompleted: setPwcEndCompleted })} 
            error={pwcEndError} inputRef={pwcEndDateRef} id={`${pwcEndDate}`} onFocus={handleFocus}
          />
        </div>
        <div className='mb-5'>
          <button 
            className="font-bold italic text-lg p-3 rounded-md bg-green-300 hover:bg-green-700 hover:text-white"
            onClick={onSubmit}> Calculate 
          </button>
        </div>
        { (isAllFieldEntered)? (
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

export default Apportioning