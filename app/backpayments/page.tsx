'use client';
import React, { useState, useEffect, useRef, ChangeEvent, RefObject } from 'react';
import { PatternOfWork, ResultType, IncapacityType, FinancialDateTypes, ValueSTE_LTE_Boolean } from "../../types";
import functions from "../../functions";
const {  formatDate, validateDate, sanitizeInput, grossEarningInputValueConverted, handleEarningsOnBlur, getAllDates, earningsRegex, dateRegex, dateOnBlur, countDays, countWorkDays, convertToDateFormat, isInsideSTEBool, isOutsideLTEBool, caculateBackpay, isInsideLTEBool, isAtLeastOneDaySelected, isCurrentFinancialYear, getFinancialYears } = functions;
import { DateInput, WorkPatternSelector, EarningsInput, DHBResult, NonDHBResult } from '../../components';


const BackPayments = () => {

  const [displayAll, setDisplayAll] = useState<boolean>(false);
  const [isDHBError, setIsDHBError] = useState<boolean>(false);
  const [isPaidInCurrentFinancialYear, setIsPaidInCurrentFinancialYear] = useState<boolean>(false)
  const [onHover, setOnHover] = useState<boolean>(false);
  const [financialDates, setFinancialDates] = useState<FinancialDateTypes>({
    currentFinancialYearStart: "",
    currentFinancialYearEnd: "",
    currentFinancialPeriod: "",
    previousFinancialYearStart: "",
    previousFinancialYearEnd: "",
    previousFinancialPeriod: "",
  })
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [valuesSTE_LTE, setValuesSTE_LTE] = useState<ValueSTE_LTE_Boolean>({
    isInsideSTE: false,
    isInsideLTE: false,
    isOutsideLTE: false,
  })

  const [allNeededObjects, setAllNeededObjects] = useState<ResultType | null>();
  const [isDHB, setIsDHB] = useState<boolean>(false);
  const [incapacity, setIncapacity] = useState<IncapacityType>({ dofi: false, dosi: false });
  const [incapacityError, setIncapacityError] = useState<boolean>(true);
  const [incapacityCompleted, setIncapacityCompleted] = useState<boolean>(false);

  const [backPayment, setBackPayment] = useState<string>("");
  const [backPaymentError, setBackPaymentError] = useState<boolean>(false);
  //backpay date it was paid
  const [backPaymentStartDate, setBackPaymentStartDate] = useState<string>("");
  const [backPaymentStartDateError, setBackPaymentStartDateError] = useState<boolean>(false);
  const [backPaymentStartDateCompleted, setBackPaymentStartDateCompleted] = useState<boolean>(false);
  
  const [backPaymentEndDate, setBackPaymentEndDate] = useState<string>("");
  const [backPaymentEndDateError, setBackPaymentEndDateError] = useState<boolean>(false);
  const [backPaymentEndDateCompleted, setBackPaymentEndDateCompleted] = useState<boolean>(false);
  //period back pay it relates to
  const [backPaymentPeriodStartDate, setBackPaymentPeriodStartDate] = useState<string>("");
  const [backPaymentPeriodStartDateError, setBackPaymentPeriodStartDateError] = useState<boolean>(false);
  const [backPaymentPeriodStartDateCompleted, setBackPaymentPeriodStartDateCompleted] = useState<boolean>(false);
  
  const [backPaymentPeriodEndDate, setBackPaymentPeriodEndDate] = useState<string>("");
  const [backPaymentPeriodEndDateError, setBackPaymentPeriodEndDateError] = useState<boolean>(false);
  const [backPaymentPeriodEndDateCompleted, setBackPaymentPeriodEndDateCompleted] = useState<boolean>(false);

  const [startDateSTE, setStartDateSTE] = useState<string>("");
  const [startDateSTE_Error, setStartDateSTE_Error] = useState<boolean>(false);
  const [startDateSTECompleted, setStartDateSTECompleted] = useState<boolean>(false);
  
  const [endDateSTE, setEndDateSTE] = useState<string>("");
  const [endDateSTE_Error, setEndDateSTE_Error] = useState<boolean>(false);
  const [endDateSTECompleted, setEndDateSTECompleted] = useState<boolean>(false);

  const [startDateLTE, setStartDateLTE] = useState<string>("");
  const [startDateLTE_Error, setStartDateLTE_Error] = useState<boolean>(false);
  const [startDateLTECompleted, setStartDateLTECompleted] = useState<boolean>(false);
  
  const [endDateLTE, setEndDateLTE] = useState<string>("");
  const [endDateLTE_Error, setEndDateLTE_Error] = useState<boolean>(false);
  const [endDateLTECompleted, setEndDateLTECompleted] = useState<boolean>(false);

  const [isAllFieldEntered, setIsAllFieldEntered] = useState<boolean>(false);
  const [isWPSelected, setIsWPSelected] = useState<boolean>(false);
  const [allFilled, setAllFilled] = useState<boolean>(false);

  const initialWorkPattern: PatternOfWork = {
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
  };

const [workPattern, setWorkPattern] = useState<PatternOfWork>(initialWorkPattern);

const handleWorkPatternChange = (day: string): void => {
  setWorkPattern((prevWorkPattern) => ({
    ...prevWorkPattern,
    [day as keyof PatternOfWork]: !prevWorkPattern[day as keyof PatternOfWork],
  }));
};

const scrollToBottom = () => {
  setTimeout(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 50);
};

const scrollToTop= () => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, 50); 
};

const backpayRef = useRef<HTMLInputElement>(null);
const backpayStartDateRef = useRef<HTMLInputElement>(null);
const backpayEndDateRef = useRef<HTMLInputElement>(null);
const backpayPaidStartDateRef = useRef<HTMLInputElement>(null);
const backpayPaidEndDateRef = useRef<HTMLInputElement>(null);
const steStartDateRef = useRef<HTMLInputElement>(null);
const steEndDateRef = useRef<HTMLInputElement>(null);
const lteStartDateRef = useRef<HTMLInputElement>(null);
const lteEndDateRef = useRef<HTMLInputElement>(null);

const handleCheckboxChange = (type: keyof IncapacityType) => {
  const newIncapacity = { ...incapacity, [type]: !incapacity[type] };
  setDisplayAll(false);
  setIsClicked(false);
  // Ensuring only one is true at a time
  if (type === 'dofi' && newIncapacity.dofi) {
    newIncapacity.dosi = false;
  } else if (type === 'dosi' && newIncapacity.dosi) {
    newIncapacity.dofi = false;
  }
  // Updating state
  setIncapacity(newIncapacity);
  // Check if neither is ticked to set error state
  if (!newIncapacity.dofi && !newIncapacity.dosi) {
    setIncapacityError(true);
    setIncapacityCompleted(false);
  } else {
    setIncapacityError(false);
    setIncapacityCompleted(true);
  }
};


const validateAndSetGrossEarnings = (inputValue: string, setGrossEarnings: Function, setErrorGrossEarnings: Function): void => {
  // Only show an error if there is an input
  if (inputValue.trim().length > 0) {
    // Assume you want to allow only numbers with a maximum of two decimal places
    const regex = /^\d+(\.\d{1,})?$/;

    if (!regex.test(inputValue)) {
      setBackPayment('');
      setBackPaymentError(true);
      setBackPaymentStartDateError(false);
      return;
    }
  }      
  // Update state only if there is no error
  setBackPayment(inputValue);
  setBackPaymentError(false);
};

const handleGrossEarningsFocus = (): void => {
  setIsAllFieldEntered(false);
  setBackPaymentError(false);
  // Clear the input if the value is '0.00'
  if (backPayment === '0.00' ||  backPayment === "NaN" || backPayment === "NaN.00" || backPayment === ".00" ) {
    setBackPayment('');
  } else if (backPayment.includes('.') && backPayment.endsWith('.00')) {
      // Remove '.00' if the decimal part is '00'
      setBackPayment(backPayment.split('.')[0]);
  } else if (!backPayment.includes('.')) {
      // Add '.00' if no dot and decimal places are present
      setBackPayment(`${backPayment}.00`);
  }
};

const handleBackpayOnBlur = (backPayment: string, setBackPayment: Function,   setBackPaymentError: Function): void => {
  validateAndSetGrossEarnings(backPayment, setBackPayment, setBackPaymentError);
  let formattedInput = backPayment.trim(); // Trim leading/trailing whitespaces
  formattedInput = grossEarningInputValueConverted(formattedInput);
  // let finalValue = formatNumber(formattedInput);
  if (!formattedInput || !earningsRegex.test(formattedInput)){
      // If input is empty, set default value
      formattedInput = '0.00';
      setBackPayment(formattedInput);
      setBackPaymentStartDateError(true);
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
  formattedInput = grossEarningInputValueConverted(santizedGrossInputs);
  // Update state
  setBackPaymentError(false);
  setBackPayment(formattedInput);
};

const onChange = (e: ChangeEvent<HTMLInputElement>, setValue: Function, inputRef: RefObject<HTMLInputElement>, setError: Function, setCompleted?: Function) => {
  let inputValue = e.target.value;
  if(inputRef.current === backpayRef.current){
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

const handleFocus: React.FocusEventHandler<HTMLInputElement> = () => {
  setDisplayAll(false);
  setIsAllFieldEntered(false);
  setIsClicked(false);
  setIsClicked(false);
}

const onSubmitErrorSet = (): boolean => {

const isValid = validateDate(backPaymentStartDate) && 
                validateDate(backPaymentEndDate) && 
                validateDate(backPaymentPeriodStartDate) && 
                validateDate(backPaymentPeriodEndDate) && 
                (!incapacity?.dofi || (validateDate(startDateSTE) && 
                validateDate(endDateSTE))) && 
                validateDate(startDateLTE) && 
                validateDate(endDateLTE);

if (!isValid) {
  setDisplayAll(false);
  return false;
}
  let hasError = false;
  // Check backPayment conditions
  if (!earningsRegex.test(backPayment) || backPayment === "0.00") {
    setBackPaymentStartDateError(true);
    hasError = true;
  }

  // Check date completion flags
  if (!backPaymentStartDateCompleted) {
    setBackPaymentStartDateError(true);
    hasError = true;
  }
  if (!backPaymentEndDateCompleted) {
    setBackPaymentEndDateError(true);
    hasError = true;
  }
  if (!backPaymentPeriodStartDateCompleted) {
    setBackPaymentPeriodStartDateError(true);
    hasError = true;
  }
  if (!backPaymentPeriodEndDateCompleted) {
    setBackPaymentPeriodEndDateError(true);
    hasError = true;
  }
  if (!startDateSTECompleted) {
    setStartDateSTE_Error(true);
    hasError = true;
  }
  if (!endDateSTECompleted) {
    setEndDateSTE_Error(true);
    hasError = true;
  }
  if (!startDateLTECompleted) {
    setStartDateLTE_Error(true);
    hasError = true;
  }
  if (!endDateLTECompleted) {
    setEndDateLTE_Error(true);
    hasError = true;
  }

  // Check incapacity errors
  if (!incapacity.dofi && !incapacity.dosi) {
    setIncapacityError(true);
    hasError = true;
  } else {
    setIncapacityError(false);
  }

  return !hasError; // Return true if no errors, false if there are errors
};

const allValidFormats = (): boolean => {

  if(backPayment && validateDate(backPaymentStartDate) && validateDate(backPaymentEndDate) && validateDate(backPaymentPeriodStartDate) && validateDate(backPaymentPeriodEndDate) && validateDate(startDateSTE) && validateDate(endDateSTE) && validateDate(startDateLTE) && validateDate(endDateLTE) ){
    setBackPaymentStartDateCompleted(true);
    setBackPaymentEndDateCompleted(true);
    setBackPaymentPeriodStartDateCompleted(true);
    setBackPaymentPeriodEndDateCompleted(true);
    setStartDateSTECompleted(true);
    setEndDateSTECompleted(true);
    setStartDateLTECompleted(true);
    setEndDateLTECompleted(true);
    setAllFilled(true);
    return true;
  }
  return false;
}

const isAllFieldCompleted = (): boolean => {

  if(backPaymentStartDateCompleted && backPaymentEndDateCompleted && startDateSTECompleted && endDateSTECompleted && backPaymentPeriodStartDateCompleted && backPaymentPeriodEndDateCompleted && isWPSelected && startDateLTECompleted && endDateLTECompleted && backPayment !== "0.00" && incapacityCompleted  && !incapacityError){
    setDisplayAll(true);
    return true;
  }else{
    return false;
  }

}

const clickArrow = () => {
  if(!isClicked){
    setIsClicked(true);
  }else {
    setIsClicked(true);
  }
}

const calculateApportionBackPay = () => {
  let allFilledOut = onSubmitErrorSet();

  if (!allFilledOut) {
    setDisplayAll(false);
    return;
  }
  if(incapacityError){
    return;
  }

  let isAllFilled = isAllFieldEntered ? isAllFieldEntered : isAllFieldCompleted();
  if(!isAllFilled){
    setIsAllFieldEntered(false);
    return;
  }else {
    setDisplayAll(true);
  }

    let dateObjects = getAllDates(startDateLTE, endDateLTE, startDateSTE, endDateSTE);
    let financialDateObjects = getFinancialYears(endDateLTE);
    const {currentFinancialYearStart} = financialDateObjects;
    let isInCurrentFinYear = isCurrentFinancialYear(new Date(convertToDateFormat(backPaymentPeriodEndDate)), new Date(convertToDateFormat(currentFinancialYearStart)), new Date(convertToDateFormat(backPaymentEndDate)));
    setIsPaidInCurrentFinancialYear(isInCurrentFinYear);
    let tempInsideSTE, tempOutSideLTE, tempInsideLTE;
    if(dateObjects && backPaymentPeriodEndDate && startDateSTE && backPaymentPeriodStartDate && startDateLTE && startDateLTE){

      tempInsideSTE = isInsideSTEBool(backPaymentPeriodEndDate, startDateSTE);
      tempInsideLTE = isInsideLTEBool(backPaymentPeriodStartDate, backPaymentPeriodEndDate, startDateSTE, startDateLTE);
      tempOutSideLTE = isOutsideLTEBool(backPaymentPeriodStartDate, startDateLTE);

      let tempObject;
      if(isDHB && isAllFilled && tempInsideLTE && tempOutSideLTE && tempInsideSTE ){ 
        tempObject = caculateBackpay({ isDHB, dateObjects: {...dateObjects}, isOutsideLTE: tempOutSideLTE, isInsideSTE: tempInsideSTE, isInsideLTE: tempInsideLTE, backPayStartDateRelateTo: backPaymentPeriodStartDate, backPayEndDateRelateTo: backPaymentPeriodEndDate, workPattern: workPattern, backPayEarnings: backPayment, backPayPaidStartDate: backPaymentStartDate, backPayPaidEndDate: backPaymentEndDate, isDofi: incapacity.dofi ? true : false })
        setAllNeededObjects(tempObject);
        scrollToBottom();
      }
      else if(isDHB && isAllFilled && tempInsideSTE && !tempOutSideLTE && tempInsideLTE){
        tempObject = caculateBackpay({ isDHB, dateObjects: {...dateObjects}, isOutsideLTE: false, isInsideSTE: tempInsideSTE, isInsideLTE: tempInsideLTE, backPayStartDateRelateTo: backPaymentPeriodStartDate, backPayEndDateRelateTo: backPaymentPeriodEndDate, workPattern: workPattern, backPayEarnings: backPayment, backPayPaidStartDate: backPaymentStartDate, backPayPaidEndDate: backPaymentEndDate, isDofi: incapacity.dofi ? true : false })
        setAllNeededObjects(tempObject);
        scrollToBottom();
          
      }
      else if(isDHB && isAllFilled && !tempInsideSTE && !tempOutSideLTE && tempInsideLTE ){ 
        //checking if backpay/bonuses are in LTE only
        //currently working on 3/7/2024
        tempObject = caculateBackpay({ isDHB, dateObjects: {...dateObjects}, isOutsideLTE: false, isInsideSTE: false, isInsideLTE: tempInsideLTE, backPayStartDateRelateTo: backPaymentPeriodStartDate, backPayEndDateRelateTo: backPaymentPeriodEndDate, workPattern: workPattern, backPayEarnings: backPayment, backPayPaidStartDate: backPaymentStartDate, backPayPaidEndDate: backPaymentEndDate, isDofi: incapacity.dofi ? true : false })
        setAllNeededObjects(tempObject);
        scrollToBottom();
      }
      else if(isDHB && isAllFilled && !tempInsideSTE && tempOutSideLTE && tempInsideLTE ){
        tempObject = caculateBackpay({ isDHB, dateObjects: {...dateObjects}, isOutsideLTE: tempOutSideLTE, isInsideSTE: tempInsideSTE, isInsideLTE: tempInsideLTE, backPayStartDateRelateTo: backPaymentPeriodStartDate, backPayEndDateRelateTo: backPaymentPeriodEndDate, workPattern: workPattern, backPayEarnings: backPayment, backPayPaidStartDate: backPaymentStartDate, backPayPaidEndDate: backPaymentEndDate, isDofi: incapacity.dofi ? true : false })
        setAllNeededObjects(tempObject);
        scrollToBottom();
        
      } else if(isDHB && isAllFilled && tempInsideSTE && tempOutSideLTE && !tempInsideLTE ){
        tempObject = caculateBackpay({ isDHB, dateObjects: {...dateObjects}, isOutsideLTE: tempOutSideLTE, isInsideSTE: tempInsideSTE, isInsideLTE: tempInsideLTE, backPayStartDateRelateTo: backPaymentPeriodStartDate, backPayEndDateRelateTo: backPaymentPeriodEndDate, workPattern: workPattern, backPayEarnings: backPayment, backPayPaidStartDate: backPaymentStartDate, backPayPaidEndDate: backPaymentEndDate, isDofi: incapacity.dofi ? true : false })
        setAllNeededObjects(tempObject);
        scrollToBottom();
      } else if(isDHB && isAllFilled && !tempInsideSTE && tempOutSideLTE && !tempInsideLTE){
        tempObject = caculateBackpay({ isDHB, dateObjects: {...dateObjects}, isOutsideLTE: tempOutSideLTE, isInsideSTE: tempInsideSTE, isInsideLTE: tempInsideLTE, backPayStartDateRelateTo: backPaymentPeriodStartDate, backPayEndDateRelateTo: backPaymentPeriodEndDate, workPattern: workPattern, backPayEarnings: backPayment, backPayPaidStartDate: backPaymentStartDate, backPayPaidEndDate: backPaymentEndDate, isDofi: incapacity.dofi ? true : false })
        setAllNeededObjects(tempObject);
        scrollToBottom();
      }
      else {
   
        tempInsideSTE = isInsideSTEBool(backPaymentPeriodEndDate, startDateSTE);
        tempInsideLTE = isInsideLTEBool(backPaymentPeriodStartDate, backPaymentPeriodEndDate, startDateSTE, startDateLTE);
        tempOutSideLTE = isOutsideLTEBool(backPaymentPeriodStartDate, startDateLTE);
        setValuesSTE_LTE({
          isInsideSTE: tempInsideSTE,
          isInsideLTE: tempInsideLTE,
          isOutsideLTE: tempOutSideLTE });

        if(!isDHB && isAllFilled){

          tempObject = caculateBackpay({ isDHB, dateObjects: {...dateObjects}, isOutsideLTE: tempOutSideLTE, isInsideSTE: tempInsideSTE, isInsideLTE: tempInsideLTE, backPayStartDateRelateTo: backPaymentPeriodStartDate, backPayEndDateRelateTo: backPaymentPeriodEndDate, workPattern: workPattern, backPayEarnings: backPayment, backPayPaidStartDate: backPaymentStartDate, backPayPaidEndDate: backPaymentEndDate, isDofi: incapacity.dofi ? true : false })
          if(tempObject?.nonDHBResults?.financialYearDates){
            let tempObj = tempObject?.nonDHBResults?.financialYearDates;
            setFinancialDates(tempObj)
          }
          setAllNeededObjects(tempObject);
          scrollToBottom();
        }
      }
      setIsClicked(true);
    }
    else {
      if(!isAllFilled){
        return;
      } 
    }
}

useEffect(() => {
  const {dofi, dosi} = incapacity;
  if(dofi || dosi){
     setIncapacityError(false);
  }
}, [incapacity,, setIncapacityError])


useEffect(() => {
  // isAtLeastOneDaySelected();
}, [isAtLeastOneDaySelected])

useEffect(() => {
  allValidFormats()
  if(allFilled){
    setIsAllFieldEntered(true);
  }
}, [allFilled, setIsAllFieldEntered, allValidFormats])

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

const { dofi, dosi } = incapacity;
const { currentFinancialYearStart,currentFinancialYearEnd, currentFinancialPeriod,
  previousFinancialYearStart, previousFinancialYearEnd, previousFinancialPeriod
 } = financialDates;
 const dates = { startDateSTE, endDateSTE, startDateLTE,endDateLTE };
  return (
    <div className='flex flex-col flex-1 min-h-screen max-width mb-10 relative'>
      <p className='text-2xl font-bold italic mb-5'>Back Payment/Bonuses Apportioning</p>
      <div className="flex flex-col">
        <div className="flex flex-col space-x-5">
        </div>
        {isDHB ? (
          <div className="flex flex-col space-y-2">
            <p className='font-bold italic text-lg'>DHB Back Payment excludes the rules for back payments apportioning in financial years; therefore you would have to apportion it to the period it relates to. If in STE or in both STE and LTE, apportion it to that period and if outside of LTE, apportion it and remove from LTE what is outside and keep what is in LTE and STE</p>
          </div>
        ):
          <div className="flex w-full flex-col space-y-2">
            <p className='font-bold italic text-lg'>Non-DHB Back Payment stays in the financial period it is paid, it does not apportion pass financial periods
            </p>
            <span className='font-bold underline_'>BUT </span> 
            <p className='font-bold text-lg'>DHB ignores financial years and gets apportion to the financial period it relates to.</p>
          </div>
        }
      </div>
      <div className='flex flex-col pt-3'>
        <div className="flex ">
          <div className="flex items-center">
            <input
              type="checkbox"
              className='w-4 h-4 hover:cursor-pointer'
              checked={incapacity.dofi}
              onChange={() => handleCheckboxChange('dofi')}
            />
            <label className='px-4 font-bold'>
              DOFI
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className='w-4 h-4 hover:cursor-pointer '
              checked={incapacity.dosi}
              onChange={() => handleCheckboxChange('dosi')}
            />
            <label className='px-4 font-bold'>
              DOSI
            </label>
          </div>
        </div>
        { incapacityError && (
          <p className="font-bold text-red-900 py-2">
            Please select if incapacity is dofi or dosi
          </p>
        )
        }
      </div>
      <div className="">
        <div className="flex items-center space-x-5 py-3">
          <input 
            type="checkbox" 
            className='w-4 h-4 hover:cursor-pointer'
            checked={isDHB}
            onChange={() => {
              setIsDHB(!isDHB);
              setDisplayAll(false);
              setIsClicked(false);
            }}
            id={`DHB`}
          />
          <label className='font-bold' htmlFor="DHB">DHB</label>
        </div>
        <p className='font-bold italic'>Tick if DHB or default is non-DHB</p>
      </div>
      <WorkPatternSelector 
        workPattern={workPattern}
        handleWorkPatternChange={handleWorkPatternChange}
        isWPSelected={isWPSelected}
        setDisplayAll={setDisplayAll}
        setIsClicked={setIsClicked}
      />
      <EarningsInput 
        title="Back Payment Amount"
        id="BackPay"
        value={backPayment}
        inputRef={backpayRef}
        onChange={(e:  ChangeEvent<HTMLInputElement>) => onChange(e, setBackPayment, backpayRef, setBackPaymentError)}
        onBlur={() => handleEarningsOnBlur(backPayment, setBackPayment, setBackPaymentError, setBackPaymentStartDateCompleted, setDisplayAll)}
        onFocus={handleGrossEarningsFocus}
        error={backPaymentError}
        setDisplayAll={setDisplayAll}
        setIsClicked={setIsClicked}
      />
      <div className="flex flex-col">
        <div className="mb-2">
          <p className='text-lg font-bold mb-2'>Acceptable date formats for input field</p>
          <p className='text-s italic'>011123 or 01112023 or 1/11/2023 or 1/11/23 or 01/11/23 or 01/11/2023</p>
        </div>
        <div className="flex flex-1 mx-auto p-2">
          <p className='flex flex-1 max-width text-xl font-bold'>Back Payment Dates</p>
        </div>
        <div className="flex flex-row w-full flex-1 mb-4 space-x-3 border-box">
          <div className="flex flex-col">
            <div className="flex flex-col flex-1 space-x-3">
              <div className="flex flex-row flex-1 space-x-3">
                <DateInput 
                  inputTitle="Paid Start Date" 
                  inputValue={backPaymentStartDate} 
                  onChange={(e) => setBackPaymentStartDate(e.target.value)}
                  // onChange={(e) => onChange(e, setBackPaymentStartDate, backpayStartDateRef,setBackPaymentStartDateError, setBackPaymentStartDateCompleted)} 
                  onBlur={() => dateOnBlur({ 
                    dateValue: backPaymentStartDate, 
                    setDateValue: setBackPaymentStartDate, 
                    setDateError: setBackPaymentStartDateError, 
                    setDateCompleted: setBackPaymentStartDateCompleted,
                    setDisplayAll
                   })} 
                  error={backPaymentStartDateError} 
                  inputRef={backpayStartDateRef}
                  text={(validateDate(backPaymentStartDate) && validateDate(backPaymentEndDate)) ? `${ countDays(backPaymentStartDate, backPaymentEndDate)} days counted` : ""}
                  setDisplayAll={setDisplayAll}
                  setValue={setBackPaymentStartDate}
                  onFocus={handleFocus}
                  // id={`backPaymentStartDate`}
                />
                <DateInput 
                  inputTitle="Paid End Date" 
                  inputValue={backPaymentEndDate} 
                  onChange={(e) => setBackPaymentEndDate(e.target.value)} 
                  // onChange={(e) => onChange(e, setBackPaymentEndDate, backpayEndDateRef, setBackPaymentEndDateError, setBackPaymentEndDateCompleted)} 
                  onBlur={() => dateOnBlur({ 
                    dateValue: backPaymentEndDate, 
                    setDateValue: setBackPaymentEndDate, 
                    setDateError: setBackPaymentEndDateError, 
                    setDateCompleted: setBackPaymentEndDateCompleted,
                    setDisplayAll
                  })} 
                  error={backPaymentEndDateError} 
                  inputRef={backpayEndDateRef}
                  text={(validateDate(backPaymentStartDate) && validateDate(backPaymentEndDate)) ? `${ countWorkDays(backPaymentStartDate, backPaymentEndDate, workPattern)} WP days counted` : ""}
                  setDisplayAll={setDisplayAll}
                  setValue={setBackPaymentEndDate}
                  onFocus={handleFocus}
                  // id={`${backPaymentEndDate}`}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row flex-1 space-x-3">
              <DateInput 
                inputTitle="Relate to Start Date" 
                inputValue={backPaymentPeriodStartDate} 
                onChange={(e) => setBackPaymentPeriodStartDate(e.target.value)}
                onBlur={() => dateOnBlur({ 
                  dateValue: backPaymentPeriodStartDate, 
                  setDateValue: setBackPaymentPeriodStartDate, 
                  setDateError: setBackPaymentPeriodStartDateError, 
                  setDateCompleted: setBackPaymentPeriodStartDateCompleted,
                  setDisplayAll
                 })} 
                error={backPaymentPeriodStartDateError} 
                inputRef={backpayPaidStartDateRef}
                text={(validateDate(backPaymentPeriodStartDate) && validateDate(backPaymentPeriodEndDate)) ? `${ countDays(backPaymentPeriodStartDate, backPaymentPeriodEndDate)} days counted` : ""}
                setDisplayAll={setDisplayAll}
                setValue={setBackPaymentPeriodStartDate}
                onFocus={handleFocus}
              />

              <DateInput 
                inputTitle="Relate to  End Date" 
                inputValue={backPaymentPeriodEndDate} 
                onChange={(e) => setBackPaymentPeriodEndDate(e.target.value)}
                onBlur={() => dateOnBlur({ 
                  dateValue: backPaymentPeriodEndDate, 
                  setDateValue: setBackPaymentPeriodEndDate, 
                  setDateError: setBackPaymentPeriodEndDateError, 
                  setDateCompleted: setBackPaymentPeriodEndDateCompleted,
                  setDisplayAll
                 })} 
                error={backPaymentPeriodEndDateError} 
                inputRef={backpayPaidEndDateRef}
                text={(validateDate(backPaymentPeriodStartDate) && validateDate(backPaymentPeriodEndDate)) ? `${countWorkDays(backPaymentPeriodStartDate, backPaymentPeriodEndDate, workPattern)} days counted` : ""}
                setDisplayAll={setDisplayAll}
                setValue={setBackPaymentPeriodEndDate}
                onFocus={handleFocus}
              />
            </div>
        </div>
      </div>
        <div className="flex flex-row flex-1 space-x-3">     
        {dofi && !dosi ? (
          <div className='flex flex-col flex-1 max-width'>
            <div className="flex flex-1 mx-auto py-2 max-width">
              <p className='flex justify-center text-xl font-bold'>
                Short Term and Long Term Dates
              </p>
            </div>
            <div className="flex flex-row w-full flex-1 mb-4 space-x-3 border-box">
              <div className="flex flex-row">
                <div className="flex flex-col flex-1">
                  <div className="flex flex-row flex-1 space-x-3">
                    <DateInput 
                      inputTitle="STE start date" 
                      inputValue={startDateSTE} 
                      onChange={(e) => setStartDateSTE(e.target.value)}
                      onBlur={() => dateOnBlur({ 
                        dateValue: startDateSTE, 
                        setDateValue: setStartDateSTE, 
                        setDateError: setStartDateSTE_Error, 
                        setDateCompleted: setStartDateSTECompleted,
                        setDisplayAll
                      })} 
                      error={startDateSTE_Error} 
                      inputRef={steStartDateRef}
                      text={(validateDate(startDateSTE) && validateDate(endDateSTE)) ? `${ countDays(startDateSTE, endDateSTE)} STE days counted` : ""}
                      setDisplayAll={setDisplayAll}
                      setValue={setStartDateSTE}
                      onFocus={handleFocus}
                    />
                    <DateInput 
                      inputTitle="STE end date" 
                      inputValue={endDateSTE} 
                      onChange={(e) => setEndDateSTE(e.target.value)}
                      onBlur={() => dateOnBlur({ 
                        dateValue: endDateSTE, 
                        setDateValue:setEndDateSTE, 
                        setDateError: setEndDateSTE_Error, 
                        setDateCompleted: setEndDateSTECompleted, 
                        setDisplayAll })} 
                      error={endDateSTE_Error} 
                      inputRef={steEndDateRef}
                      text={(validateDate(startDateSTE) && validateDate(endDateSTE)) ? `${countWorkDays(startDateSTE, endDateSTE, workPattern)} WP days counted` : ""}
                      setDisplayAll={setDisplayAll}
                      setValue={setEndDateSTE}
                      onFocus={handleFocus}
                    />
                  </div>
                </div>
                <div className="flex flex-row flex-1">
                  <div className="flex flex-col">
                    <div className="flex flex-row space-x-3 pl-3">
                      <DateInput 
                        inputTitle="LTE start date" 
                        inputValue={startDateLTE} 
                        onChange={(e)=>setStartDateLTE(e.target.value)} 
                        onBlur={() => dateOnBlur({ 
                          dateValue:startDateLTE, 
                          setDateValue:setStartDateLTE, 
                          setDateError: setStartDateLTE_Error, 
                          setDateCompleted: setStartDateLTECompleted, setDisplayAll })} 
                        error={startDateLTE_Error}
                        text={(validateDate(startDateLTE) && validateDate(endDateLTE)) ? `${countDays(startDateLTE, endDateLTE)} LTE days counted` : ""}
                        setDisplayAll={setDisplayAll}
                        setValue={setStartDateLTE}
                        onFocus={handleFocus}
                        inputRef={lteStartDateRef}
                      />
                      <DateInput 
                        inputTitle="LTE end date" 
                        inputValue={endDateLTE} 
                        onChange={(e)=>setEndDateLTE(e.target.value)} 
                        onBlur={() => dateOnBlur({ 
                          dateValue:endDateLTE, 
                          setDateValue: setEndDateLTE, 
                          setDateError: setEndDateLTE_Error, 
                          setDateCompleted: setEndDateLTECompleted, setDisplayAll })} 
                        error={endDateLTE_Error}
                        text={(validateDate(startDateLTE) && validateDate(endDateLTE)) &&         
                          isWPSelected ? `${countWorkDays(startDateLTE, endDateLTE, workPattern)} WP days counted` : ""}
                        setDisplayAll={setDisplayAll}
                        setValue={setEndDateLTE}
                        onFocus={handleFocus}
                        inputRef={lteEndDateRef}
                      />
                    </div>
                  </div>
                </div>
              </div> 
            </div>
          </div>
        )
        : !dofi && dosi ? 
        (
          <div className=''>
            <div className="flex flex-1 mx-auto py-4">
              <p className='flex flex-1 w-full justify-center text-xl font-bold'>Long Term Dates</p>
            </div>
            <div className="flex flex-row flex-1 w-full">
              <div className="flex flex-col">
                <div className="flex flex-row space-x-3 w-full">
                  <DateInput 
                    inputTitle="LTE start date" 
                    inputValue={startDateLTE} 
                    onChange={(e)=>setStartDateLTE(e.target.value)} 
                    onBlur={() => dateOnBlur({ 
                      dateValue: startDateLTE, 
                      setDateValue: setStartDateLTE, 
                      setDateError: setStartDateLTE_Error, 
                      setDateCompleted: setStartDateLTECompleted, setDisplayAll })} 
                    error={startDateLTE_Error}
                    setDisplayAll={setDisplayAll}
                    setValue={setStartDateLTE}
                    onFocus={handleFocus}
                  />
                  <DateInput 
                    inputTitle="LTE end date" 
                    inputValue={endDateLTE} 
                    onChange={(e)=>setEndDateLTE(e.target.value)} 
                    onBlur={() => dateOnBlur({ 
                      dateValue: endDateLTE, 
                      setDateValue: setEndDateLTE, 
                      setDateError: setEndDateLTE_Error, 
                      setDateCompleted: setEndDateLTECompleted, 
                      setDisplayAll })} 
                    error={endDateLTE_Error}
                    setDisplayAll={setDisplayAll}
                    setValue={setEndDateLTE}
                    onFocus={handleFocus}
                  />
                </div>
                { (validateDate(startDateLTE) && validateDate(endDateLTE)) && (
                  <div className="flex flex-1 flex-row space-x-3 justify-between py-3">
                    <p>
                      {countDays(startDateLTE, endDateLTE)}{" "}LTE days counted
                    </p>
                      { isWPSelected && (
                        <p>{countWorkDays(startDateLTE, endDateLTE, workPattern)}{" "} WP days counted</p>
                      )
                      }
                  </div>
                )
                }
              </div>
            </div>
          </div>
          )  
        :
          ""  
        }
        </div>    
      </div>
      <div className='flex mb-5 py-2 max-width-container'>
        <button 
          className="font-bold italic text-lg w-full p-3 rounded-md bg-green-500 hover:bg-green-700 hover:text-white"
          onClick={calculateApportionBackPay}
          > 
        Calculate 
        </button>
      </div>
      <div className="">
        { displayAll && isDHB ? (
          <>
            <p className='font-bold text-xl italic'>
              DHB apportioning ignores financial year, and can be apportioned to the period it relates to. If it is outside LTE, apportion it to be removed. If it is in LTE and STE, apportion it to those periods. 
            </p>
          </>
          ): ""
        }
        { currentFinancialYearStart && currentFinancialYearEnd &&  currentFinancialPeriod && previousFinancialYearStart && previousFinancialYearEnd && previousFinancialPeriod ?(
          <>
            <div className="pt-2">
              { displayAll && !isDHB ? (
                  <p className='font-bold text-xl italic'>
                    Non-DHB Back Payment stays in the financial period it is paid, it does not apportion pass financial periods.
                  </p>
              ): ""
              }
              { displayAll && (
                <>
                  <p className='flex justify-center text-xl font-bold italic py-2'>Current Financial Year Information</p>
                  <div className="flex flex-row space-x-2">
                    <p className='font-bold'>Current Financial Period Start Date: </p>
                    <p>
                      {currentFinancialYearStart}
                    </p>
                  </div>
                  <div className="flex flex-row space-x-2">
                    <p className='font-bold'>Current Financial Period End Date: </p>
                      <p>
                        {currentFinancialYearEnd}
                      </p>
                  </div>
                  <div className="flex flex-row space-x-2">
                    <p className='font-bold'>
                      Financial Period it belongs to: 
                    </p>
                    <p className='italic'>
                      {currentFinancialYearStart} — {currentFinancialYearEnd} belongs to 
                    </p>
                    <p className='font-bold underline_'>
                      {currentFinancialPeriod}
                    </p>
                    <p>Financial Period</p>
                  </div>
                  <div className="pt-2">
                    <p className='flex justify-center text-xl font-bold italic py-2'>Previous Financial Year Information</p>
                    <div className="flex flex-row space-x-2">
                      <p className='font-bold'>
                        Previous Financial Period Start Date: 
                      </p>
                      <p>
                        {previousFinancialYearStart}
                      </p>
                    </div>
                    <div className="flex flex-row space-x-2">
                      <p className='font-bold'>Previous Financial Period End Date: </p>
                        <p>
                          {previousFinancialYearEnd}
                        </p>
                    </div>
                    <div className="flex flex-row space-x-2">
                      <p className='font-bold'>Financial Period it belongs to: </p>
                      <p className='italic'>
                        {previousFinancialYearStart} — {previousFinancialYearEnd} belongs to 
                      </p>
                      <p className='font-bold underline_'>
                        {previousFinancialPeriod}
                      </p>
                      <p>Financial Period</p>
                    </div>
                    <div className="">
                    </div>
                  </div>
                </>
              )
              }
            </div>
          </>
        ): <p></p>
        }
      </div>
      <>
        { isDHB && (
          <> 
            { displayAll && (
              <>
              {
                allNeededObjects?.datesEarningsAndPeriodsRelatedTo && (
                  <DHBResult 
                    resultType={ allNeededObjects } 
                    allDates={dates && {...dates}} 
                  
                  /> 
                )
              }
              </>
              )
            }
          </>
          )
        } 
      </>
      <>
      { !isDHB && (
        <> 
        { displayAll && (
          <>
            { allNeededObjects?.datesEarningsAndPeriodsRelatedTo && (
              <NonDHBResult resultType={ allNeededObjects } valueSTE_LTE_Boolean={valuesSTE_LTE} isPaidInCurrentFinancialYear={isPaidInCurrentFinancialYear} />
            )
            }
          </>
        )
        }
        </>
      )}
      </>
      {isClicked && (
        <img className="up-arrow" src={onHover ? `/upArrow.svg` : `/upArrowStatic.svg`} alt="" onMouseEnter={()=> setOnHover(true)} onMouseLeave={() => setOnHover(false)} onClick={() => scrollToTop()}/>
      )
      }
    </div>
  )
}

export default BackPayments