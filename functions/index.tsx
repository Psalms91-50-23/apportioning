'use client';
import {  differenceInDays } from "date-fns";
import { OnBlurDate, PatternOfWork, DateFormats, BeforeDate, DateObject, PatternOfWorkInput } from "@/types";

const includeLastDay = 1;
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(?:[0-9]{2})?[0-9]{2}$/;
const earningsRegex = /^(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?|\.\d{1,2})$/ ;

const formatDate = (input: string, setError: Function) => {
    const numericInput = input.replace(/\D/g, '');
    const ddmmyyRegex = /^(\d{2})(\d{2})(\d{2})$/;
    const ddmmyyyyRegex = /^(\d{2})(\d{2})(\d{4})$/;
    const dmyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/;
    const ddmyyRegex = /^(\d{2})\/(\d{2})\/(\d{2})$/;
    const ddmyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const dmmyyyyRegex = /^(\d{1,2})\/(\d{2})\/(\d{4})$/;
  
    let day, month, year;
  
    // Check if the input matches the ddmmyy format (e.g., 010523)
    if ((day = numericInput.match(ddmmyyRegex)?.[1] as string | undefined) !== undefined) {
        const [, day, month, year] = numericInput.match(ddmmyyRegex)!;
        const formattedYear = year.length === 2 ? `20${year}` : year;
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${formattedYear}`;
    }
  
    // Check if the input matches the ddmmyyyy format (e.g., 01052023)
    if ((day = numericInput.match(ddmmyyyyRegex)?.[1] as string | undefined) !== undefined) {
        const [, day, month, year] = numericInput.match(ddmmyyyyRegex)!;
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
  
    // Check if the input matches the d/m/yy format (e.g., 1/5/23)
    if ((day = input.match(dmyyRegex)?.[1] as string | undefined) !== undefined) {
        const [, day, month, year] = input.match(dmyyRegex)!;
        const formattedYear = year.length === 2 ? `20${year}` : year;
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${formattedYear}`;
    }
  
    // Check if the input matches the dd/mm/yy format (e.g., 01/05/23)
    if ((day = input.match(ddmyyRegex)?.[1] as string | undefined) !== undefined) {
        const [, day, month, year] = input.match(ddmyyRegex)!;
        const formattedYear = year.length === 2 ? `20${year}` : year;
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${formattedYear}`;
    }
  
    // Check if the input matches the dd/mm/yyyy format (e.g., 01/05/2023)
    if ((day = input.match(ddmyyyyRegex)?.[1] as string | undefined) !== undefined) {
        const [, day, month, year] = input.match(ddmyyyyRegex)!;
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
  
    // Check if the input matches the d/mm/yyyy format (e.g., 4/11/2023)
    if ((day = input.match(dmmyyyyRegex)?.[1] as string | undefined) !== undefined) {
        const [, day, month, year] = input.match(dmmyyyyRegex)!;
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
  
    // If none of the regex patterns match, assume it's already in the format dd/mm/yyyy
    day = numericInput.slice(0, 2);
    month = numericInput.slice(2, 4);
    year = numericInput.slice(4);
    const formattedYear = year.length === 2 ? `20${year}` : year;
    setError(false);
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${formattedYear}`;
  };

  //format for creating date yyyy-mm-dd or dd/mm/yyyy does not count april 2023 month correctly only this format yyyy/mm/dd does
const createDateFormat = (dateString: string | Date): Date | string=> {
  //yyyy/mm/dd
  let formatOne = /^\d{4}\/\d{2}\/\d{2}$/.test(dateString as string);
  //dd/mm/yyyy
  let formatTwo = /^\d{2}\/\d{2}\/\d{4}$/.test(dateString as string);
  if(typeof dateString === 'string' && formatOne){
    const [year, month, day] = dateString.split('/');
    let formattedDate = `${year}/${month}/${day}`
    return new Date(formattedDate);
  }else if(typeof dateString === 'string' && formatTwo){
    const [day, month, year] = dateString.split('/');
    let formattedDate = `${year}/${month}/${day}`
    return new Date(formattedDate);
  }
  else if( dateString instanceof Date ){
    let year = dateString.getFullYear();
    let month = dateString.getMonth()+1;
    let day = dateString.getDate();
    return new Date(`${year}/${month}/${day}`);
  }
  return "date not valid";
}

  
const validateDate = (input: string): boolean => {

  const exludeThisRegexFormat = /^(\d{1,2})\/(\d{1,2}|\d)\/(\d{3})$/;
  // Check if input matches any of the excluded formats
  if (exludeThisRegexFormat.test(input)) {
      return false;
  }
  // Regular expression to match various valid date formats
  const dateRegex = /^(?:(\d{2})(\d{2})(\d{2}))|(?:(\d{2})(\d{2})(\d{4}))|(?:(\d{1,2})\/(\d{1,2})\/(\d{2}))|(?:(\d{2})\/(\d{2})\/(\d{2}))|(?:(\d{2})\/(\d{2})\/(\d{4}))|(?:(\d{1,2})\/(\d{2})\/(\d{4}))$/;
  // Test if the input matches any of the specified date formats
  if (dateRegex.test(input)) {
      return true;
  }
  return false;
};

const validateDateAndDisplay = (input: string, setDisplayAll: Function): boolean => {
  // Regular expression to match various date formats
  const dateRegex = /^((\d{2})(\d{2})(\d{2}))|((\d{2})(\d{2})(\d{4}))|((\d{1,2})\/(\d{1,2})\/(\d{2}))|((\d{2})\/(\d{2})\/(\d{2}))|((\d{2})\/(\d{2})\/(\d{4}))|((\d{1,2})\/(\d{2})\/(\d{4}))$/;
  
  // Test if the input matches any of the specified date formats
  if (dateRegex.test(input)) {
    return true; // Return true if the input is a valid date format
  }else {
    setDisplayAll(false);
    return false;
  }

};

const formatFinancialDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getFinancialYears = (dateString: string): { currentFinancialYearStart: string, previousFinancialYearEnd: string } | null => {
  // Extracting day, month, and year from the input string
  const [day, month, year] = dateString.split('/').map(Number);

  // Creating a new Date object from the input string
  const inputDate = new Date(year, month - 1, day);

  // Determine the current and previous financial year start and end dates
  let currentFinancialYearStart: Date;
  let previousFinancialYearEnd: Date;

  if (month < 4) {
      // For dates before April, the current financial year started in the previous year
      currentFinancialYearStart = new Date(year - 1, 3, 1); // 01/04/yyyy-1
      previousFinancialYearEnd = new Date(year - 1, 2, 31); // 31/03/yyyy-1
  } else {
      // For dates from April onwards, the current financial year starts in the current year
      currentFinancialYearStart = new Date(year, 3, 1); // 01/04/yyyy
      previousFinancialYearEnd = new Date(year, 2, 31); // 31/03/yyyy
  }

  // Return an object with the current financial year start and the previous financial year end
  return {
      currentFinancialYearStart: formatFinancialDate(currentFinancialYearStart),
      previousFinancialYearEnd: formatFinancialDate(previousFinancialYearEnd)
  };
};
  

const getFinDates_ = (startDateLTE: string, endDateLTE: string): { newFinancialYearStart: string, previousFinancialYearEnd: string | null } => {
  const [startDay, startMonth, startYear] = startDateLTE.split('/').map(Number);
  const startDate = new Date(startYear, startMonth - 1, startDay);

  const [endDay, endMonth, endYear] = endDateLTE.split('/').map(Number);
  const endDate = new Date(endYear, endMonth - 1, endDay);

  let newFinancialYearStart: Date;
  let previousFinancialYearEnd: Date;

  if (endMonth >= 4) {
    // End date is in the new financial year
    newFinancialYearStart = new Date(endYear, 3, 1); // April 1st of the current year
    previousFinancialYearEnd = new Date(endYear, 2, 31); // March 31st of the current year
  } else {
    // End date is in the previous financial year
    newFinancialYearStart = new Date(endYear - 1, 3, 1); // April 1st of the previous year
    previousFinancialYearEnd = new Date(endYear - 1, 2, 31); // March 31st of the previous year
  }
  
  const startPeriodDate = new Date(startYear, startMonth - 1, startDay);
  const previousFinancialYearEndDate = new Date(previousFinancialYearEnd);

  if (startPeriodDate > previousFinancialYearEndDate) {
    return {
      newFinancialYearStart: formatFinancialDate(newFinancialYearStart),
      previousFinancialYearEnd: null
    };
  } else {
    return {
      newFinancialYearStart: formatFinancialDate(newFinancialYearStart),
      previousFinancialYearEnd: formatFinancialDate(previousFinancialYearEnd)
    };
  }
  
}
//should use start date LTE 
const dateLessThanPreviousYear = (date: string): boolean => {
  const [day, month, year] = date.split("/").map(Number);
  const tempStartDateLTEDate = new Date(year, month - 1, day);
  const currentFinancialYearDate = new Date(year,2,31); //previous financial year 
  return tempStartDateLTEDate < currentFinancialYearDate ? true : false;
}
  
//should use end date of LTE
const dateGreaterThanCurrentYear = (date: string): boolean => {
  const [day, month, year] = date.split("/").map(Number);
  const tempEndDateLTEDate = new Date(year,month -1 ,day);
  const currentFinancialYearDate = new Date(year,3,1); //current financial year 
  return tempEndDateLTEDate > currentFinancialYearDate ? true : false;
}

  
const getGreaterDate = (date1: Date, date2: Date) => {
  return date1 > date2 ? date1 : date2;

}

const getLesserDate = (date1:Date, date2: Date) => {
  return date1 < date2 ? date1 : date2;
}
  
const replaceCommas = (value: string | null | undefined): string => {
  // Check if value is a string
  if (typeof value === "string") {
      // Replace all commas with an empty string
      return value.replace(/,/g, "");
  }
  // Handle other cases, e.g., return an empty string or handle differently
  return "";
};

// Helper function to format date as dd/mm/yyyy

const formatNumberWithCommas = (number: number): string => {
  return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatResult = (num: number): string => {
  const formattedNum = num.toFixed(2);
  return formatNumberWithCommas(Number(formattedNum));
};

const formatIntoNumber = (inputString: string): number | null => {
  // Remove commas from the input string and convert to a floating-point number
  const numberValue = parseFloat(inputString.replace(/,/g, ''));
  // Check if the conversion was successful
  if (isNaN(numberValue)) {
    console.error(`Conversion failed for input: ${inputString}`);
    return null; // or you can return some default value or handle the error in your specific way
  }
  // Format the number with 2 decimal places
  const roundedNumber = Math.round(numberValue * 100) / 100;
  return roundedNumber;
};

// const  formatNumberWithCommas = (number: number): string => {
//   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

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

const formatStringNumberWithCommas = (stringValue: string): string => {
  // Convert the string to a number, then format it with commas
  const numberValue = parseFloat(stringValue).toFixed(2);
  return numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

};

const sanitizeInput = (input: string): string => {
  // Use a regular expression to keep only digits and dots
  const sanitizedInput = input.replace(/[^\d.]/g, "");
  return sanitizedInput;
};

const convertSingleDateToInitialFormat = (dateObject: string | Date): string => {

if(dateObject instanceof Date){
  // const date = new Date(dateObject);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
}else {
  //expected date format will be dd/mm/yyyy

  return dateObject;
}
}

const convertToInitialDateFormat = (startDate: string, endDate: string ): { start: string, end: string } => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
};
  // const year1 = new Date(startDate).getFullYear();
  // const month1 = new Date(startDate).getMonth()+1;
  // const day1 = new Date(startDate).getDate();

  // const year2 = new Date(endDate).getFullYear();
  // const month2 = new Date(endDate).getMonth()+1;
  // const day2 = new Date(endDate).getDate();
  let start = formatDate(startDate);
  let end = formatDate(endDate);
  return {
    start,
    end
  }
}

const overlapDateRangeString = (grossStartDate: string, grossEndDate: string, pwcStartDate: string, pwcEndDate: string ): { start: string, end: string } => {
    
  let tempGrossStartDate = createDateFormat(grossStartDate) ?? new Date(grossStartDate);
  let tempGrossEndDate = createDateFormat(grossEndDate) ?? new Date(grossEndDate);
  let tempPWCStartDate = createDateFormat(pwcStartDate) ?? new Date(pwcStartDate);
  let tempPWCEndDate = createDateFormat(pwcEndDate) ?? new Date(pwcEndDate);
  // const dateArray = [tempGrossStartDate, tempGrossEndDate, tempPWCStartDate,tempPWCEndDate ];
  let tempObj = {
    start: "",
    end: ""
  }

  if(tempGrossStartDate instanceof Date && tempGrossEndDate instanceof Date && tempPWCStartDate instanceof Date && tempPWCEndDate instanceof Date){
    let greater = getGreaterDate(tempGrossStartDate, tempPWCStartDate);
    let lesser = getLesserDate(tempGrossEndDate, tempPWCEndDate);
    let year, month, day;
    let year2, month2, day2;
    let tempStringDateStart = "";
    let tempStringDateEnd = "";

    const formatDate = (date: Date) => {
      // const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}/${month}/${day}`;
  };


    year = greater.getFullYear();
    month = greater.getMonth()+1;
    day = greater.getDate();
    tempStringDateStart = `${year}/${month}/${day}`;
    
    year2 = lesser.getFullYear();
    month2 = lesser.getMonth()+1;
    day2 = lesser.getDate();
    tempStringDateEnd = `${year2}/${month2}/${day2}`;
    
    tempObj = {
      start: formatDate(greater),
      end: formatDate(lesser)
      // start: tempStringDateStart,
      // end: tempStringDateEnd
    }
    return tempObj;
  }
  return tempObj;
}

//converts string numbers to Numbers and also removes commas
const convertStringToNumber = (inputString: string): Number | null => {
    // Remove all characters except digits and dot
  const stringWithoutNonDigits = inputString.replace(/[^\d.]/g, '');
  // Use the Number() constructor to convert the string to a number
  const result = Number(stringWithoutNonDigits);
  // Check if the conversion was successful
  if (isNaN(result)) {
    console.error(`Conversion failed for input: ${inputString}`);
    return null; // or you can return some default value or handle the error in your specific way
  }

  return result;
}

  //This function takes an input string, removes all non-digit characters, and formats the number with commas for thousands. It specifically handles the case where there are one or two digits after the dot, and it pads with zeros if needed.
  const formatNumber = (input: string): string => {
    // Remove all non-digit characters
    const numericInput = input.replace(/\D/g, '');
    // If the input is empty or non-numeric, return an empty string
    if (!numericInput) {
      return '';
    }
    // If the input has only one or two digits, format it without commas
    if (numericInput.length <= 2) {
      return `0.${numericInput.padEnd(2, '0')}`;
    }
    // Otherwise, format the input with commas for thousands and add a dot and two zeros after it
    const integralPart = numericInput.slice(0, -2);
    const decimalPart = numericInput.slice(-2);
    const formattedNumber = integralPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formattedNumber}.${decimalPart}`;
  };
  
//This function is designed to format numeric input values. It removes existing commas, handles the case where there is a dot with one or two digits after it, and adds a dot with two zeros if there is no dot. It also adds commas for thousands separators.
  const formatInputValue = (inputValue: string):string => {
    // Remove any existing commas from the value
    inputValue = inputValue.replace(/,/g, '');
    // Check if the value has a dot and handle accordingly
    if (inputValue.includes('.')) {
        // If there is one digit after the dot, add a zero
        inputValue = inputValue.replace(/\.(\d)$/, '.$10');
        // If there are two digits after the dot, keep it as is
        inputValue = inputValue.replace(/\.(\d{2})$/, '.$1');
        // If there is no dot, add a dot and two zeros
    } else {
        inputValue += '.00';
    }
    // Add commas for thousands separator
    inputValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Return the formatted value
    return inputValue;
  }

  //This function is quite similar to formatInputValue. It sanitizes the input by removing non-numeric characters, removes existing commas, and handles the case where there is a dot with one or two digits after it. It adds a dot with two zeros if there are no digits after the dot. It also adds commas for thousands separators.
  const grossEarningInputValueConverted = (input: string):string => {
    // Replace all characters except commas, dots, and numbers with an empty string
    const sanitizedInput = input.replace(/[^\d.,]/g, "");
    // Remove any existing commas from the sanitized value
    let formattedValue = sanitizedInput.replace(/,/g, '');
    // If input is ".00", replace with "0.00"
    if (formattedValue === '.00') {
        return '0.00';
    }
    // If there is more than two digits after the dot, truncate to two digits
    formattedValue = formattedValue.replace(/\.(\d{2}).*$/, '.$1');
    // If there are no digits after the dot, add two zeros
    formattedValue = formattedValue.replace(/\.(\D*)$/, '.$100');
    // If there is one digit after the dot, add a zero
    formattedValue = formattedValue.replace(/\.(\d)$/, '.$10');
    // If there is no dot, add a dot and two zeros
    if (!formattedValue.includes('.')) {
        formattedValue += '.00';
    }
    // Add commas for thousands separator
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Return the final formatted value
    return formattedValue;
 };

 const validateAndSetGrossEarnings = (inputValue: string, setBackPayment: Function, setBackPaymentError: Function, 
  // setBackPaymentStartDateError: Function
  ): void => {
  // Only show an error if there is an input
  if (inputValue.trim().length > 0) {
    // Assume you want to allow only numbers with a maximum of two decimal places
    const regex = /^\d+(\.\d{1,})?$/;

    if (!regex.test(inputValue)) {
      setBackPayment('');
      setBackPaymentError(true);
      // setBackPaymentStartDateError(false);
      // setGrossEarningsFormat(false);
      return;
    }
  }      
  // Update state only if there is no error
  setBackPayment(inputValue);
  setBackPaymentError(false);
};

const handleEarningsOnBlur = (earnings: string, setEarnings: Function,   setEarningsError: Function, setCompleted: Function, setDisplayAll?: Function): void => {
  
  validateAndSetGrossEarnings(earnings, setEarnings, setEarningsError, 
    // setEarningsStartDateError
    );
  let formattedInput = earnings.trim(); // Trim leading/trailing whitespaces
  formattedInput = grossEarningInputValueConverted(formattedInput);
  // let finalValue = formatNumber(formattedInput);
  if (!formattedInput || !earningsRegex.test(formattedInput)){
      // If input is empty, set default value
      formattedInput = '0.00';
      setEarnings(formattedInput);
      // setEarningsStartDateError(true);
      setCompleted(false);
      // setIsGrossEarningCompleted(false);
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
  setEarningsError(false);
  setEarnings(formattedInput);
  setCompleted(true);

};

const beyondLTE_EndDate = (relatedStartDate: string, relatedEndDate: string, endDateLTE: string):boolean => {
  let tempRelatedStartDate = createDateFormat(relatedStartDate);
  let tempRelatedEndDate = createDateFormat(relatedEndDate);
  let tempEndDateLTE = createDateFormat(endDateLTE);
  return (tempRelatedStartDate > tempEndDateLTE || tempRelatedEndDate > tempEndDateLTE) ? true : false;

}

const dateOnBlur = ({ dateValue, setDateValue, setDateError, setDateCompleted, setDisplayAll }: OnBlurDate) => {
  let isDateValid = validateDate(dateValue);
  if (!isDateValid) {
    // If date is not valid, set error and prevent further display actions
    setDateError(true);
    if(setDisplayAll){
      setDisplayAll(false);
    }
    return;
  }
  if (dateValue === "") {
    setDateError(false);
    setDateCompleted(false);
    if(setDisplayAll){
      setDisplayAll(false);
    }
    return;
  }

  // let isDateValid = validateDate(dateValue);
  // if (!isDateValid) {
  //   // If date is not valid, set error and prevent further display actions
  //   setDateError(true);
  //   setDisplayAll(false);
  //   return;
  // }

  // Remove whitespaces and format the input
  const formattedInput = dateValue.replace(/\s/g, '');
  let dateFormatted = formatDate(formattedInput, setDateCompleted);

  // Test if the input matches any of the specified formats
  if (dateRegex.test(dateFormatted)) {
    // If it matches, set isComplete to true and update the input state
    setDateCompleted(true);
    setDateValue(dateFormatted);
    setDateError(false);
  } else {
    // If it doesn't match, set error and prevent further display actions
    setDateCompleted(false);
    setDateError(true);
    if(setDisplayAll){
      setDisplayAll(false);
    }
  }
};

// const dateOnBlur = ({ dateValue, setDateValue, setDateError, setDateCompleted, setDisplayAll }:OnBlurDate) => {
//   if(dateValue === ""){
//     setDateError(false);
//     setDateCompleted(false);
//     setDisplayAll(false);
//     return;
//   }
//   let isDateValid = validateDate(dateValue);
//   if(!isDateValid){
//     setDisplayAll(false);
//     setDateError(true);
//   }
//   setDateError(false);
//   // Remove whitespaces and format the input
//   const formattedInput = dateValue.replace(/\s/g, '');
//   let dateFormatted = formatDate(formattedInput, setDateCompleted);
//   // Test if the input matches any of the specified formats
//   if (dateRegex.test(dateFormatted)) {
//     // If it matches, set isComplete to true and update the input state
//     setDateCompleted(true);
//     setDateValue(dateFormatted);
//     setDateError(false);
//     setDisplayAll(false);
//   } else {
//     // If it doesn't match, set isComplete to false and setError to true
//     setDateCompleted(false);
//     setDateError(true);
//     setDisplayAll(false);
//   }
// }


const getBeforeDate = ({ date, dateFormat, readableFormat, dateObjectFormat }: BeforeDate): string | Date | object | undefined => {
  let day, month, year;
  if (date instanceof Date) {
    day = date.getDate() - 1;
    month = date.getMonth() + 1;
    year = date.getFullYear();
    // Adjust for the first day of the month
    if (day === 0) {
      const lastDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0);
      day = lastDayOfPreviousMonth.getDate();
      month = lastDayOfPreviousMonth.getMonth() + 1;
    }
  }
  if (typeof date === "string") {
    const dateString = date as string;
    const match = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (match) {
      const [days, months, years] = match.slice(1).map((match) => match.padStart(2, '0'));
      let tempDate = new Date(`${years}/${months}/${days}`);
      day = tempDate.getDate() - 1;
      month = months;
      year = years;
      // Adjust for the first day of the month
      if (day === 0) {
        const lastDayOfPreviousMonth = new Date(tempDate.getFullYear(), tempDate.getMonth(), 0);
        day = lastDayOfPreviousMonth.getDate();
        month = lastDayOfPreviousMonth.getMonth() + 1;
      }
    }
  }

    let tempDateFormatString = `${year}/${month?.toString().padStart(2, '0')}/${day?.toString().padStart(2, '0')}`;
    let tempReadableFormatString = `${day?.toString().padStart(2, '0')}/${month?.toString().padStart(2, '0')}/${year}`;
    let tempDateFormat = new Date(`${year}/${month?.toString().padStart(2, '0')}/${day?.toString().padStart(2, '0')}`);

    if (dateFormat) {
      return tempDateFormatString;
    } else if (readableFormat) {
      return tempReadableFormatString;
    } else if (dateObjectFormat) {
      return tempDateFormat;
    } else {
      return { tempDateFormatString, tempReadableFormatString, tempDateFormat };
    }
};

const countDays = (startDateString: string, endDateString: string): number => {
  let tempStartDate = createDateFormat(startDateString) ?? new Date(startDateString);
  let tempEndDate = createDateFormat(endDateString) ?? new Date(endDateString);
  if (tempEndDate instanceof Date && tempStartDate instanceof Date) {
    // Ensure startDate is before or equal to endDate
    let daysCounted: number = differenceInDays(tempEndDate, tempStartDate) + 1;
    return daysCounted;
  }
  return 0;
};

const dayMap: { [key: number]: keyof PatternOfWorkInput } = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};


const countWorkDays = (
  startDate: Date | string,
  endDate: Date | string,
  workPattern: PatternOfWorkInput
): number => {
  let count = 0;
  let currentDate = createDateFormat(startDate);
  let currentDateEnd = createDateFormat(endDate);

  if (currentDate instanceof Date && currentDateEnd instanceof Date) {
    let allFull = true;
    let allHalf = true;
    let mixtureDays = false;

    // First loop to determine the type of days (allFull, allHalf, or mixtureDays)
    while (currentDate <= currentDateEnd) {
      if (currentDate instanceof Date) {
        const dayOfWeek = currentDate.getDay();
        const dayKey = dayMap[dayOfWeek];

        if (workPattern[dayKey] === 'full') {
          allHalf = false;
        } else if (workPattern[dayKey] === 'half') {
          allFull = false;
        }
      }

      // Increment the date by one day
      if (currentDate instanceof Date) {
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        break; // Exit loop if currentDate is not a Date instance
      }
    }
    // Reset currentDate for counting days
    currentDate = createDateFormat(startDate);
    // Second loop to count days based on the determined type
    while (currentDate <= currentDateEnd) {
      if (currentDate instanceof Date) {
        const dayOfWeek = currentDate.getDay();
        const dayKey = dayMap[dayOfWeek];

        if (workPattern[dayKey] === 'full') {
          count++;
        } else if (workPattern[dayKey] === 'half') {
          count += allHalf ? 1 : 0.5;
        } else if (workPattern[dayKey] === '') {
          // Ignore empty days
        }
      }
      // Increment the date by one day
      if (currentDate instanceof Date) {
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        break; // Exit loop if currentDate is not a Date instance
      }
    }

    return count;
  }

  return 0; // Invalid date inputs
};

//tested all conditions is fine
const isInsideSTEBool = (backPayRelateToEndDate: string | Date, startDateSTE: string | Date): boolean => {
  // let day, month, year, daySTE, monthSTE, yearSTE, backPayDate, steDate;
  let backPayDate, steDate;
  if(typeof backPayRelateToEndDate === "string" && typeof startDateSTE === "string"){
    const [days, months, years] = backPayRelateToEndDate.split('/').map((part) => part.padStart(2, '0'));
    backPayDate = new Date(`${years}/${months}/${days}`);
    const [steDays, steMonths, steYears] = startDateSTE.split('/').map((part) => part.padStart(2,"0"));
    steDate = new Date(`${steYears}/${steMonths}/${steDays}`);
    if(backPayDate >= steDate){
      return true;
    }else{
      return false;
    }
  }
  else {

    if(backPayRelateToEndDate >= startDateSTE){
      return true;
    }else{
      return false;
    }
  }
}
//tested all conditions is fine
const isOutsideLTEBool = (backPayRelateToStartDate: string | Date, startDateLTE: string | Date): boolean => {
  // let day, month, year, daySTE, monthSTE, yearSTE, backPayDate, steDate;
  let backPayStartDate, lteDate;
  if(typeof backPayRelateToStartDate === "string" && typeof startDateLTE === "string"){
    const [days, months, years] = backPayRelateToStartDate.split('/').map((part) => part.padStart(2, '0'));
    backPayStartDate = new Date(`${years}/${months}/${days}`);
    const [lteDays, lteMonths, lteYears] = startDateLTE.split('/').map((part) => part.padStart(2,"0"));
    lteDate = new Date(`${lteYears}/${lteMonths}/${lteDays}`);
    if(backPayStartDate < lteDate){
      return true;
    }else{
      return false;
    }
  }
  else {
    if(backPayRelateToStartDate < startDateLTE){
      return true;
    }else{
      return false;
    }
  }
}

const isInsideLTEBool = ( backPayRelateToStartDate: string | Date,  backPayRelateToEndDate: string | Date, startDateSTE: string | Date, startDateLTE: string | Date ):boolean => {
  let backPayDateEnd, beforeDateSTE, dateSTEStart, backPayStartDateRelateTo, backPayEndDateRelateTo, dateStartLTE;
  if(typeof backPayRelateToStartDate === "string" && typeof backPayRelateToEndDate === "string" && typeof startDateSTE === "string"){
    const [days, months, years] = backPayRelateToEndDate.split('/').map((part) => part.padStart(2, '0'));
    backPayDateEnd = new Date(`${years}/${months}/${days}`);
    const [steDays, steMonths, steYears] = startDateSTE.split('/').map((part) => part.padStart(2,"0"));
    backPayStartDateRelateTo = new Date(createDateFormat(backPayRelateToStartDate));
    backPayEndDateRelateTo = new Date(createDateFormat(backPayRelateToEndDate));
    dateSTEStart = new Date(createDateFormat(startDateSTE));

    dateStartLTE = new Date(createDateFormat(startDateLTE));
    if( backPayStartDateRelateTo >= dateSTEStart && backPayStartDateRelateTo < dateStartLTE 
      || backPayStartDateRelateTo >= dateStartLTE && backPayEndDateRelateTo < dateSTEStart 
      || backPayStartDateRelateTo < dateStartLTE && backPayEndDateRelateTo < dateSTEStart 
    || backPayStartDateRelateTo >= dateStartLTE && backPayEndDateRelateTo >= dateSTEStart){
      return true;
    }
    else{
      return false;
    }
  }
  else {
    if(backPayRelateToEndDate < startDateSTE){
      return true;
    }else{
      return false;
    }
  }
}


const getDateFormats = ({ date, dateFormat,readableFormat, dateObjectFormat }:DateFormats):string | Date | object | undefined => {
    
  let day, month, year;
  if(date instanceof Date){
    day = date.getDate()-1;
    month = date.getMonth() + 1;
    year = date.getFullYear();
  }

  if(typeof date === "string"){
    const dateString = date as string;
    const match = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (match) {
      const [days, months, years] = match.slice(1).map((match) => match.padStart(2, '0'));
      let tempDate = new Date(`${years}/${months}/${days}`);
      day = tempDate.getDate();
      month = months;
      year = years;
    }  
  }
  let tempDateFormatString = `${year}/${month}/${day}`;
  let tempReadableFormatString = `${day}/${month}/${year}`;
  let tempObjectFormat = new Date(`${year}/${month}/${day}`);
  if(dateFormat){
    return tempDateFormatString;
  }else if(readableFormat){
    return tempReadableFormatString;
  }
  else if(dateObjectFormat) {
    return tempObjectFormat;
    
  }else{
    return { tempDateFormatString, tempReadableFormatString, tempObjectFormat }
  }

}

const convertToDateFormat = (dateString: string): string => {
  const [day, month, year] = dateString.split('/');
  return `${year}/${month}/${day}`;
};

const convertToOriginalFormat = (date: string | Date): string => {
  if (date instanceof Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  const dateString = date as string;
  const match = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);

  if (match) {
    const [day, month, year] = match.slice(1).map((match) => match.padStart(2, '0'));
    return `${day}/${month}/${year}`;
  } else {
    const matchYMD = dateString.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
    if (matchYMD) {
      const [year, month, day] = matchYMD.slice(1).map((match) => match.padStart(2, '0'));
      return `${day}/${month}/${year}`;
    } else {
      const matchHyphen = dateString.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);

      if (matchHyphen) {
        const [year, month, day] = matchHyphen.slice(1).map((match) => match.padStart(2, '0'));
        return `${day}/${month}/${year}`;
      } else {
        // If the date is not in any of the expected formats, log an error message and return the original date string
        return dateString;
      }
    }
  }
};
//gets financial end dates at start date so can put it to the date it relates to
const getFinancialDates = (startDate: string, endDate: string): { financialStart: string; financialEnd: string } | null  => {
  const matchStart = startDate.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  const matchEnd = endDate.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);

  if (!matchStart || !matchEnd) {
    console.error("Invalid date format");
    return null;
  }

  const startDateLTE = `${matchStart[3]}/${matchStart[2]}/${matchStart[1]}`;
  const endDateLTE = `${matchEnd[3]}/${matchEnd[2]}/${matchEnd[1]}`;

  const financialStartDate = "01/04/" + matchEnd[3];
  const financialEndDate = "31/03/" + (parseInt(matchEnd[3])).toString();
  return { financialStart: financialStartDate, financialEnd: financialEndDate };
}

const getAllDates = (
  startDateLTE: string,
  endDateLTE: string,
  startDateSTE: string,
  endDateSTE: string
): DateObject | false => {

  const isValidDateFormat = (dateString: string): boolean => {
    const match = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    return !!match;
  };

  if (!isValidDateFormat(startDateLTE) || !isValidDateFormat(endDateLTE) || !isValidDateFormat(startDateSTE) || !isValidDateFormat(endDateSTE)) {
    return false;
  }
  const startLTE = new Date(convertToDateFormat(startDateLTE));
  const endLTE = new Date(convertToDateFormat(endDateLTE));
  const startSTE = new Date(convertToDateFormat(startDateSTE));
  const endSTE = new Date(convertToDateFormat(endDateSTE));

  const beforeDateSTE = new Date(startSTE);
  beforeDateSTE.setDate(beforeDateSTE.getDate() - 1);
  const beforeStartDateLTE = new Date(startLTE);
  beforeStartDateLTE.setDate(beforeStartDateLTE.getDate() - 1);
  let beforeLTEStartDate = getBeforeDate({ date: startDateLTE, readableFormat: true });
  // let day = beforeDateSTE.getDate();
  // let month = beforeDateSTE.getMonth()+1;
  // let year = beforeDateSTE.getFullYear();

  const financialDates = getFinancialDates(startDateLTE, endDateLTE);

  if (financialDates) {
    return {
      startDateLTE: convertToOriginalFormat(startDateLTE),
      endDateLTE: convertToOriginalFormat(endDateLTE),
      startDateSTE: convertToOriginalFormat(startDateSTE),
      endDateSTE: convertToOriginalFormat(endDateSTE),
      beforeSTEStartDate: convertToOriginalFormat(beforeDateSTE),
      beforeLTEStartDate: `${beforeLTEStartDate}`,
      financialStartDates: convertToOriginalFormat(financialDates.financialStart),
      financialEndDates: convertToOriginalFormat(financialDates.financialEnd),
    };
  }
  else{
    return false;
  }
}

const isAtLeastOneDaySelected = (pattern: PatternOfWork): boolean => {
  return Object.values(pattern).some((value) => value === true);
};

const isAtLeastOneDaySelectedNew = (pattern: PatternOfWorkInput): boolean => {
  return Object.values(pattern).some((value) => value === 'full' || value === 'half');
};

const validateDateAndCompleted = (validate: Function, completedDate1: boolean,completeDate2: boolean, date: string): boolean => {
  return validate(date) && completedDate1 && completeDate2 ? true : false;
}

const getFinDates = (inputDate: string): { newFinancialYearStart: string, previousFinancialYearEnd: string } => {
  const [day, month, year] = inputDate.split('/').map(Number);
  const input = new Date(year, month - 1, day);

  let newFinancialYearStart: Date;
  let previousFinancialYearEnd: Date;

  if (month >= 4) {
    // Input date is after March 31st, within the current financial year
    newFinancialYearStart = new Date(year, 3, 1); // April 1st of the current year
    previousFinancialYearEnd = new Date(year, 2, 31); // March 31st of the current year
  } else {
    // Input date is on or before March 31st, within the previous financial year
    newFinancialYearStart = new Date(year - 1, 3, 1); // April 1st of the previous year
    previousFinancialYearEnd = new Date(year - 1, 2, 31); // March 31st of the previous year
  }

  const formatDate = (date: Date): string => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return {
    newFinancialYearStart: formatDate(newFinancialYearStart),
    previousFinancialYearEnd: formatDate(previousFinancialYearEnd)
  };
}
//test to see if there is firefox
const isFirefox = (): boolean => {
  return typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
};

  export default {
    formatDate,
    createDateFormat,
    validateDate,
    getLesserDate,
    getGreaterDate,
    replaceCommas,
    numberWithCommas,
    formatStringNumberWithCommas,
    sanitizeInput,
    convertToInitialDateFormat,
    overlapDateRangeString,
    countDays,
    countWorkDays,
    formatNumber,
    formatInputValue,
    grossEarningInputValueConverted,
    dateRegex,
    earningsRegex,
    includeLastDay,
    dateOnBlur,
    handleEarningsOnBlur,
    validateAndSetGrossEarnings,
    getAllDates,
    convertToDateFormat,
    convertToOriginalFormat,
    getBeforeDate,
    getDateFormats,
    isInsideSTEBool,
    isOutsideLTEBool,
    isInsideLTEBool,
    convertStringToNumber,
    formatNumberWithCommas,
    validateDateAndCompleted,
    isAtLeastOneDaySelected,
    formatIntoNumber,
    convertSingleDateToInitialFormat,
    dateLessThanPreviousYear,
    dateGreaterThanCurrentYear,
    formatResult,
    isFirefox,
    validateDateAndDisplay,
    beyondLTE_EndDate,
    getFinancialYears,
    formatFinancialDate,
    isAtLeastOneDaySelectedNew,
    differenceInDays
    
  }