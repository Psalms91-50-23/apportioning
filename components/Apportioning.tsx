'use client';

import React, { useState,useEffect, ChangeEvent, useRef, RefObject } from 'react';
import {  differenceInDays } from "date-fns";
import functions from "../functions";
const { createDateFromFormat, formatDate, validateDate, replaceCommas, formatStringNumberWithCommas, sanitizeInput, overlapDateRangeString,  convertToInitialDateFormat, grossEarningInputValueConverted } = functions;
import { PatternOfWork } from "../types";

const Apportioning = () => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(?:[0-9]{2})?[0-9]{2}$/;
    const earningsRegex = /^(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?|\.\d{1,2})$/ ;
    let includeLastDay = 1;
    //gross earnings and wp checkbox
    const [grossEarnings, setGrossEarnings] = useState<string>("0.00");
    // const [grossEarningsFormat, setGrossEarningsFormat] = useState<boolean>(false);
    const daysOfWeek: string[] = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

    //counted days for work pattern 1 day
    const [singleDayGrossWP, setSingleDayGrossWP] = useState<string>("0");
    const [totalGrossForPeriodReduction, setTotalGrossForPeriodReduction] = useState<string>("0");
    // const [isTotalGrossReductionCompleted, setIsTotalGrossReductionCompleted] = useState<boolean>(false);

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

    const validateAndSetGrossEarnings = (inputValue: string, setGrossEarnings: Function, setErrorGrossEarnings: Function): void => {
      // Only show an error if there is an input
      if (inputValue.trim().length > 0) {
        // Assume you want to allow only numbers with a maximum of two decimal places
        const regex = /^\d+(\.\d{1,})?$/;
    
        if (!regex.test(inputValue)) {
          setGrossEarnings('');
          setErrorGrossEarnings(true);
          setGrossEarningsInputError(false);
          // setGrossEarningsFormat(false);
          return;
        }
      }      
      // Update state only if there is no error
      setGrossEarnings(inputValue);
      setErrorGrossEarnings(false);
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

    const handleFocus = () => {
        setIsAllFieldEntered(false);       
    }
    
    const handleGrossEarningsFocus = (): void => {
        setIsAllFieldEntered(false);
        setGrossEarningsInputError(false);
        // Clear the input if the value is '0.00'
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

    const handleGrossEarningsBlur = (grossEarnings: string, setGrossEarnings: Function,   setErrorGrossEarnings: Function): void => {
      validateAndSetGrossEarnings(grossEarnings, setGrossEarnings, setErrorGrossEarnings);
      let formattedInput = grossEarnings.trim(); // Trim leading/trailing whitespaces
      formattedInput = grossEarningInputValueConverted(formattedInput);
      // let finalValue = formatNumber(formattedInput);
      if (!formattedInput || !earningsRegex.test(formattedInput)){
          // If input is empty, set default value
          formattedInput = '0.00';
          setGrossEarnings(formattedInput);
          setGrossEarningsInputError(true);
          setIsGrossEarningCompleted(false);
          return;
      }
      else {
          // Add a dot with two zeros if there is no dot in the input
          if (!formattedInput.includes('.')) {
              formattedInput += '.00';
          }
          // Handle decimal part
          const decimalIndex = formattedInput.indexOf('.');
          const digitsAfterDecimal = formattedInput.length - decimalIndex - 1;
  
          if (digitsAfterDecimal === 0) {
              // Add '00' if there are no digits after the decimal point
              formattedInput += '00';
          } else if (digitsAfterDecimal === 1) {
              // Add '0' if there is only one digit after the decimal point
              formattedInput += '0';
          } else if (digitsAfterDecimal > 2) {
              // Round the number to two decimal places if more than 2 digits after the decimal point
              formattedInput = `${(+formattedInput).toFixed(2)}`;
          }
          // Add the new condition to remove leading zeros for specific cases
          if (/^0+\d[1-9]\.\d$/.test(formattedInput)) {
              formattedInput = formattedInput.replace(/^0+/, ''); // Remove leading zeros
          }
      }
      //removing unwanted $ sign
      let santizedGrossInputs = sanitizeInput(formattedInput);
      //adding commas to make it separate for each 1,000
      // formattedInput = numberWithCommas(santizedGrossInputs);
      formattedInput = grossEarningInputValueConverted(santizedGrossInputs);
      // Update state
      setErrorGrossEarnings(false);
      setGrossEarnings(formattedInput);
      setIsGrossEarningCompleted(true);
      setGrossEarningsInputError(false);
    };
    
    const grossStartDateOnBlur = () => {
        
      if(grossEarningsStartDate === ""){
        setGrossStartDateError(false);
        setIsGrossStartDateCompleted(false);
        return;
      }
      
      let isDateValid = validateDate(grossEarningsStartDate);
      if(!isDateValid){
        setGrossStartDateError(true);
      }
      setGrossStartDateError(false);
      // Remove whitespaces and format the input
      const formattedInput = grossEarningsStartDate.replace(/\s/g, '');
      let dateFormatted = formatDate(formattedInput, setGrossStartDateError);
      // Test if the input matches any of the specified formats
      if (dateRegex.test(dateFormatted)) {
        // If it matches, set isComplete to true and update the input state
        setIsGrossStartDateCompleted(true);
        setGrossEarningsStartDate(dateFormatted);
        setGrossStartDateError(false);
      } else {
        // If it doesn't match, set isComplete to false and setError to true
        setIsGrossStartDateCompleted(false);
        setGrossStartDateError(true);
      }
    }

    const grossEndDateOnBlur = () => {
      
      if(grossEarningsEndDate === ""){
        setGrossEndDateError(false);
        setIsGrossEndDateCompleted(false);
        return;
      }
      let isDateValid = validateDate(grossEarningsEndDate);
      if(!isDateValid){
        setGrossEndDateError(true);
      }
      setGrossEndDateError(false);
      // Remove whitespaces and format the input
      const formattedInput = grossEarningsEndDate.replace(/\s/g, '');
      let dateFormatted = formatDate(formattedInput,setGrossEndDateError);
      // Test if the input matches any of the specified formats
      if (dateRegex.test(dateFormatted)) {
        // If it matches, set isComplete to true and update the input state
        setIsGrossEndDateCompleted(true);
        setGrossEarningsEndDate(dateFormatted);
        setGrossEndDateError(false);
      } else {
          // If it doesn't match, set isComplete to false and setError to true
        setIsGrossEndDateCompleted(false);
        setGrossEndDateError(true);
      }
    }       

    const pwcStartDateOnBlur = () => {
    
      if(pwcStartDate === ""){
        setPwcStartError(false);
        setPwcStartCompleted(false);
        return;
      }
      let isDateValid = validateDate(pwcStartDate);
      if(!isDateValid){
        setPwcStartError(true);
      }
      setPwcStartError(false);
      // Remove whitespaces and format the input
      const formattedInput = pwcStartDate.replace(/\s/g, '');
      let dateFormatted = formatDate(formattedInput, setPwcStartError);
      // Test if the input matches any of the specified formats
      if (dateRegex.test(dateFormatted)) {
        // If it matches, set isComplete to true and update the input state
        setPwcStartCompleted(true);
        setPwcStartDate(dateFormatted);
        setPwcStartError(false);
      } else {
        // If it doesn't match, set isComplete to false and setError to true
        setPwcStartCompleted(false);
        setPwcStartError(true);
      }
    };

    const pwcEndDateOnBlur = () => {
      
      if(pwcEndDate === ""){
        setPwcEndError(false);
        setPwcEndCompleted(false);
        return;
      }
      let isDateValid = validateDate(pwcEndDate);
      if(!isDateValid){
        setPwcEndError(true);
      }
      setPwcEndError(false);
      // Remove whitespaces and format the input
      const formattedInput = pwcEndDate.replace(/\s/g, '');
      let dateFormatted = formatDate(formattedInput, setPwcEndError);
      // Test if the input matches any of the specified formats
      if (dateRegex.test(dateFormatted)) {
        // If it matches, set isComplete to true and update the input state
        setPwcEndCompleted(true);
        setPwcEndDate(dateFormatted);
        setPwcEndError(false);
      } else {
        // If it doesn't match, set isComplete to false and setError to true
        setPwcEndCompleted(false);
        setPwcEndError(true);
      }
    };

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
  
    const isCompleted = ():boolean => {
      if(isGrossStartDateCompleted && isGrossEndDateCompleted && pwcStartCompleted && pwcEndCompleted && isGrossEarningCompleted){
        return true;
      }
      return false;
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
            id="grossEarnings"
            ref={earningsRef}
            value={grossEarnings}
            onChange={(e) => onChange(e, setGrossEarnings, earningsRef, setGrossEarningsInputError)}
            // onChange={(e) => setGrossEarnings(e.target.value)}
            onBlur={() => handleGrossEarningsBlur(grossEarnings,setGrossEarnings,setGrossEarningsInputError)}
            onFocus={handleGrossEarningsFocus}
            className={`w-full border rounded py-2 px-3 text-black-900${grossEarningsInputError ? ' border-red-500' : ''}`}
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
          <div className='flex flex-col' style={{ maxWidth: "300px" }}>
            <label htmlFor="grossEarningsStartDate" className="block text-black-900 text-sm font-bold mb-2">
                Gross Earnings Start Date
            </label>
            <input
              type="text"
              id="grossEarningsStartDate"
              value={grossEarningsStartDate}
              onChange={(e) => onChange(e, setGrossEarningsStartDate, grossStartDateRef,setGrossStartDateError, setIsGrossStartDateCompleted)}
              ref={grossStartDateRef}
              // onChange={(e) => setGrossEarningsStartDate(e.target.value)}
              onBlur={grossStartDateOnBlur}
              onFocus={handleFocus}
              className={`w-full border rounded py-2 px-3 text-black-900${grossStartDateError ? ' border-red-500' : ''}`}
            />
            {grossStartDateError && (
              <div className="my-3">
              <p className="text-red-700 font-bold text-xs italic">Invalid input format</p>
              </div>
            )}
          </div>
          <div className="flex flex-row w-full mb-4" style={{ maxWidth: "300px" }}>
            <div className="flex flex-col">
              <label htmlFor="grossEarningsEndDate" className="block text-black-900 text-sm font-bold mb-2">
                  Gross Earnings End Date
              </label>
              <input
                type="text"
                id="grossEarningsEndDate"
                value={grossEarningsEndDate}
                onChange={(e) => onChange(e, setGrossEarningsEndDate, grossEndDateRef,setGrossEndDateError, setIsGrossEndDateCompleted)}
                ref={grossEndDateRef}
                // onChange={(e) => setGrossEarningsEndDate(e.target.value)}
                onBlur={grossEndDateOnBlur}
                onFocus={handleFocus}
                className={`w-full border rounded py-2 px-3 text-black-900${grossEndDateError ? ' border-red-500' : ''}`}
              />
            {grossEndDateError && (
              <div className="my-3">
              <p className="text-red-700 font-bold text-xs italic">Invalid input format</p>
              </div>
            )}
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-5">
          <div className="flex flex-row mb-4 ">
            <div  className="flex flex-col w-full"style={{ maxWidth: "300px" }}>
              <label htmlFor="pwcStartDate" className="block text-black-900 text-sm font-bold mb-2">
                  PWC Start Date
              </label>
              <input
                type="text"
                id="pwcStartDate"
                value={pwcStartDate}
                onChange={(e) => onChange(e, setPwcStartDate, grossEndDateRef,setPwcStartError, setPwcStartCompleted)}
                ref={pwcStartDateRef}
                // onChange={(e) => setPwcStartDate(e.target.value)}
                onBlur={pwcStartDateOnBlur}
                onFocus={handleFocus}
                className={`w-full border rounded py-2 px-3 text-black-900${pwcStartError ? ' border-red-500' : ''}`}
                style={{ maxWidth: "300px" }}
              />
            {pwcStartError && (
              <div className="my-3">
              <p className="text-red-700 font-bold text-xs italic">Invalid input format</p>
              </div>
            )}
            </div>
          </div>
          <div className="flex flex-row w-full space-x-4 mb-9" style={{ maxWidth: "300px" }}>
            <div className="flex flex-col">
              <label htmlFor="pwcEndDate" className="block text-black-900 text-sm font-bold mb-2">
                  PWC End Date
              </label>
              <input
                type="text"
                id="pwcEndDate"
                value={pwcEndDate}
                onChange={(e) => onChange(e, setPwcEndDate, pwcEndDateRef,setPwcEndError, setPwcEndCompleted)}
                ref={pwcEndDateRef}
                // onChange={(e) => setPwcEndDate(e.target.value)}
                onBlur={pwcEndDateOnBlur}
                onFocus={handleFocus}
                className={`w-full border rounded py-2 px-3 text-black-900${pwcEndError ? ' border-red-500' : ''}`}
                style={{ maxWidth: "300px" }}
              />
              {pwcEndError && (
                <div className="my-3">
                <p className="text-red-700 font-bold text-xs italic">Invalid input format</p>
                </div>
              )}
            </div>
          </div> 
        </div>
        <div className='mb-5'>
          <button 
            className="font-bold italic text-lg p-3 rounded-md bg-green-300 hover:bg-green-700 hover:text-white"
            onClick={onSubmit}> Calculate 
          </button>
        </div>
        { (isAllFieldEntered)? (
          <div className="">
            <div className="">
              <p className="font-bold">Normal wages date range</p>
              <p>{grossEarningsStartDate} — {grossEarningsEndDate}</p>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row space-x-5">
                <div className="flex flex-row">
                  <p className="font-bold">
                      Days counted for above dates: 
                  </p>
                  <p className="italic ml-3">
                      {daysCounted}
                  </p>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold">
                      Days counted for above dates based on work pattern: 
                  </p>
                  <p className="italic ml-3">
                      {workPatternDaysCounted}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold">
                    Single day gross earnings based on work pattern calculations: 
                </p>
                <p>
                    ${grossEarnings} / {workPatternDaysCounted} = ${formatStringNumberWithCommas(singleDayGrossWP)}
                </p>
              </div>
            </div>
            <div className="">
              <p className="font-bold">
                Previous weekly compensation date range
              </p>
              <p>{pwcStartDate} — {pwcEndDate}</p>
            </div>
            <div className="">
              <p className="font-bold">
                Normal wage and previous weekly compensation date overlap
              </p>
              <p>{start} — {end}  {formatStringNumberWithCommas(countDaysOverlapWithPWC)} {Number(countDaysOverlapWithPWC) > 1 ? "days" : "day"} overlap based on work pattern</p> 
              <p>{countDaysOverlapWithPWC} * ${formatStringNumberWithCommas(singleDayGrossWP)} = ${formatStringNumberWithCommas(totalGrossForPeriodReduction)}</p>
            </div>
          </div>
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
