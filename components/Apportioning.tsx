'use client';

import React, { useState,useEffect } from 'react';
import {  differenceInDays } from "date-fns";
import functions from "../functions";
const { createDateFromFormat, formatDate, validateDate, getGreaterDate, getLesserDate, replaceCommas, numberWithCommas,formatStringNumberWithCommas } = functions;
import { PatternOfWork } from "../types";


const Apportioning = () => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(?:[0-9]{2})?[0-9]{2}$/;
    let includeLastDay = 1;

    //gross earnings and wp checkbox
    const [grossEarnings, setGrossEarnings] = useState<string>("0.00");
    const [grossEarningsFormat, setGrossEarningsFormat] = useState<boolean>(false);
    const daysOfWeek: string[] = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    //input dates gross earnings
    const [grossEarningsStartDate, setGrossEarningsStartDate] = useState<string>('');
    const [grossEarningsEndDate, setGrossEarningsEndDate] = useState<string>('');

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
    //include last day
    const [isLastDayChecked, setIsLastDayChecked] = useState<boolean>(false);
    const [totalGrossForPeriodReduction, setTotalGrossForPeriodReduction] = useState<string>("0");
    // const [isTotalGrossReductionCompleted, setIsTotalGrossReductionCompleted] = useState<boolean>(false);

    const [daysCounted, setDaysCounted] = useState<string>("0");
    const [workPatternDaysCounted, setWorkPatternDaysCounted] = useState<string>("0");
    const [countDaysOverlapWithPWC, setCountDaysOverlapWithPWC] = useState<string>("0");
    const [dateRangeWithPWC, setDateRangeWithPWC] = useState({
      start: "",
      end: ""
    });
    const [isFireFox, setIsFireFox] = useState<boolean>(false);
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
            setGrossEarningsFormat(false);
            return;
          }
        }
      
        // Update state only if there is no error
        setGrossEarnings(inputValue);
        setErrorGrossEarnings(false);
      };

      const isWorkDay = (date: Date, workPattern: PatternOfWork, startOfWeek: number): boolean => {
        const dayOfWeek = date.getDay();
        const adjustedDayOfWeek = (dayOfWeek - startOfWeek + 7) % 7;
        // Ensure adjustedDayOfWeek is within the valid range
        if (adjustedDayOfWeek >= 0 && adjustedDayOfWeek < Object.keys(workPattern).length) {
          const dayKey = Object.keys(workPattern)[adjustedDayOfWeek] as keyof PatternOfWork;
          return workPattern[dayKey];
        }
        return false;
      };

    const countDays = (startDateString: string, endDateString: string): number => {

        let tempStartDate = createDateFromFormat(startDateString);
        let tempEndDate = createDateFromFormat(endDateString);
        let newTempStartDate = new Date(tempStartDate);
        let newTempEndDate = new Date(tempEndDate);
        let daysCounted: number = (differenceInDays(newTempEndDate, newTempStartDate))+includeLastDay;
        return daysCounted;
    }; 

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
  
    // setGrossEarnings(addDotIfNotPresent(sanitizedInput));
    const handleFocus = () => {
        setIsAllFieldEntered(false);
    }
    
    const handleGrossEarningsFocus = (): void => {
        setIsAllFieldEntered(false);
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

      const handleGrossEarningsBlur = (grossEarnings: string, setGrossEarnings: Function, setErrorGrossEarnings: Function): void => {
        validateAndSetGrossEarnings(grossEarnings, setGrossEarnings, setErrorGrossEarnings);
        let formattedInput = grossEarnings.trim(); // Trim leading/trailing whitespaces
        
        if (!formattedInput) {
            // If input is empty, set default value
            formattedInput = '0.00';
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
    
        formattedInput = numberWithCommas(formattedInput);
        // Update state
        setErrorGrossEarnings(false);
        setGrossEarnings(formattedInput);
        setGrossEarningsFormat(true);
    };
    

    const grossStartDateOnBlur = () => {
        
        if(grossEarningsStartDate == ""){
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

    const overlapDateRangeString = (grossStartDate: string, grossEndDate: string, pwcStartDate: string, pwcEndDate: string ) => {
      
      let tempGrossStartDate = createDateFromFormat(grossStartDate);
      let tempGrossEndDate = createDateFromFormat(grossEndDate);
      let tempPWCStartDate = createDateFromFormat(pwcStartDate);
      let tempPWCEndDate = createDateFromFormat(pwcEndDate);
      let tempObj = {
        start: "",
        end: ""
      }
      let greater = getGreaterDate(tempGrossStartDate, tempPWCStartDate);
      let lesser = getLesserDate(tempGrossEndDate, tempPWCEndDate);
      let year, month, day;
      let year2, month2, day2;
      let tempStringDateStart = "";
      let tempStringDateEnd = "";

      year = greater.getFullYear();
      month = greater.getMonth()+1;
      day = greater.getDate();
      tempStringDateStart = `${year}/${month}/${day}`;
      
      year2 = lesser.getFullYear();
      month2 = lesser.getMonth()+1;
      day2 = lesser.getDate();
      tempStringDateEnd = `${year2}/${month2}/${day2}`;
      
      tempObj = {
        start: tempStringDateStart,
        end: tempStringDateEnd
      }
      return tempObj;
    }

    const overlapRange = (grossStartDate: Date, grossEndDate:Date, pwcStartDate: Date, pwcEndDate: Date ) => {

        let tempObj = {
          start: "",
          end: ""
        }
        let year, month, day;
        let tempStringDateStart = "";
        let tempStringDateEnd = "";
        if(grossStartDate <= pwcStartDate){
          year = pwcStartDate.getFullYear();
          month = pwcStartDate.getMonth()+1;
          day = pwcStartDate.getDate();
          tempStringDateStart = `${day}/${month}/${year}`;
  
        }
        
        if(grossStartDate > pwcStartDate){
          year = grossStartDate.getFullYear();
          month = grossStartDate.getMonth()+1;
          day = grossStartDate.getDate();
          tempStringDateStart = `${day}/${month}/${year}`;
        }
  
        if( grossEndDate < pwcEndDate){
          year = grossEndDate.getFullYear();
          month = grossEndDate.getMonth()+1;
          day = grossEndDate.getDate();
          tempStringDateEnd = `${day}/${month}/${year}`;
        }
  
        if( grossEndDate >= pwcEndDate ){
          year = pwcEndDate.getFullYear();
          month = pwcEndDate.getMonth()+1;
          day = pwcEndDate.getDate();
          tempStringDateEnd = `${day}/${month}/${year}`;
        }
        
        tempObj = {
          start: tempStringDateStart,
          end: tempStringDateEnd
        }
        return tempObj;

      }

    const isAllFieldCompleted = ():boolean  => {
      return isGrossStartDateCompleted && isGrossEndDateCompleted && pwcStartCompleted && pwcEndCompleted && isWPSelected
    }

    const onSubmit = async () => {

      if(isGrossStartDateCompleted && isGrossEndDateCompleted && pwcStartCompleted && pwcEndCompleted && isWPSelected){

        const removeCommas = (value: string): string => {
          return value.replace(/,/g, '');
        };

        try{

          let daysCountNoWp;
          let daysCountWp;
          daysCountNoWp = await countDays(grossEarningsStartDate, grossEarningsEndDate);
          setDaysCounted(daysCountNoWp);
          let grossDateStart = await createDateFromFormat(grossEarningsStartDate);
          let grossDateEnd = await createDateFromFormat(grossEarningsEndDate);
          daysCountWp = await countWorkDays(grossDateStart,grossDateEnd, workPattern);
          // let grossEarningsNum = Number(replaceValues(grossEarnings));
          let grossEarningsNum = Number(replaceCommas(grossEarnings));
          // let grossEarningsNum = Number(grossEarnings.replace(/,/g,""));
          let singleDayGrossWP = Number(grossEarningsNum/daysCountWp);
          setSingleDayGrossWP(singleDayGrossWP.toString());
          let tempTotalGrossReduction = Number(singleDayGrossWP * daysCountWp);
          setTotalGrossForPeriodReduction(tempTotalGrossReduction);

          setWorkPatternDaysCounted(daysCountWp); 
          let tempOject = await overlapDateRangeString(grossEarningsStartDate,grossEarningsEndDate, pwcStartDate, pwcEndDate);
          setDateRangeWithPWC({
            start: tempOject.start,
            end: tempOject.end
          });
          let start  = new Date(tempOject.start);
          let end = new Date(tempOject.end);
          let wage_pwc_overlap_days = await countWorkDays(start, end, workPattern);
          let totalOverlapReduction = singleDayGrossWP * wage_pwc_overlap_days;
          setCountDaysOverlapWithPWC(wage_pwc_overlap_days);
          setTotalGrossForPeriodReduction(totalOverlapReduction);
          setIsAllFieldEntered(true);

        }catch(error){
          console.error(" Error ", error);
        }
    }else {
      setIsAllFieldEntered(true);
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
                className="mr-2 text-black-500"
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
          <label htmlFor="grossEarnings" className="block text-gray-700 text-sm font-bold mb-2">
          Gross Earnings
          </label>
          <input
            type="text"
            id="grossEarnings"
            value={grossEarnings}
            onChange={(e) => setGrossEarnings(e.target.value)}
            onBlur={() => handleGrossEarningsBlur(grossEarnings,setGrossEarnings,setGrossEarningsInputError)}
            onFocus={handleGrossEarningsFocus}
            className={`w-full border rounded py-2 px-3 text-black-500${grossEarningsInputError ? ' border-red-500' : ''}`}
            style={{ maxWidth: "300px" }}
          />
        </div>
        {grossEarningsInputError && (
          <div className="my-3">
            <p className="text-red-500 text-xs italic">Invalid input format</p>
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
            <label htmlFor="grossEarningsStartDate" className="block text-gray-700 text-sm font-bold mb-2">
                Gross Earnings Start Date
            </label>
            <input
                type="text"
                id="grossEarningsStartDate"
                value={grossEarningsStartDate}
                onChange={(e) => setGrossEarningsStartDate(e.target.value)}
                onBlur={grossStartDateOnBlur}
                onFocus={handleFocus}
                className={`w-full border rounded py-2 px-3 text-black-500${grossStartDateError ? ' border-red-500' : ''}`}
            />
            {grossStartDateError && (
              <div className="my-3">
              <p className="text-red-500 text-xs italic">Invalid input format</p>
              </div>
            )}
          </div>
          <div className="flex flex-row w-full mb-4" style={{ maxWidth: "300px" }}>
            <div className="flex flex-col">
              <label htmlFor="grossEarningsEndDate" className="block text-gray-700 text-sm font-bold mb-2">
                  Gross Earnings End Date
              </label>
              <input
                type="text"
                id="grossEarningsEndDate"
                value={grossEarningsEndDate}
                onChange={(e) => setGrossEarningsEndDate(e.target.value)}
                onBlur={grossEndDateOnBlur}
                onFocus={handleFocus}
                className={`w-full border rounded py-2 px-3 text-black-500${grossEndDateError ? ' border-red-500' : ''}`}
              />
            {grossEndDateError && (
              <div className="my-3">
              <p className="text-red-500 text-xs italic">Invalid input format</p>
              </div>
            )}
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-5">
          <div className="flex flex-row mb-4 ">
            <div  className="flex flex-col w-full"style={{ maxWidth: "300px" }}>
              <label htmlFor="pwcStartDate" className="block text-gray-700 text-sm font-bold mb-2">
                  PWC Start Date
              </label>
              <input
                type="text"
                id="pwcStartDate"
                value={pwcStartDate}
                onChange={(e) => setPwcStartDate(e.target.value)}
                onBlur={pwcStartDateOnBlur}
                onFocus={handleFocus}
                className={`w-full border rounded py-2 px-3 text-black-500${pwcStartError ? ' border-red-500' : ''}`}
                style={{ maxWidth: "300px" }}
              />
            {pwcStartError && (
              <div className="my-3">
              <p className="text-red-500 text-xs italic">Invalid input format</p>
              </div>
            )}
            </div>
          </div>
          <div className="flex flex-row w-full space-x-4 mb-9" style={{ maxWidth: "300px" }}>
            <div className="flex flex-col">
              <label htmlFor="pwcEndDate" className="block text-gray-700 text-sm font-bold mb-2">
                  PWC End Date
              </label>
              <input
                type="text"
                id="pwcEndDate"
                value={pwcEndDate}
                onChange={(e) => setPwcEndDate(e.target.value)}
                onBlur={pwcEndDateOnBlur}
                onFocus={handleFocus}
                className={`w-full border rounded py-2 px-3 text-black-500${pwcEndError ? ' border-red-500' : ''}`}
                style={{ maxWidth: "300px" }}
              />
              {pwcEndError && (
                <div className="my-3">
                <p className="text-red-500 text-xs italic">Invalid input format</p>
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
              <p>{start} — {end}   {formatStringNumberWithCommas(countDaysOverlapWithPWC)} {Number(countDaysOverlapWithPWC) > 1 ? "days" : "day"} overlap based on work pattern</p> 
              <p>{countDaysOverlapWithPWC} * ${formatStringNumberWithCommas(singleDayGrossWP)} = ${formatStringNumberWithCommas(totalGrossForPeriodReduction)}</p>
            </div>
          </div>
        ):
        (
          <div className="">
            <p> Please fill out all input fields </p>
          </div>
        )
       }
      </div>
    </div>
  )
}

export default Apportioning
