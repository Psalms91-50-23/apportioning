'use client';

import React, { useState,useEffect, ChangeEvent } from 'react';
import {  differenceInDays } from "date-fns";
import Decimal from 'decimal.js';
import functions from "../functions";
const { createDateFromFormat, formatDate, validateDate } = functions;
import { PatternOfWork, DateRange, OverlapDates } from "../types";


const PWCApportioning = () => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(?:[0-9]{2})?[0-9]{2}$/;
    let includeLastDay = 1;

    //gross earnings and wp checkbox
    const [grossEarnings, setGrossEarnings] = useState<string>("0.00");
    const [grossEarningsFormat, setGrossEarningsFormat] = useState<boolean>(false);
    const daysOfWeek: string[] = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    //input dates gross earnings
    const [grossEarningsStartDate, setGrossEarningsStartDate] = useState<string>('');
    const [grossEarningsEndDate, setGrossEarningsEndDate] = useState<string>('');
    // const [grossEarningsStartDate, setGrossEarningsStartDate] = useState<string>('01/11/2023');
    // const [grossEarningsEndDate, setGrossEarningsEndDate] = useState<string>('07/11/2023');
    //gross input date errors
    const [grossEarningsInputError, setGrossEarningsInputError] = useState<boolean>(false);
    const [grossStartDateError, setGrossStartDateError] = useState<boolean>(false)
    const [grossEndDateError, setGrossEndDateError] = useState<boolean>(false);
    //gross completed boolean
    const [isGrossStartDateCompleted, setIsGrossStartDateCompleted] = useState<boolean>(false);
    const [isGrossEndDateCompleted, setIsGrossEndDateCompleted] = useState<boolean>(false);

    //pwc input dates
    // const [pwcStartDate, setPwcStartDate] = useState<string>('03/11/2023');
    // const [pwcEndDate, setPwcEndDate] = useState<string>('10/11/2023');
    const [pwcStartDate, setPwcStartDate] = useState<string>('');
    const [pwcEndDate, setPwcEndDate] = useState<string>('');
    //pwc error input dates
    const [pwcStartError, setPwcStartError] = useState<boolean>(false)
    const [pwcEndError, setPwcEndError] = useState<boolean>(false)
    const [pwcStartCompleted, setPwcStartCompleted] = useState<boolean>(false);
    const [pwcEndCompleted, setPwcEndCompleted] = useState<boolean>(false);

    //counted days for work pattern 1 day
    const [singleDayGrossWP, setSingleDayGrossWP] = useState<number>(0);
    //include last day
    const [isLastDayChecked, setIsLastDayChecked] = useState<boolean>(false);
    const [totalGrossForPeriodReduction, setTotalGrossForPeriodReduction] = useState<number>(0);
    const [isTotalGrossReductionCompleted, setIsTotalGrossReductionCompleted] = useState<boolean>(false);

    const [daysCounted, setDaysCounted] = useState<number>(0);
    const [workPatternDaysCounted, setWorkPatternDaysCounted] = useState<number>(0);
    const [countDaysOverlapWithPWC, setCountDaysOverlapWithPWC] = useState<number>(0);
    const [dateRangeWithPWC, setDateRangeWithPWC] = useState({
      start: "",
      end: ""
    });
    // const [dateRangeGross, setDateRangeGross] = useState<DateRange>({ start: new Date(), end: new Date()});
    // const [dateRangePWC, setDateRangePWC] = useState<DateRange>();
    const [isWPSelected, setIsWPSelected] = useState<boolean>(false);
    const [isAllFieldEntered, setIsAllFieldEntered] = useState<boolean>(false);
    const [finalFormat, setFinalFormat] = useState({
      normalWages: 0,
      grossStartDate: '',
      grossEndDate: '',
      pwcStartDate: '',
      pwcEndDate: '',
      wagesPwcOverlapDateRange: '',
      singleGrossWP: 0,
      countDays: 0,
      countDaysWP: 0,
    });
    
 
    const initialWorkPattern: PatternOfWork = {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: true,
        saturday: false,
      };

      const [workPattern, setWorkPattern] = useState<PatternOfWork>(initialWorkPattern);

      const handleWorkPatternChange = (day: keyof PatternOfWork): void => {
        setWorkPattern((prevWorkPattern) => ({
          ...prevWorkPattern,
          [day]: !prevWorkPattern[day],
        }));
      };

      const numberWithCommas = (value: string): string => {
        const parts = value.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      
        // If there is a decimal part, format it separately
        if (parts[1]) {
          parts[1] = parts[1].slice(0, 2); // Limit decimal part to two digits
          return parts.join('.');
        }
      
        return parts[0];
      };
    
      const validateAndSetGrossEarnings = (inputValue: string, setGrossEarnings: Function, setErrorGrossEarnings: Function): void => {
        // Only show an error if there is an input
        if (inputValue.trim().length > 0) {
          // Assume you want to allow only numbers with a maximum of two decimal places
          const regex = /^\d+(\.\d{1,})?$/;
      
          if (!regex.test(inputValue)) {
            setGrossEarnings('');
            setErrorGrossEarnings('Invalid gross earnings format');
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
        console.log({ dayOfWeek, startOfWeek, adjustedDayOfWeek }, "Debugging isWorkDay");
      
        // Ensure adjustedDayOfWeek is within the valid range
        if (adjustedDayOfWeek >= 0 && adjustedDayOfWeek < Object.keys(workPattern).length) {
          const dayKey = Object.keys(workPattern)[adjustedDayOfWeek] as keyof PatternOfWork;
          return workPattern[dayKey];
        }
        // if (adjustedDayOfWeek >= 0 && adjustedDayOfWeek < Object.keys(workPattern).length) {
        //   const dayKey = Object.keys(workPattern)[adjustedDayOfWeek] as keyof PatternOfWork;
        //   return workPattern[dayKey];
        // }
      
        // Handle the case where adjustedDayOfWeek is outside the valid range
        return false;
      };
      // const isWorkDay = (date: Date, workPattern: PatternOfWork, startOfWeek: number): boolean => {
      //   const dayOfWeek = date.getDay();
      //   const adjustedDayOfWeek = (dayOfWeek - startOfWeek + 7) % 7;
      //   console.log({ dayOfWeek, startOfWeek, adjustedDayOfWeek }, "Debugging isWorkDay");
      //   const dayKey = Object.keys(workPattern)[adjustedDayOfWeek] as keyof PatternOfWork;
      //   return workPattern[dayKey];
      // };

   

    const countDays = (startDateString: string, endDateString: string): number => {
        console.log({startDateString}, " countdays");
        let tempStartDate = createDateFromFormat(startDateString);
        let tempEndDate = createDateFromFormat(endDateString);
        let newTempStartDate = new Date(tempStartDate);
        let newTempEndDate = new Date(tempEndDate);
        let daysCounted: number = (differenceInDays(newTempEndDate, newTempStartDate))+includeLastDay;
        console.log({daysCounted}," in function");
        return daysCounted;
    }; 

    // const countWorkDays = (startDate: Date, endDate: Date, workPattern: PatternOfWork): number => {
    //   let count = 0;
    
    //   // Increment count if the start date is a workday
    //   if (isWorkDay(startDate, workPattern, startDate.getDay())) {
    //     count++;
    //   }
    
    //   let currentDate = new Date(startDate);
    //   let startDayOfWeek = startDate.getDay();
    
    //   while (currentDate <= endDate) {
    //     console.log(currentDate, isWorkDay(currentDate, workPattern, startDayOfWeek), count, "Iteration Info");
    
    //     // Compare only the date parts
    //     const currentDateWithoutTime = currentDate.toDateString();
    //     const endDateWithoutTime = endDate.toDateString();
    
    //     if (currentDateWithoutTime <= endDateWithoutTime && isWorkDay(currentDate, workPattern, startDayOfWeek)) {
    //       count++;
    //     }
    
    //     // Increment the date by one day
    //     currentDate.setDate(currentDate.getDate() + 1);
    //   }
    
    //   console.log({ count }, "Final Count");
    //   return count;
    // };
    

    const countWorkDays = (startDate: Date, endDate: Date, workPattern: PatternOfWork): number => {

      let count = 0;

      let currentDate = new Date(startDate);
      // let startDayOfWeek = startDate.getDay();
      
      while (currentDate <= endDate) {
        console.log(currentDate, isWorkDay(currentDate, workPattern, currentDate.getDay()), count, "Iteration Info");
        currentDate.setDate(currentDate.getDate() + 1);
        if (isWorkDay(currentDate, workPattern, currentDate.getDay())) {
          console.log("inside count");
          count++;
        }
    
        // Increment the date by one day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      console.log({ count }, "Final Count");
      return count;
    };

    const handleGrossEarningsFocus = (): void => {
        // Clear the input if the value is '0.00'
        if (grossEarnings === '0.00' ||  grossEarnings === "NaN" || grossEarnings === "NaN.00") {
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
        } else {
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
    
    let counted = countWorkDays(new Date('2023-11-24'), new Date('2023-11-25'), workPattern);
    console.log({counted});

      const grossStartDateOnBlur = () => {
        
        if(grossEarningsStartDate == ""){
          return;
        }
        let isDateValid = validateDate(grossEarningsStartDate);
        console.log({isDateValid});
        if(!isDateValid){
          console.log({grossStartDateError});
          setGrossStartDateError(true);
        }
        console.log({grossStartDateError});
        setGrossStartDateError(false);

        console.log({grossEarningsStartDate});
        // Remove whitespaces and format the input
        const formattedInput = grossEarningsStartDate.replace(/\s/g, '');
        console.log({formattedInput});
        let dateFormatted = formatDate(formattedInput, setGrossStartDateError);
        console.log({dateFormatted});
        // Test if the input matches any of the specified formats
        if (dateRegex.test(dateFormatted)) {
          console.log({dateFormatted}, " inside");
          // If it matches, set isComplete to true and update the input state
          setIsGrossStartDateCompleted(true);
          setGrossEarningsStartDate(dateFormatted);
          setGrossStartDateError(false);
        } else {
          console.log("1");
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
        console.log({grossEarningsEndDate});
        // Remove whitespaces and format the input
        const formattedInput = grossEarningsEndDate.replace(/\s/g, '');
        console.log({formattedInput});
        let dateFormatted = formatDate(formattedInput,setGrossEndDateError);
        console.log({dateFormatted});
        // Test if the input matches any of the specified formats
        if (dateRegex.test(dateFormatted)) {
          console.log({dateFormatted}, " inside");
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
        
      /* 
          const [pwcStartDate, setPwcStartDate] = useState<string>('');
    const [pwcEndDate, setPwcEndDate] = useState<string>('');
    //pwc error input dates
    const [pwcStartError, setPwcStartError] = useState<boolean>(false)
    const [pwcEndError, setPwcEndError] = useState<boolean>(false)
      */

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
        console.log({formattedInput});
        let dateFormatted = formatDate(formattedInput, setPwcStartError);
        console.log({dateFormatted});
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
      console.log({formattedInput});
      let dateFormatted = formatDate(formattedInput, setPwcEndError);
      console.log({dateFormatted});
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

    function getGreaterDate(date1: Date, date2: Date) {
      if (date1 > date2) {
        return date1;
      } else {
        return date2;
      }
    }

    function getLesserDate(date1:Date, date2: Date) {
      if (date1 < date2) {
        return date1;
      } else {
        return date2;
      }
    }

    const overlapDateRangeString = (grossStartDate: string, grossEndDate: string, pwcStartDate: string, pwcEndDate: string ) => {
      
      console.log("date overlap range string ");
      let tempGrossStartDate = createDateFromFormat(grossStartDate);
      let tempGrossEndDate = createDateFromFormat(grossEndDate);
      let tempPWCStartDate = createDateFromFormat(pwcStartDate);
      let tempPWCEndDate = createDateFromFormat(pwcEndDate);
      console.log({tempGrossStartDate});
      console.log({tempPWCStartDate});

      let tempObj = {
        start: "",
        end: ""
      }
      console.log({grossStartDate},{pwcStartDate});
      let greater = getGreaterDate(tempGrossStartDate, tempPWCStartDate);
      let lesser = getLesserDate(tempGrossEndDate, tempPWCEndDate);
      console.log({greater});
      console.log({lesser});
   

      let year, month, day;
      let year2, month2, day2;
      let tempStringDateStart = "";
      let tempStringDateEnd = "";

      year = greater.getFullYear();
      month = greater.getMonth()+1;
      day = greater.getDate();
      tempStringDateStart = `${day}/${month}/${year}`;
      
      console.log({tempStringDateStart});
      year2 = lesser.getFullYear();
      month2 = lesser.getMonth()+1;
      day2 = lesser.getDate();
      tempStringDateEnd = `${day2}/${month2}/${year2}`;
      console.log({tempStringDateStart});

      
      tempObj = {
        start: tempStringDateStart,
        end: tempStringDateEnd
      }
      console.log({tempObj});
      return tempObj;
    }

    const overlapRange = (grossStartDate: Date, grossEndDate:Date, pwcStartDate: Date, pwcEndDate: Date ) => {

        let tempObj = {
          start: "",
          end: ""
        }
        console.log({grossStartDate}, {grossEndDate}, {pwcStartDate}, {pwcEndDate});
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
  
        if( grossEndDate >= pwcEndDate){
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


    // const finalCalculations = () => {

    //   if(isGrossEndDateCompleted && isGrossStartDateCompleted && grossEarningsFormat && pwcStartCompleted && pwcEndCompleted && isWPSelected){
    //     setIsAllFieldEntered(false);
    //     console.log({pwcEndCompleted}, {pwcStartCompleted}, {isWPSelected});
    //     console.log("final if");
    //     let grossStart = new Date(createDateFromFormat(grossEarningsStartDate));
    //     let grossEnd = new Date(createDateFromFormat(grossEarningsEndDate));
    //     let pwcStart = new Date(createDateFromFormat(pwcStartDate));
    //     let pwcEnd = new Date(createDateFromFormat(pwcEndDate));
    //     let tempOject = overlapRange(grossStart,grossEnd, pwcStart, pwcEnd);
    //     const { start, end } = tempOject;
    //     setdateRangeWithPWC(tempOject);
    //   } else {
    //     console.log("final cal incomplete");
    //     return;
    //   }

    // }

    const isAllFieldCompleted = ():boolean  => {
      return isGrossStartDateCompleted && isGrossEndDateCompleted && pwcStartCompleted && pwcEndCompleted && isWPSelected
    }

    const onSubmit = () => {
      console.log("on submit");
      console.log({isGrossStartDateCompleted}, {isGrossEndDateCompleted}, {pwcStartCompleted}, {pwcEndCompleted}, {isWPSelected});
      console.log({isAllFieldEntered});
      if(isGrossStartDateCompleted && isGrossEndDateCompleted && pwcStartCompleted && pwcEndCompleted && isWPSelected){
        console.log("inside");

        console.log({isWPSelected});
        console.log({ isGrossEndDateCompleted }, { isGrossStartDateCompleted }, "gross date completed");
        console.log({grossEarningsFormat});
        console.log({pwcStartDate});
        console.log({pwcEndDate});
        
        const removeCommas = (value: string): string => {
          return value.replace(/,/g, '');
        };

        let daysCountNoWp;
        let daysCountWp;
        daysCountNoWp = countDays(grossEarningsStartDate, grossEarningsEndDate);
        setDaysCounted(daysCountNoWp);
   

        // console.log({daysCountNoWp}, " daysCountNoWp if");
        let grossDateStart = createDateFromFormat(grossEarningsStartDate);
        let grossDateEnd = createDateFromFormat(grossEarningsEndDate);
        daysCountWp = countWorkDays(grossDateStart,grossDateEnd, workPattern);
        console.log({daysCountWp});
        let grossEarningsNum = Number(grossEarnings);
        let singleDayGrossWP = Number(grossEarningsNum / daysCountWp);
        console.log({singleDayGrossWP});
        setSingleDayGrossWP(singleDayGrossWP);
        let tempTotalGrossReduction = Number(singleDayGrossWP * daysCountWp);
        setIsTotalGrossReductionCompleted(true);
        setTotalGrossForPeriodReduction(tempTotalGrossReduction);
        setWorkPatternDaysCounted(daysCountWp); 
        let tempOject = overlapDateRangeString(grossEarningsStartDate,grossEarningsEndDate, pwcStartDate, pwcEndDate);
        setDateRangeWithPWC({
          start: tempOject.start,
          end: tempOject.end
        });
        console.log({tempOject});
        let start  = createDateFromFormat(tempOject.start);
        let end = createDateFromFormat(tempOject.end);

        let wage_pwc_overlap_days = countWorkDays(start, end, workPattern);
        console.log({wage_pwc_overlap_days});
        let totalOverlapReduction = singleDayGrossWP * wage_pwc_overlap_days;
        console.log({totalOverlapReduction});

        
    }else {
      setIsAllFieldEntered(true);
    }

  }

  useEffect(() => {
    const isAtLeastOneDaySelected = (pattern: PatternOfWork): boolean => {
      return Object.values(pattern).some((value) => value === true);
    };

    let selected = isAtLeastOneDaySelected(workPattern);
    console.log({selected});
    if(selected){
      setIsWPSelected(true);
    }else {
      setIsWPSelected(false);
    }

  }, [workPattern])
  
  // useEffect(() => {

  // },[grossEarningsStartDate]) 

  // const date1 = '03/11/2023'
  // const date2 = '09/11/2023'
  // const pwcDate1 = "30/10/2023"
  // const pwcDate2 = "05/11/2023"
  // const date1 = new Date('2023/11/03');
  // const date2 = new Date('2023/11/09');
  // const pwcDate1 = new Date("2023/10/30");
  // const pwcDate2 = new Date("2023/11/05");

  // let dateAhead;
  // // Compare the dates
  // if(date1 > date2){
  //   dateAhead = date1;
  // }else {
  //   dateAhead = date2;
  // }

  // let tempObj =  overlapDateRangeString(date1, date2, pwcDate1, pwcDate2);
  // console.log({tempObj});
  // console.log("date ahead is ",{dateAhead});
  console.log({dateRangeWithPWC});
  const { start, end } = dateRangeWithPWC;
  console.log({isAllFieldEntered});
  console.log({workPattern});

  const information = `Normal wages date range \n${grossEarningsStartDate} - ${grossEarningsEndDate}\nDays counted for date range above: ${daysCounted} \t\tDays counted based on work pattern: ${workPatternDaysCounted} \nSingle day gross earnings based on work pattern calculations: ${grossEarnings} / ${workPatternDaysCounted} = $${singleDayGrossWP}This is the information you want users to copy and paste.`;
        
  return (
    <div className="flex flex-1 box-border min-h-screen flex-col">
      <p className='font-bold italic'>PWC Apportioning</p>
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
            style={{ maxWidth: "200px" }}
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
            <p className='font-bold'>Acceptable date formats for input field</p>
            <p className='text-xs font-bold italic'>011123 or 01112023 or 1/11/2023 or 1/11/23 or 01/11/23 or 01/11/2023</p>
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
              //   onFocus={onFocus}
              className={`w-full border rounded py-2 px-3 text-black-500${grossStartDateError ? ' border-red-500' : ''}`}
              // style={{ maxWidth: "300px" }}
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
                //   onFocus={onFocus}
                className={`w-full border rounded py-2 px-3 text-black-500${grossEndDateError ? ' border-red-500' : ''}`}
                // style={{ maxWidth: "300px" }}
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
              //   onFocus={onFocus}
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
          <div className="flex flex-row w-full mb-4 space-x-4" style={{ maxWidth: "300px" }}>
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
                //   onFocus={onFocus}
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
        { (isGrossStartDateCompleted && isGrossEndDateCompleted && pwcStartCompleted && pwcEndCompleted && isWPSelected)? (
          <div className="">
            <div className="">
              <p>Normal wages date range</p>
              <p>{grossEarningsStartDate} — {grossEarningsEndDate}</p>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row space-x-5">
                <p>Days counted for above dates: {daysCounted}</p>
                <p>Days counted for above dates based on work pattern: {workPatternDaysCounted}</p>
              </div>
              <div className="">
                Single day gross earnings based on work pattern calculations: {grossEarnings} / {workPatternDaysCounted} = ${singleDayGrossWP}
              </div>
            </div>
            <div className="">
              <p>
                Previous weekly compensation date range
              </p>
              <p>{pwcStartDate} — {pwcEndDate}</p>
            </div>
            <div className="">
              <p>
                Normal wage and previous weekly compensation date overlap
              </p>
              <p>{start} — {end}</p>
            </div>
          </div>
        ):
        (
          <div className="">
            <p> Please fill out all input fields </p>
          </div>
        )

       }
       
        {/* <div className='w-full'>
          <p className='mb-5'>Output</p>
          <textarea
            className='w-full p-3'
            value={information}
            readOnly // Make the textarea non-editable
            rows={10} // Set the number of visible rows
            cols={50} // Set the number of visible columns
          />
        </div> */}
      </div>
    </div>
  )
}

export default PWCApportioning
