'use client';
import React, { useState,useEffect, ChangeEvent, useRef, RefObject } from 'react';
import functions from "../../functions";
const { createDateFormat, replaceCommas, overlapDateRangeString,  convertToInitialDateFormat, dateOnBlur, handleEarningsOnBlur, earningsRegex, countDays, countWorkDaysNew, countDaysNew, isFirefox } = functions;
import { PatternOfWorkInput } from "../../types";
import { DateInput, Output, DayToggle } from '../../components';

const page = () => {
    const [clickCounter, setClickCounter] = useState<number>(0)
    const [grossEarnings, setGrossEarnings] = useState<string>("");
    const earningsRef = useRef<HTMLInputElement>(null);
    const [hover, setHover] = useState<boolean>(false);
    const [earningHasFocus, setEarningHasFocus] = useState<boolean>(false);
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
      
    const initialPattern: PatternOfWorkInput = {
        sunday: '',
        monday: 'full',
        tuesday: 'full',
        wednesday: 'full',
        thursday: 'full',
        friday: 'full',
        saturday: '',
    };
    const [isFirefoxBrowser, setIsFirefoxBrowser] = useState(false);
    const [displayAll, setDisplayAll] = useState<boolean>(false);
    const [workPattern, setWorkPattern] = useState<PatternOfWorkInput>(initialPattern);

    const handleWorkPatternChange = (day: keyof PatternOfWorkInput, type: string) => {
        setWorkPattern(prevPattern => ({
        ...prevPattern,
        [day]: type === prevPattern[day] ? '' : type,
        }));
    };

    const onClick = () => {
      if(setGrossEarnings){
        setGrossEarnings("");
        setClickCounter(prev => prev+1);
      }
    }
    
    const scrollToBottom = () => {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 50); 
    };

    const inputStyle: React.CSSProperties = {
      color: isFirefoxBrowser ? 'black' : '', 
      maxWidth: "500px", 
      fontWeight: "600"
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
        setEarningHasFocus(true);
        // Clear the input if the value 
        if (grossEarnings === '0.00' ||  grossEarnings === "NaN" || grossEarnings === "NaN.00" || grossEarnings === ".00"  || grossEarnings.length === 0) {
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
        // if(inputValue === ""){
        //   inputValue = "0.00";
        // }
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
          
          const daysCountNoWp = countDaysNew(grossEarningsStartDate, grossEarningsEndDate);
          setDaysCounted(daysCountNoWp.toString());
          //convert date format from dd/mm/yyy to yyyy/mm/dd as it is more accurate for counting days, eg april was 1 day off using original format
          const grossDateStart =  createDateFormat(grossEarningsStartDate) ?? new Date(grossEarningsStartDate);
          const grossDateEnd =  createDateFormat(grossEarningsEndDate) ?? new Date(grossEarningsEndDate);
          const daysCountWp =  countWorkDaysNew(new Date(grossDateStart), new Date(grossDateEnd), workPattern);
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
          const wage_pwc_overlap_days =  countWorkDaysNew(new Date(start), new Date(end), workPattern);
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
          scrollToBottom();
    }else {
      setIsAllFieldEntered(false);
    }

  }

  useEffect(() => {
    setIsFirefoxBrowser(isFirefox());
  }, []);

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

  useEffect(() => {
    if(grossEarnings === "" && clickCounter >= 1){
      if(earningsRef?.current){
        earningsRef.current.focus();
      }
    }
  }, [grossEarnings, earningsRef, clickCounter ])

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
    <div className="flex flex-1 flex-col max-width justify-center mb-12">
      <p className='text-2xl font-bold italic mb-5'>PWC Apportioning</p>
      <div className="flex flex-col">
        <div className="flex flex-row ">
          <div className="">
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
                        index={`${index}-number`}
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
      </div>
      <div className="mb-5 max-width py-2">
        { !isWPSelected && (
          <p className='font-bold italic text-center'>Please choose a work pattern</p>
        )
        }
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col w-full mb-4" style={{ maxWidth: "300px" }}>
          <label htmlFor="grossEarnings" className="block text-black-900 text-sm font-bold mb-2">
            Gross Earnings
          </label>
          <div className={`flex flex-row bg-white ${earningHasFocus ? 'border-4 border-black rounded-md' : 'border-transparent border-4 rounded-md'}`} style={{ maxWidth: "240px" }}>
            <input
              type="text"
              id={`grossEarnings`}
              ref={earningsRef}
              value={grossEarnings}
              onChange={(e) => onChange(e, setGrossEarnings, earningsRef, setGrossEarningsInputError)}
              onBlur={() => handleEarningsOnBlur(grossEarnings, setGrossEarnings, setGrossEarningsInputError, setIsGrossEarningCompleted, setEarningHasFocus)}
              onFocus={handleGrossEarningsFocus}
              className={`w-full border-transparent border-4 rounded outline-none font-bold py-2 px-3 text-black-900 focus:border-transparent`}
                // ${grossEarningsInputError ? 'border-red-500' : ''}
                style={{ maxWidth: "300px" }}
              placeholder="3,450.90"
              autoComplete='off'
            />
            {grossEarnings.length > 0 && (
              <img
                draggable="false"
                className={`rounded ${hover && 'big-size'}`}
                src={hover ? `/crossTransparent.svg` : `/crossTransparentStatic.svg`}
                alt="Cross Icon"
                width={35}
                height={30}
                onClick={onClick}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              />
            )}
          </div>
        </div>   
        {grossEarningsInputError &&(
          <div className="my-3">
            <p className="text-red-700 font-bold text-xs italic">Please add a value</p>
          </div>
        )}
      </div>
        <div className="flex flex-col w-full">
          <div className="mb-5">
            <p className='font-bold mb-2'>Acceptable date formats for input field</p>
            <p className='text-sm italic'>011123 or 01112023 or 1/11/2023 or 1/11/23 or 01/11/23 or 01/11/2023</p>
          </div>
          <div className="flex flex-row w-full mb-4 space-x-5">
            <DateInput 
              inputTitle="Gross Earnings Start Date" 
              inputValue={grossEarningsStartDate} 
              setValue={setGrossEarningsStartDate}
              onChange={(e) => onChange( e, setGrossEarningsStartDate,  grossStartDateRef, setGrossStartDateError, setIsGrossStartDateCompleted )} 
              onBlur={() => dateOnBlur({ 
                dateValue: grossEarningsStartDate, 
                setDateValue: setGrossEarningsStartDate, 
                setDateError: setGrossStartDateError, 
                setDateCompleted: setIsGrossStartDateCompleted, 
                setDisplayAll })} 
              error={grossStartDateError} 
              inputRef={grossStartDateRef} 
              onFocus={handleFocus}
              customStyle={inputStyle}
              id={`Gross Earnings Start Date`}
            />
            <DateInput 
              inputTitle="Gross Earnings End Date" 
              inputValue={grossEarningsEndDate} 
              setValue={setGrossEarningsEndDate}
              onChange={(e) => onChange( e, setGrossEarningsEndDate,  grossEndDateRef, setGrossEndDateError, setIsGrossEndDateCompleted )} 
              onBlur={() => dateOnBlur({ 
                dateValue: grossEarningsEndDate, 
                setDateValue: setGrossEarningsEndDate, 
                setDateError: setGrossEndDateError, 
                setDateCompleted: setIsGrossEndDateCompleted, 
                setDisplayAll })} 
              error={grossEndDateError} 
              inputRef={grossEndDateRef} 
              onFocus={handleFocus}
              customStyle={inputStyle}
              id={`Gross Earnings End Date`}
            />
          </div>
          <div className="flex flex-row w-full mb-4 space-x-5">
            <DateInput 
              inputTitle="PWC Start Date" 
              inputValue={pwcStartDate} 
              setValue={setPwcStartDate}
              onChange={(e) => onChange( e, setPwcStartDate,  pwcStartDateRef, setPwcStartError, setPwcStartCompleted )} 
              onBlur={() => dateOnBlur({ dateValue: pwcStartDate, setDateValue: setPwcStartDate, setDateError: setPwcStartError, setDateCompleted: setPwcStartCompleted , setDisplayAll })} 
              error={pwcStartError} 
              inputRef={pwcStartDateRef} 
              onFocus={handleFocus}
              customStyle={inputStyle}
              id={`PWC Start Date`}
            />
            <DateInput 
              inputTitle="PWC End Date" 
              inputValue={pwcEndDate} 
              setValue={setPwcEndDate}
              onChange={(e) => onChange( e, setPwcEndDate,  pwcEndDateRef, setPwcEndError, setPwcEndCompleted )} 
              onBlur={() => dateOnBlur({ dateValue: pwcEndDate, setDateValue: setPwcEndDate, setDateError: setPwcEndError, setDateCompleted: setPwcEndCompleted, setDisplayAll })} 
              error={pwcEndError} 
              inputRef={pwcEndDateRef} 
              onFocus={handleFocus}
              customStyle={inputStyle}
              id={`PWC End Date`}
            />
          </div>
          <div className='mb-5'>
            <button 
              className="font-bold italic text-lg p-3 rounded-md bg-green-600 hover:bg-green-800 hover:text-white w-full"
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

export default page