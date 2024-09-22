'use client';
import { OnBlurDate, DhbBackPay, PatternOfWork, DateFormats, BeforeDate, CalculateBackPay, DateObject, WorkPattern, PatternOfWorkInput, InsideLTE, InsideSTE, OutsideLTE, IncapacityType, ResultType, ResultTypeNew, NonDHBResults, CalculateBackPayNew, FinancialDateTypes, InsideLTENotDHB, PrevDateYears, OutsidePreviousLTEDates, OutsideLTENotDHB,  } from "@/types";

const includeLastDay = 1;
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(?:[0-9]{2})?[0-9]{2}$/;
const earningsRegex = /^(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?|\.\d{1,2})$/ ;

const differenceInDays = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

//can be used for paid end date or related to end date
const isCurrentFinancialYear = (backPayEndDateRelateTo: Date, currentFinancialYear: Date, backPaymentPaidEndDate: Date): boolean => {
  return backPaymentPaidEndDate >= currentFinancialYear && backPayEndDateRelateTo >= currentFinancialYear ? true : backPaymentPaidEndDate >= currentFinancialYear ? true : false;
}

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
  const createDateFormat = (dateString: string | Date): Date | string => {
    let formatOne, formatTwo;
    if(!(dateString instanceof Date)){
      //yyyy/mm/dd
      formatOne = /^\d{4}\/\d{2}\/\d{2}$/.test(dateString as string);
      //dd/mm/yyyy
      formatTwo = /^\d{2}\/\d{2}\/\d{4}$/.test(dateString as string);
    }
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

const getFinancialYears = (dateString: string): FinancialDateTypes  => {
  const [day, month, year] = dateString.split('/').map(Number);
  // const inputDate = new Date(year, month - 1, day);

  let currentFinancialYearStart: Date;
  let currentFinancialYearEnd: Date;
  let previousFinancialYearStart: Date;
  let previousFinancialYearEnd: Date;

  if (month < 4) { // For dates in January, February, and March
    currentFinancialYearStart = new Date(year - 1, 3, 1); // 01/04/yyyy-1
    currentFinancialYearEnd = new Date(year, 2, 31); // 31/03/yyyy
    previousFinancialYearStart = new Date(year - 2, 3, 1); // 01/04/yyyy-2
    previousFinancialYearEnd = new Date(year - 1, 2, 31); // 31/03/yyyy-1
  } else { // For dates in April and later
    currentFinancialYearStart = new Date(year, 3, 1); // 01/04/yyyy
    currentFinancialYearEnd = new Date(year + 1, 2, 31); // 31/03/yyyy+1
    previousFinancialYearStart = new Date(year - 1, 3, 1); // 01/04/yyyy-1
    previousFinancialYearEnd = new Date(year, 2, 31); // 31/03/yyyy
  }

  const currentFinancialPeriod = currentFinancialYearStart.getFullYear().toString();
  const previousFinancialPeriod = previousFinancialYearStart.getFullYear().toString();

  return {
    currentFinancialYearStart: formatFinancialDate(currentFinancialYearStart),
    currentFinancialYearEnd: formatFinancialDate(currentFinancialYearEnd),
    currentFinancialPeriod,
    previousFinancialYearStart: formatFinancialDate(previousFinancialYearStart),
    previousFinancialYearEnd: formatFinancialDate(previousFinancialYearEnd),
    previousFinancialPeriod,
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

  // const formatDate = (date: Date): string => {
  //   const dd = String(date.getDate()).padStart(2, '0');
  //   const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  //   const yyyy = date.getFullYear();
  //   return `${dd}/${mm}/${yyyy}`;
  // };

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
    return null; // or you can return some default value or handle the error in your specific way
  }
  // Format the number with 2 decimal places
  const roundedNumber = Math.round(numberValue * 100) / 100;
  return roundedNumber;
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

const handleEarningsOnBlur = (earnings: string, setEarnings: Function, setEarningsError: Function, setCompleted: Function, setEarningHasFocus: Function): void => {
  // If earnings is empty, return early to avoid formatting
  if (earnings.trim() === "") {
    setEarnings("");  // Set the empty value
    setEarningsError(false);  // No error
    setCompleted(false);  // Mark as incomplete
    setEarningHasFocus(false);  // Remove focus
    // if (setEarningHasFocus) {
    // }
    return;
  }

  // Existing logic to validate and format earnings
  validateAndSetGrossEarnings(earnings, setEarnings, setEarningsError);

  if (setEarningHasFocus) {
    setEarningHasFocus(false);  // Remove focus
  }

  let formattedInput = earnings.trim(); // Trim leading/trailing whitespaces
  formattedInput = grossEarningInputValueConverted(formattedInput);  // Format input

  if (!formattedInput || !earningsRegex.test(formattedInput)) {
    // If input is invalid, set default value
    formattedInput = "";
    setEarnings(formattedInput);
    setCompleted(false);
    return;
  }

  // If no decimal is present, append .00
  if (!formattedInput.includes(".")) {
    formattedInput += ".00";
  }

  // Handle decimal places
  const decimalIndex = formattedInput.indexOf(".");
  const digitsAfterDecimal = formattedInput.length - decimalIndex - 1;

  if (digitsAfterDecimal === 0) {
    formattedInput += "00";
  } else if (digitsAfterDecimal === 1) {
    formattedInput += "0";
  } else if (digitsAfterDecimal > 2) {
    formattedInput = `${(+formattedInput).toFixed(2)}`;
  }

  // Remove leading zeros
  if (/^0+\d[1-9]\.\d$/.test(formattedInput)) {
    formattedInput = formattedInput.replace(/^0+/, "");
  }

  // Sanitize and format input
  let sanitizedGrossInputs = sanitizeInput(formattedInput);
  formattedInput = grossEarningInputValueConverted(sanitizedGrossInputs);

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

const countDaysNew = (startDateString: string, endDateString: string): number => {
  let tempStartDate = createDateFormat(startDateString) ?? new Date(startDateString);
  let tempEndDate = createDateFormat(endDateString) ?? new Date(endDateString);
  if (tempEndDate instanceof Date && tempStartDate instanceof Date) {
    let daysCounted: number = differenceInDays(tempStartDate, tempEndDate) + 1;
    return daysCounted;
  }
  return 0;
};

const countWorkDaysNew = (startDate: Date | string, endDate: Date | string, workPattern: PatternOfWorkInput): number => {
  let count = 0;
  let currentDate = typeof startDate === 'string' ? createDateFormat(startDate) : startDate;
  let currentDateEnd = typeof endDate === 'string' ? createDateFormat(endDate) : endDate;

  if (currentDate instanceof Date && currentDateEnd instanceof Date) {
    while (currentDate <= currentDateEnd) {
      const dayOfWeek = currentDate.getDay();
      const dayKey = Object.keys(workPattern)[dayOfWeek] as keyof PatternOfWork;

      if (workPattern[dayKey] === 'full') {
        count++;
      } else if (workPattern[dayKey] === 'half') {
        count += 0.5;
      }
      // Increment the date by one day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  }
  return 0;
};

//original count days
const countDays = (startDateString: string, endDateString: string): number => {
  let tempStartDate = createDateFormat(startDateString) ?? new Date(startDateString) ;
  let tempEndDate = createDateFormat(endDateString) ?? new Date(endDateString);
  let count = 0;
  if(tempEndDate instanceof Date && tempStartDate instanceof Date){
    while (tempStartDate <= tempEndDate) {
      count++;
      tempStartDate.setDate(tempStartDate.getDate() + 1);
    }
    return count;
  }
  return 0;
}; 

//original count work days
const countWorkDays = (startDate: Date | string, endDate: Date | string, workPattern: PatternOfWork): number => {
  let count = 0;
  let currentDate = typeof startDate === 'string' ? createDateFormat(startDate) : startDate;
  let currentDateEnd = typeof startDate === 'string' ? createDateFormat(endDate) : endDate;
  if(currentDate instanceof Date && currentDateEnd instanceof Date){

    while (currentDate <= currentDateEnd) {
      const dayOfWeek = currentDate.getDay();
      const dayKey = Object.keys(workPattern)[dayOfWeek] as keyof PatternOfWork;
  
      if (workPattern[dayKey]) {
        count++;
      }
      // Increment the date by one day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  }
  return 0;
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
    if(backPayStartDate < lteDate ){
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
  if(typeof backPayRelateToStartDate === "string" && typeof backPayRelateToEndDate === "string" && typeof startDateSTE === "string" && typeof startDateLTE === 'string'){
    const [days, months, years] = backPayRelateToEndDate.split('/').map((part) => part.padStart(2, '0'));
    backPayDateEnd = new Date(`${years}/${months}/${days}`);
    const [steDays, steMonths, steYears] = startDateSTE.split('/').map((part) => part.padStart(2,"0"));
    backPayStartDateRelateTo = new Date(createDateFormat(backPayRelateToStartDate));
    backPayEndDateRelateTo = new Date(createDateFormat(backPayRelateToEndDate));
    dateSTEStart = new Date(createDateFormat(startDateSTE));
    dateStartLTE = new Date(createDateFormat(startDateLTE));

    if(backPayEndDateRelateTo >= dateStartLTE){
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

//started off at the else at the bottom for isDHB outside and inside LTE and STE
const getNeededObjects = (isDHB: boolean, workPattern: PatternOfWork, backPayEarnings: string, isOutsideLTE: boolean, isInsideLTE: boolean, isInsideSTE: boolean, startDateLTE: string, endDateLTE: string, startDateSTE: string, endDateSTE: string, beforeLTEStartDate: string, beforeSTEStartDate: string, backPayStartDateRelateTo: string, backPayEndDateRelateTo: string,  backPayPaidStartDate:string, backPayPaidEndDate: string, isDofi: boolean
): ResultType | null => {

  const backPaymentStartDateRelateTo = backPayStartDateRelateTo;
  const backPaymentEndDateRelateTo = backPayEndDateRelateTo;

  let workDaysCounted, singleDayBackPay, tempStartDateRelatedTo, tempEndDateRelatedTo, daysCountedRelatedTo, insideSTEDayCount, insideSTEDayCountsWP, insideLTEDayCounts, insideLTEDayCountsWP, outsideLTEDayCounts, outsideLTEDayCountsWP, totalBackPayInsideSTE, totalBackPayInsideLTE, totalBackPayOutsideLTE, payPeriodRelateToDayCounts, payPeriodRelateToWPDayCounts, insideSTEAmount, insideLTEAmount, outsideLTEAmount, finalOutsideLTEDayCountsWP, finalOutsideLTECalculations, finalInsideLTECalculations, finalInsideSTECalculations, finalInsideSTEDaysWPCount, finalOutsideLTECalculationsPartial, finalInsideSTECalculationsPartial, finalInsideLTECalculationsPartial, dateObject,datesEarningsAndPeriodsRelatedTo, singleDayCalculations, tempStartDateRelateTo, dayText, insideLTECurrentFinancialYear, tempBackPayAmount, insidePeriodSTEDatesOverlap,
  backPaymentPaidEndDate, currentFinancialYear, totalDayCounts,isCurrentYear;

  tempStartDateRelatedTo = createDateFormat(backPayStartDateRelateTo);
  tempEndDateRelatedTo = createDateFormat(backPayEndDateRelateTo);

  // let tempSteDateStart = new Date(createDateFormat(startDateSTE));
  // let tempSteDateEnd = new Date(createDateFormat(endDateSTE));
  let tempLteDateStart = new Date(createDateFormat(startDateLTE)); 
  // let tempLteDateEnd = new Date(createDateFormat(endDateLTE)); 
  // let tempSRT = new Date(tempEndDateRelatedTo);

  tempBackPayAmount = Number(backPayEarnings);

  let insideLTE: InsideLTE = {
    insideLTEDayCountsWP: 0,
    insideLTEDayCounts: 0,
    backPayEndDateRelateTo,
    finalInsideLTECalculations: "",
    startDateLTE,
  };

  let insideSTE: InsideSTE = {
    insideSTEDayCount: 0,
    insideSTEDayCountsWP: 0,
    finalInsideSTECalculations: "",
    startDateSTE,
    backPayEndDateRelateTo,
  };

  let outsideLTE: OutsideLTE = {
    backPayStartDateRelateTo,
    beforeLTEStartDate,
    outsideLTEDayCountsWP: 0,
    outsideLTEDayCounts: 0,
    finalOutsideLTECalculations: "",
  }

  let dates = {
    startDateSTE,
    endDateSTE,
    startDateLTE,
    endDateLTE,
  }

  let backPayDates = {
    periodStartDate: backPayStartDateRelateTo,
    periodEndDate: backPayEndDateRelateTo,
    paidStartDate: backPayPaidStartDate,
    paidEndDate: backPayPaidEndDate,
  }

  workDaysCounted = countWorkDays(backPaymentStartDateRelateTo, backPaymentEndDateRelateTo, workPattern);
  let backPayNumber = Number(convertStringToNumber(backPayEarnings));
  singleDayBackPay = Number(backPayNumber) / workDaysCounted;
  singleDayCalculations = `$${backPayEarnings} / ${workDaysCounted} = `;
  totalDayCounts = countDays(backPaymentStartDateRelateTo, backPaymentEndDateRelateTo);
  if(isDHB){
 
    insideSTEDayCount = countWorkDays(startDateSTE, tempEndDateRelatedTo, workPattern);
    payPeriodRelateToWPDayCounts = countWorkDays(backPayStartDateRelateTo, tempEndDateRelatedTo, workPattern);
    daysCountedRelatedTo = countDays(backPayStartDateRelateTo, backPayEndDateRelateTo);
 
    let countDaysInLTE = countDays(startDateLTE, beforeSTEStartDate);
    insideLTEDayCounts = countWorkDays(startDateLTE, beforeSTEStartDate, workPattern);
    outsideLTEDayCounts = countWorkDays(backPayStartDateRelateTo, beforeLTEStartDate, workPattern);
    totalBackPayOutsideLTE = singleDayBackPay * outsideLTEDayCounts;

    if(isInsideSTE && !isInsideLTE && !isOutsideLTE){

      insideSTEDayCount = countDays(backPayStartDateRelateTo, backPayEndDateRelateTo);
      insideSTEDayCountsWP = countWorkDays(backPayStartDateRelateTo, backPayEndDateRelateTo, workPattern);
      totalBackPayInsideSTE = insideSTEDayCountsWP * singleDayBackPay;
      finalInsideSTECalculations = isInsideSTE && insideSTEDayCountsWP ? `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern x ${singleDayBackPay} = $${formatResult(Number((insideSTEDayCountsWP*singleDayBackPay).toFixed(2)))}` : "" ;
      insideSTE = {...insideSTE};
    }
    else if(isInsideLTE && !isOutsideLTE && isInsideSTE){
      let tempGreaterSTEDate = createDateFormat(startDateSTE) > createDateFormat(backPayStartDateRelateTo) ? startDateSTE : backPayStartDateRelateTo;
      insideSTEDayCount = countDays(tempGreaterSTEDate, backPayEndDateRelateTo);
      insideSTEDayCountsWP = countWorkDays(tempGreaterSTEDate, backPayEndDateRelateTo, workPattern);
      insideLTEDayCounts = countDays(backPayStartDateRelateTo, beforeSTEStartDate);
      insideLTEDayCountsWP = countWorkDays(backPayStartDateRelateTo, beforeSTEStartDate, workPattern);

      insideSTEAmount = insideSTEDayCountsWP * singleDayBackPay;
      insideLTEAmount = payPeriodRelateToWPDayCounts * singleDayBackPay;

      totalBackPayInsideSTE =  insideSTEAmount 

      let dateConvertedSDRT = createDateFormat(backPaymentStartDateRelateTo);
      let greaterStartDateInLTE = dateConvertedSDRT >= tempLteDateStart ? dateConvertedSDRT : tempLteDateStart ;
      greaterStartDateInLTE = convertSingleDateToInitialFormat(greaterStartDateInLTE);

      finalInsideSTECalculations = isInsideSTE && insideSTEDayCountsWP ? `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern => ${insideSTEDayCountsWP} x ${singleDayBackPay} = $${formatResult(Number((insideSTEDayCountsWP*singleDayBackPay).toFixed(2)))}` : "" ;
      
      finalInsideSTECalculationsPartial = isInsideSTE && insideSTEDayCountsWP ? `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern => ${insideSTEDayCountsWP} x ${singleDayBackPay} = ` : "" ;

      if(createDateFormat(tempGreaterSTEDate) === createDateFormat(startDateSTE) ){
        insideSTE = {...insideSTE, insideSTEDayCountsWP, insideSTEDayCount,finalInsideSTECalculations, finalInsideSTECalculationsPartial, insideSTEAmount };
        
      }else {
        insideSTE = {...insideSTE, insideSTEDayCountsWP, insideSTEDayCount,finalInsideSTECalculations, finalInsideSTECalculationsPartial, insideSTEAmount, greaterDateInsideSTE: tempGreaterSTEDate };

      }

      finalInsideLTECalculations = !isOutsideLTE && insideLTEDayCountsWP ? `${greaterStartDateInLTE} — ${beforeSTEStartDate} ${insideLTEDayCountsWP} days work pattern => ${insideLTEDayCountsWP} x ${singleDayBackPay} = $${formatResult(Number((insideLTEDayCountsWP*singleDayBackPay).toFixed(2)))}` : "" ;

      finalInsideLTECalculationsPartial = !isOutsideLTE && insideLTEDayCountsWP ? `${greaterStartDateInLTE} — ${backPayEndDateRelateTo} = ${payPeriodRelateToWPDayCounts} days work pattern => ${payPeriodRelateToWPDayCounts} x ${singleDayBackPay} = ` : "" ;

      insideLTE = {...insideLTE, beforeSTEStartDate, backPayEndDateRelateTo, insideLTEAmount, backPayStartDateRelateTo: backPaymentStartDateRelateTo, finalInsideLTECalculations, finalInsideLTECalculationsPartial, insideLTEDayCounts, insideLTEDayCountsWP };
    }
    else if (isInsideLTE && isOutsideLTE && !isInsideSTE){
      outsideLTEDayCountsWP = countWorkDays(backPayStartDateRelateTo, beforeLTEStartDate, workPattern);
      outsideLTEDayCounts = countDays(backPayStartDateRelateTo, beforeLTEStartDate);
      finalOutsideLTEDayCountsWP = isOutsideLTE ? outsideLTEDayCountsWP : 0;
      finalInsideSTEDaysWPCount = isInsideSTE ? insideSTEDayCountsWP : 0;
      outsideLTEAmount = outsideLTEDayCountsWP * singleDayBackPay;
      
      insideLTEDayCounts = countDays(startDateLTE, backPayEndDateRelateTo);
      insideLTEDayCountsWP = countWorkDays(startDateLTE, backPayEndDateRelateTo, workPattern);
      insideLTEAmount = Number((singleDayBackPay*insideLTEDayCountsWP).toFixed(2));

      finalInsideLTECalculations = !isInsideSTE && insideLTEDayCountsWP ? `${startDateLTE} — ${backPayEndDateRelateTo} ${insideLTEDayCountsWP} days work pattern => ${insideLTEDayCountsWP} x ${singleDayBackPay} = $${formatResult(Number((insideLTEDayCountsWP*singleDayBackPay).toFixed(2)))}` : "" ;

      finalInsideLTECalculationsPartial = !isInsideSTE && insideLTEDayCountsWP ? `${startDateLTE} — ${backPayEndDateRelateTo} ${insideLTEDayCountsWP} days work pattern => ${insideLTEDayCountsWP} x ${singleDayBackPay} = ` : "" ;

      finalOutsideLTECalculations = !isInsideSTE && outsideLTEDayCountsWP ? `${backPayStartDateRelateTo} — ${beforeLTEStartDate} ${outsideLTEDayCountsWP} days work pattern => ${outsideLTEDayCountsWP} x ${singleDayBackPay} = ${formatResult(Number(outsideLTEAmount.toFixed(2)))}` : "";

      finalOutsideLTECalculationsPartial = !isInsideSTE && outsideLTEDayCountsWP ? `${backPayStartDateRelateTo} — ${beforeLTEStartDate} ${outsideLTEDayCountsWP} days work pattern => ${outsideLTEDayCountsWP} x ${singleDayBackPay} = ` : "";
      // insideSTE = {...insideSTE, insideSTEDayCountsWP, insideSTEDayCount,finalInsideSTECalculations, insideSTEAmount };
      insideLTE = {...insideLTE, beforeSTEStartDate, backPayEndDateRelateTo, insideLTEAmount, finalInsideLTECalculationsPartial,
        finalInsideLTECalculations, insideLTEDayCounts, insideLTEDayCountsWP };
      outsideLTE = {...outsideLTE, beforeLTEStartDate, outsideLTEDayCountsWP, outsideLTEDayCounts, finalOutsideLTECalculations, finalOutsideLTECalculationsPartial, outsideLTEAmount, backPayStartDateRelateTo, backPayEndDateRelateTo };
    }
    else if(!isInsideLTE && isOutsideLTE && isInsideSTE){
      insideSTEDayCount = countDays(startDateSTE, backPayEndDateRelateTo);
      insideSTEDayCountsWP = countWorkDays(startDateSTE, backPayEndDateRelateTo, workPattern);

      outsideLTEDayCountsWP = countWorkDays(backPayStartDateRelateTo, beforeLTEStartDate, workPattern);
      outsideLTEDayCounts = countDays(backPayStartDateRelateTo, beforeLTEStartDate);

      finalOutsideLTEDayCountsWP = isOutsideLTE ? outsideLTEDayCountsWP : 0;
      finalInsideSTEDaysWPCount = isInsideSTE ? insideSTEDayCountsWP : 0;
      outsideLTEAmount = outsideLTEDayCountsWP * singleDayBackPay;

      insideLTEDayCounts = countDays(startDateLTE, backPayEndDateRelateTo);
      insideLTEDayCountsWP = countWorkDays(startDateLTE, beforeSTEStartDate, workPattern);
      insideSTEAmount = insideSTEDayCountsWP * singleDayBackPay;

      finalInsideLTECalculations = !isInsideSTE && insideLTEDayCountsWP ? `${startDateLTE} — ${beforeSTEStartDate} ${insideLTEDayCountsWP} days work pattern => ${insideLTEDayCountsWP} x ${singleDayBackPay} = $${formatResult(Number((insideLTEDayCountsWP*singleDayBackPay).toFixed(2)))}` : "" ;

      finalOutsideLTECalculations = isInsideSTE && outsideLTEDayCountsWP ? `${backPayStartDateRelateTo} — ${beforeLTEStartDate} ${outsideLTEDayCountsWP} days work pattern => ${outsideLTEDayCountsWP} x ${singleDayBackPay} = $${formatResult(Number(outsideLTEAmount.toFixed(2)))}` : "";

      finalOutsideLTECalculationsPartial = isInsideSTE && outsideLTEDayCountsWP ? `${backPayStartDateRelateTo} — ${beforeLTEStartDate} ${outsideLTEDayCountsWP} days work pattern => ${outsideLTEDayCountsWP} x ${singleDayBackPay} = ` : "";

      finalInsideSTECalculations = isInsideSTE && insideSTEDayCountsWP ? `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern x ${singleDayBackPay} = $${formatResult(Number((insideSTEDayCountsWP*singleDayBackPay).toFixed(2)))}` : "" ;
      insideSTE = {...insideSTE};

      finalInsideSTECalculationsPartial = isInsideSTE && insideSTEDayCountsWP ? `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern x ${singleDayBackPay} = ` : "" ;
      insideSTE = {...insideSTE};
      
      insideSTE = {...insideSTE, insideSTEDayCountsWP, insideSTEDayCount,finalInsideSTECalculations, finalInsideSTECalculationsPartial, insideSTEAmount };

      outsideLTE = {...outsideLTE, beforeLTEStartDate, outsideLTEDayCountsWP, outsideLTEDayCounts, finalOutsideLTECalculations,finalOutsideLTECalculationsPartial,  outsideLTEAmount, backPayStartDateRelateTo, backPayEndDateRelateTo };

    }
    else if(isInsideLTE && !isOutsideLTE && !isInsideSTE){
      insideLTEDayCounts = countDays(startDateLTE, backPayEndDateRelateTo);
      insideLTEDayCountsWP = countWorkDays(backPayStartDateRelateTo, backPayEndDateRelateTo, workPattern);
      insideLTEAmount = Number((singleDayBackPay*insideLTEDayCountsWP).toFixed(2));

      finalInsideLTECalculations = insideLTEDayCountsWP ? `${backPayStartDateRelateTo} — ${backPayEndDateRelateTo} ${insideLTEDayCountsWP} days work pattern => ${insideLTEDayCountsWP} x ${singleDayBackPay} = $${formatResult(Number((insideLTEDayCountsWP*singleDayBackPay).toFixed(2)))}` : "" ;

      finalInsideLTECalculationsPartial = insideLTEDayCountsWP ? `${backPayStartDateRelateTo} — ${backPayEndDateRelateTo} ${insideLTEDayCountsWP} days work pattern => ${insideLTEDayCountsWP} x ${singleDayBackPay} = ` : "" ;

      insideSTE = {...insideSTE};
      insideLTE = {...insideLTE, beforeSTEStartDate, backPayEndDateRelateTo, insideLTEAmount, finalInsideLTECalculationsPartial,
        finalInsideLTECalculations, insideLTEDayCounts, insideLTEDayCountsWP };
      outsideLTE = {...outsideLTE};
    }
    else if(!isInsideLTE && isOutsideLTE && !isInsideSTE){
      insideSTEDayCount = countDays(startDateSTE, backPayEndDateRelateTo);
      insideSTEDayCountsWP = countWorkDays(startDateSTE, backPayEndDateRelateTo, workPattern);
      insideSTEAmount = insideSTEDayCountsWP * singleDayBackPay;
      finalInsideSTECalculations = isInsideSTE && insideSTEDayCountsWP ? `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern => ${insideSTEDayCountsWP} x ${singleDayBackPay} = $${(insideSTEDayCountsWP*singleDayBackPay).toFixed(2)}` : "" ;

      insideLTEDayCounts = countDays(startDateLTE, beforeSTEStartDate);
      insideLTEDayCountsWP = countWorkDays(startDateLTE, beforeSTEStartDate, workPattern);
      insideLTEAmount = insideLTEDayCountsWP * singleDayBackPay;
      
      outsideLTEDayCountsWP = countWorkDays(backPayStartDateRelateTo, backPayEndDateRelateTo, workPattern);
      outsideLTEDayCounts = countDays(backPayStartDateRelateTo, backPayStartDateRelateTo);

      finalOutsideLTEDayCountsWP = isOutsideLTE ? outsideLTEDayCountsWP : 0;
      finalInsideSTEDaysWPCount = isInsideSTE ? insideSTEDayCountsWP : 0;
      outsideLTEAmount = outsideLTEDayCountsWP * singleDayBackPay;
      
      finalInsideLTECalculations = isInsideSTE && insideLTEDayCountsWP ? `${startDateLTE} — ${beforeSTEStartDate} ${insideLTEDayCountsWP} days work pattern => ${insideLTEDayCountsWP} x ${singleDayBackPay} = $${(insideLTEDayCountsWP*singleDayBackPay).toFixed(2)}` : "" ;

      finalOutsideLTECalculations =  isInsideLTE && isOutsideLTE && outsideLTEDayCountsWP ? `${backPayStartDateRelateTo} — ${beforeLTEStartDate} = ${outsideLTEDayCountsWP} days work pattern => ${outsideLTEDayCountsWP} x ${singleDayBackPay} = $${(singleDayBackPay*outsideLTEDayCountsWP).toFixed(2)}` : "";

      insidePeriodSTEDatesOverlap = `${startDateSTE} — ${backPayEndDateRelateTo}`;

      insideLTE = {...insideLTE, beforeSTEStartDate, backPayEndDateRelateTo, insideLTEAmount,
        finalInsideLTECalculations, insideLTEDayCounts, insideLTEDayCountsWP };

      outsideLTE = {...outsideLTE, beforeLTEStartDate, outsideLTEDayCountsWP, outsideLTEDayCounts, finalOutsideLTECalculations, outsideLTEAmount };
      
      insideSTE = {...insideSTE, insideSTEDayCountsWP, insideSTEDayCount,finalInsideSTECalculations, insideSTEAmount };

    }
    else {
      insideSTEDayCount = countDays(startDateSTE, backPayEndDateRelateTo);
      insideSTEDayCountsWP = countWorkDays(startDateSTE, backPayEndDateRelateTo, workPattern);
      insideSTEAmount = insideSTEDayCountsWP * singleDayBackPay;
      finalInsideSTECalculations = isInsideSTE && insideSTEDayCountsWP ? `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern => ${insideSTEDayCountsWP} x ${singleDayBackPay} = $${(insideSTEDayCountsWP*singleDayBackPay).toFixed(2)}` : "" ;
      
      insideLTEDayCounts = countDays(startDateLTE, beforeSTEStartDate);
      insideLTEDayCountsWP = countWorkDays(startDateLTE, beforeSTEStartDate, workPattern);
      insideLTEAmount = insideLTEDayCountsWP * singleDayBackPay;
      
      outsideLTEDayCountsWP = countWorkDays(backPayStartDateRelateTo, beforeLTEStartDate, workPattern);
      outsideLTEDayCounts = countDays(backPayStartDateRelateTo, beforeLTEStartDate);

      finalOutsideLTEDayCountsWP = isOutsideLTE ? outsideLTEDayCountsWP : 0;
      finalInsideSTEDaysWPCount = isInsideSTE ? insideSTEDayCountsWP : 0;
      outsideLTEAmount = outsideLTEDayCountsWP * singleDayBackPay;
      
      finalInsideLTECalculations = isInsideSTE && insideLTEDayCountsWP ? `${startDateLTE} — ${beforeSTEStartDate} ${insideLTEDayCountsWP} days work pattern => ${insideLTEDayCountsWP} x ${singleDayBackPay} = $${(insideLTEDayCountsWP*singleDayBackPay).toFixed(2)}` : "" ;

      finalOutsideLTECalculations =  isInsideLTE && isOutsideLTE && outsideLTEDayCountsWP ? `${backPayStartDateRelateTo} — ${beforeLTEStartDate} = ${outsideLTEDayCountsWP} days work pattern => ${outsideLTEDayCountsWP} x ${singleDayBackPay} = $${(singleDayBackPay*outsideLTEDayCountsWP).toFixed(2)}` : "";

      insidePeriodSTEDatesOverlap = `${startDateSTE} — ${backPayEndDateRelateTo}`;

      insideLTE = {...insideLTE, beforeSTEStartDate, backPayEndDateRelateTo, insideLTEAmount,
        finalInsideLTECalculations, insideLTEDayCounts, insideLTEDayCountsWP };

      outsideLTE = {...outsideLTE, beforeLTEStartDate, outsideLTEDayCountsWP, outsideLTEDayCounts, finalOutsideLTECalculations, outsideLTEAmount };
      
      insideSTE = {...insideSTE, insideSTEDayCountsWP, insideSTEDayCount,finalInsideSTECalculations, insideSTEAmount };
    }

    totalBackPayInsideLTE = (workDaysCounted * singleDayBackPay).toFixed(2);

      datesEarningsAndPeriodsRelatedTo = {
        insideSTE: insideSTEDayCount && insideSTEDayCountsWP ? {
          ...insideSTE
      }: 
      undefined,
      insideLTE: isInsideLTE && insideLTEDayCountsWP ? {
        ...insideLTE
      } : undefined,
      outsideLTE: isOutsideLTE && outsideLTEDayCountsWP ? {
        ...outsideLTE
      } : isOutsideLTE && outsideLTEDayCounts ? {
        ...outsideLTE
      } : undefined,
      
    };
    let tempDatesEarningsAndPeriodsRelatedTo = datesEarningsAndPeriodsRelatedTo;
      return { 
        totalBackPayPeriodOverlapDateSTE: { 
          startDateSTE, backPayRelateToEndDate: backPayEndDateRelateTo, totalBackPayInsideSTE: insideSTEAmount ? insideSTEAmount : 0,
        },
        totalInsideLTE: { 
          startDateLTE, beforeLTEStartDate, totalBackPayInsideLTE: Number(totalBackPayInsideLTE) 
        },
        totalOutSideLTE: { 
          outsideLTEDate: backPayStartDateRelateTo, beforeLTEStartDate, totalBackPayOutsideLTE, outsidePeriodLTEDatesOverlap: finalOutsideLTECalculations,
      },
        totalDayCountsPayRelateTo: { 
          payPeriodStartDateRelateTo: backPayStartDateRelateTo, payPeriodEndDateRelateTo: backPayEndDateRelateTo, totalDayCountsNoWP: daysCountedRelatedTo, payPeriodRelateToWPDayCounts
        },
        totalDayCountsWP: {
          outsideLTEDaysWPCount: finalOutsideLTEDayCountsWP, insideLTEDaysWPCount: insideLTEDayCountsWP, insideSTEDaysWPCount: finalInsideSTEDaysWPCount, totalDayCountWPForBackPay: payPeriodRelateToWPDayCounts 
          },
        workPattern,
        datesEarningsAndPeriodsRelatedTo, 
        singleDayBackPay,
        singleDayCalculations,
        dayCounts: {
          totalDayCounts,
          totalWPDayCounts: workDaysCounted
        },
        backPay: formatIntoNumber(backPayEarnings),
        isDofi: isDofi ? true : false,
        isDHB, dates: {
          startDateSTE: startDateSTE,
          endDateSTE: endDateSTE,
          startDateLTE: startDateLTE,
          endDateLTE: endDateLTE,
        }
      }
    } 
    else if(!isDHB) {
      dateObject = getFinancialYears(endDateLTE);

      if(dateObject){
        const { 
          currentFinancialYearStart, 
          previousFinancialYearEnd,
          currentFinancialPeriod,
          previousFinancialPeriod,
          currentFinancialYearEnd,
          previousFinancialYearStart   
        } = dateObject;

        let steAmountNotDHB, steAmountNotDHBCalculations, steAmountNotDHBCalculationsPartial, periodsInSTENotDHB, outsideLTEDayCount, outsideLTEWPDayCount,periodsInSTENotDHBStart, periodsInSTENotDHBEnd, countedDays, countedWorkDays, amountOutsideLTE, amountInsideLTE;

        let tempInsideLTEPreviousFinancialYear: InsideLTENotDHB = {
          insideLTEPrevFinYearCalculations: "",
          insideLTEPrevFinYearCalculationsPartial: "",
          insideLTEPrevFinYearDayCounts: 0,
          insideLTEPrevFinYearWPDayCounts: 0,
          insideLTEPrevFinYearAmount: 0,
          insideLTEPrevFinYearPeriods:  {
            startDateLTEOrRelateTo: "",
            backpaymentRelateToEndDate: "",
          },
        }

        let tempOutsideLTENotDHB : OutsideLTENotDHB ={
          outsideLTECalculations: "",
          outsideLTECalculationsPartial: "",
          outsidePeriodDates: {
            backPayStartDateRelateTo: "",
            backPayEndDateRelateTo: "",
          },
          outsideLTEAmount: 0,
          outsideLTEDayCount: 0,
          outsideLTEWPDayCount: 0,
        }

        let tempPreviousFinancialYearOutsideLTE : OutsidePreviousLTEDates = {
          outsideLTEDates: {
            backPayStartDateRelateTo: "",
            backPayEndDateRelateTo: "",
          },
          outsideLTECalculations: "",
          outsideLTECalculationsPartial: "",
          outsideDayLTEDayCount: 0,
          outsideDayLTEWPDayCount: 0,
        }

          tempEndDateRelatedTo  = createDateFormat(backPayEndDateRelateTo);
          backPaymentPaidEndDate = createDateFormat(backPayPaidEndDate);
          currentFinancialYear = createDateFormat(currentFinancialYearStart);
          if(currentFinancialYearStart && tempEndDateRelatedTo  instanceof Date &&
            currentFinancialYear instanceof Date && backPaymentPaidEndDate instanceof Date
          ){
            isCurrentYear = isCurrentFinancialYear(tempEndDateRelatedTo, currentFinancialYear, backPaymentPaidEndDate);
       
            if(isCurrentYear)
            {
              if(isDofi)
              {
                if (isInsideSTE && isInsideLTE && isOutsideLTE){

                  insideSTEDayCountsWP = countWorkDays(createDateFormat(startDateSTE), createDateFormat(backPayEndDateRelateTo), workPattern);

                  insideSTEAmount = singleDayBackPay * insideSTEDayCountsWP;
                  steAmountNotDHB = insideSTEAmount;

                  insideSTEDayCount = countDays(startDateSTE, backPayEndDateRelateTo);
                  finalInsideSTECalculations = `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern = $${singleDayBackPay} * ${insideSTEDayCountsWP} = $${insideSTEAmount}`;

                  steAmountNotDHBCalculations = finalInsideSTECalculations;
                  finalInsideSTECalculationsPartial = `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern = $${singleDayBackPay} * ${insideSTEDayCountsWP} = `;
                  steAmountNotDHBCalculationsPartial = finalInsideSTECalculationsPartial;
                  periodsInSTENotDHB = `${startDateSTE} — ${backPayEndDateRelateTo}`;
                  insideSTE =  {
                    ...insideSTE, insideSTEDayCount, insideSTEDayCountsWP, startDateSTE, backPayEndDateRelateTo, finalInsideSTECalculations, finalInsideSTECalculationsPartial, insideSTEAmount,
                    } 
                  //inside lte values
                  insideLTEDayCounts = countDays(startDateLTE, beforeSTEStartDate);
                  insideLTEDayCountsWP = countWorkDays(startDateLTE, beforeSTEStartDate, workPattern);
                  insideLTEAmount = insideLTEDayCountsWP * singleDayBackPay;   

                  insideLTE = {...insideLTE, beforeSTEStartDate, backPayEndDateRelateTo, insideLTEAmount,
                    finalInsideLTECalculations, insideLTEDayCounts, insideLTEDayCountsWP 
                  };
                  insideLTECurrentFinancialYear = `Keep the rest in this current financial year ${currentFinancialPeriod}`

                }else if(isInsideSTE && isInsideLTE && !isOutsideLTE)
                {
                  //inside ste values
                  insideSTEDayCountsWP = countWorkDays(createDateFormat(startDateSTE), createDateFormat(backPayEndDateRelateTo), workPattern);
                  insideSTEAmount = singleDayBackPay * insideSTEDayCountsWP;
                  steAmountNotDHB = insideSTEAmount;
                  insideSTEDayCount = countDays(startDateSTE, backPayEndDateRelateTo);
                  finalInsideSTECalculations = `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern = $${singleDayBackPay} * ${insideSTEDayCountsWP} = $${insideSTEAmount}`;
                  steAmountNotDHBCalculations = finalInsideSTECalculations;
                  finalInsideSTECalculationsPartial = `${startDateSTE} — ${backPayEndDateRelateTo} ${insideSTEDayCountsWP} days work pattern = $${singleDayBackPay} * ${insideSTEDayCountsWP} = `;
                  steAmountNotDHBCalculationsPartial = finalInsideSTECalculationsPartial;
                  periodsInSTENotDHB = `${startDateSTE} — ${backPayEndDateRelateTo}`;
                  insideSTE =  {
                    ...insideSTE, insideSTEDayCount, insideSTEDayCountsWP, startDateSTE, backPayEndDateRelateTo, finalInsideSTECalculations, finalInsideSTECalculationsPartial, insideSTEAmount,
                    } 
                  //inside lte values
                  insideLTEDayCounts = countDays(startDateLTE, beforeSTEStartDate);
                  insideLTEDayCountsWP = countWorkDays(startDateLTE, beforeSTEStartDate, workPattern);
                  insideLTEAmount = insideLTEDayCountsWP * singleDayBackPay;   

                  insideLTE = {...insideLTE, beforeSTEStartDate, backPayEndDateRelateTo, insideLTEAmount,
                    finalInsideLTECalculations, insideLTEDayCounts, insideLTEDayCountsWP 
                  };
                  insideLTECurrentFinancialYear = `Keep the rest in this current financial year ${currentFinancialPeriod}`
                }
                else if(!isInsideSTE && isInsideLTE && !isOutsideLTE){
                  insideLTE = {...insideLTE, beforeSTEStartDate, backPayEndDateRelateTo, insideLTEAmount, finalInsideLTECalculations, insideLTEDayCounts, insideLTEDayCountsWP 
                  };

                }
                else if(!isInsideSTE && isInsideLTE && !isOutsideLTE){
                  // completed
                  insideLTE = {...insideLTE, beforeSTEStartDate, backPayEndDateRelateTo, insideLTEAmount, finalInsideLTECalculations, insideLTEDayCounts, insideLTEDayCountsWP 
                  };

                }
          
              }
              else if(!isDofi){
                // inside LTE DOSI current financial year, not needed
              }
            
            }
            else if(!isCurrentYear)
            {

              if(isDofi){
                if(isInsideLTE && !isOutsideLTE){
                  //only inside previous LTE part
                  countedDays = countDays(backPayStartDateRelateTo, backPayEndDateRelateTo);
                  countedWorkDays = countWorkDays(backPayStartDateRelateTo, backPayEndDateRelateTo, workPattern);

                //here currently 22/7/2024 completed this part
                  tempInsideLTEPreviousFinancialYear = {...tempInsideLTEPreviousFinancialYear, insideLTEPrevFinYearCalculations: `${backPayStartDateRelateTo} — ${backPayEndDateRelateTo} ${countedWorkDays} work pattern days => $${singleDayBackPay} / ${countedWorkDays} = ${formatResult(Number(backPayNumber.toFixed(2)))}`,
                    insideLTEPrevFinYearCalculationsPartial: `${backPayStartDateRelateTo} — ${backPayEndDateRelateTo} ${countedWorkDays} work pattern days => $${singleDayBackPay} / ${countedWorkDays} = `,
                    insideLTEPrevFinYearDayCounts: countedDays,
                    insideLTEPrevFinYearWPDayCounts: countedWorkDays,
                    insideLTEPrevFinYearAmount: backPayNumber, insideLTEPrevFinYearPeriods: {
                      startDateLTEOrRelateTo: backPayStartDateRelateTo, backpaymentRelateToEndDate: backPayEndDateRelateTo,
                    }
                    
                  };
                  
                }
                else if(isInsideLTE && isOutsideLTE && !isInsideSTE){
                  // inside LTE previous financial year and outside LTE
                  countedDays = countDays(startDateLTE, backPayEndDateRelateTo);
                  countedWorkDays = countWorkDays(startDateLTE, backPayEndDateRelateTo, workPattern);

                  outsideLTEDayCount = countDays(backPayStartDateRelateTo, beforeLTEStartDate);
                  outsideLTEWPDayCount = countWorkDays(backPayStartDateRelateTo, beforeLTEStartDate, workPattern);

                  amountInsideLTE = singleDayBackPay * countedWorkDays;
                  amountOutsideLTE = singleDayBackPay * outsideLTEWPDayCount;

                //here currently 22/7/2024
                  tempInsideLTEPreviousFinancialYear = {...tempInsideLTEPreviousFinancialYear, insideLTEPrevFinYearCalculations: `${startDateLTE} — ${backPayEndDateRelateTo} ${countedWorkDays} work pattern days => $${singleDayBackPay} / ${countedWorkDays} = ${formatResult(Number(backPayNumber.toFixed(2)))}`,
                    insideLTEPrevFinYearCalculationsPartial: `${startDateLTE} — ${backPayEndDateRelateTo} ${countedWorkDays} work pattern days => $${singleDayBackPay} / ${countedWorkDays} = `,
                    insideLTEPrevFinYearDayCounts: countedDays,
                    insideLTEPrevFinYearWPDayCounts: countedWorkDays,
                    insideLTEPrevFinYearAmount: amountInsideLTE, insideLTEPrevFinYearPeriods: {
                      startDateLTEOrRelateTo: startDateLTE, backpaymentRelateToEndDate: backPayEndDateRelateTo,
                    }
                    
                  };

                  tempOutsideLTENotDHB = {
                    ...tempOutsideLTENotDHB,
                    outsideLTECalculations: `${backPayStartDateRelateTo} — ${beforeLTEStartDate} ${outsideLTEWPDayCount} work pattern days => $${singleDayBackPay} * ${outsideLTEWPDayCount} = $${amountInsideLTE}`,
                    outsideLTECalculationsPartial: `${backPayStartDateRelateTo} — ${beforeLTEStartDate} ${outsideLTEWPDayCount} work pattern days => $${singleDayBackPay} * ${outsideLTEWPDayCount} = `,
                    outsidePeriodDates: backPayStartDateRelateTo && beforeLTEStartDate && {
                      backPayStartDateRelateTo: backPayStartDateRelateTo ? backPayStartDateRelateTo: "",
                      backPayEndDateRelateTo: backPayEndDateRelateTo ? backPayEndDateRelateTo : "",
                    },
                    outsideLTEAmount: amountOutsideLTE ? amountOutsideLTE : 0,
                    outsideLTEDayCount: outsideLTEDayCount ? outsideLTEDayCount : 0,
                    outsideLTEWPDayCount: outsideLTEWPDayCount ? outsideLTEWPDayCount : 0,
                  }
  
                }
                else if( !isInsideLTE && isOutsideLTE ){
                  //KHT not coming to this part
                  // not in lTE only outsideLTE
               
                  countedDays = countDays(startDateLTE, backPayEndDateRelateTo);
                  countedWorkDays = countWorkDays(startDateLTE, backPayEndDateRelateTo, workPattern);
                  let greaterOutOfLTEDate = createDateFormat(beforeLTEStartDate) > createDateFormat(backPayEndDateRelateTo) ? beforeLTEStartDate : backPayEndDateRelateTo;

                  outsideLTEDayCount = countDays(backPayStartDateRelateTo, backPayEndDateRelateTo);
                  outsideLTEWPDayCount = countWorkDays(backPayStartDateRelateTo, greaterOutOfLTEDate, workPattern);

                  amountOutsideLTE = singleDayBackPay * outsideLTEWPDayCount;
         
                  tempOutsideLTENotDHB = {
                    ...tempOutsideLTENotDHB,
                    outsideLTECalculations: `${backPayStartDateRelateTo} — ${beforeLTEStartDate} ${outsideLTEWPDayCount} work pattern days => $${singleDayBackPay} * ${outsideLTEWPDayCount} = $${amountOutsideLTE}`,
                    outsideLTECalculationsPartial: `${backPayStartDateRelateTo} — ${beforeLTEStartDate} ${outsideLTEWPDayCount} work pattern days => $${singleDayBackPay} * ${outsideLTEWPDayCount} = `,
                    outsidePeriodDates: backPayStartDateRelateTo && beforeLTEStartDate && {
                      backPayStartDateRelateTo: backPayStartDateRelateTo ? backPayStartDateRelateTo: "",
                      backPayEndDateRelateTo: backPayEndDateRelateTo ? backPayEndDateRelateTo : "",
                    },
                    outsideLTEAmount: amountOutsideLTE ? amountOutsideLTE : 0,
                    outsideLTEDayCount: outsideLTEDayCount ? outsideLTEDayCount : 0,
                    outsideLTEWPDayCount: outsideLTEWPDayCount ? outsideLTEWPDayCount : 0,
                   
                  };

                }

              }else if(!isDofi) {

                if(isInsideLTE && !isOutsideLTE){

                  countedDays = countDays(backPayStartDateRelateTo, backPayEndDateRelateTo);
                  countedWorkDays = countWorkDays(backPayStartDateRelateTo, backPayEndDateRelateTo, workPattern);

                  tempInsideLTEPreviousFinancialYear = {...tempInsideLTEPreviousFinancialYear, insideLTEPrevFinYearCalculations: `${backPayStartDateRelateTo} — ${backPayEndDateRelateTo} ${countedWorkDays} work pattern days => $${singleDayBackPay} / ${countedWorkDays} = ${formatResult(Number(backPayNumber.toFixed(2)))}`,
                    insideLTEPrevFinYearCalculationsPartial: `${backPayStartDateRelateTo} — ${backPayEndDateRelateTo} ${countedWorkDays} work pattern days => $${singleDayBackPay} / ${countedWorkDays} = `,
                    insideLTEPrevFinYearDayCounts: countedDays,
                    insideLTEPrevFinYearWPDayCounts: countedWorkDays,
                    insideLTEPrevFinYearAmount: backPayNumber, insideLTEPrevFinYearPeriods: {
                      startDateLTEOrRelateTo: backPayStartDateRelateTo, backpaymentRelateToEndDate: backPayEndDateRelateTo,
                    }
                    
                  };
                }else if (isInsideLTE && isOutsideLTE){
                  countedDays = countDays(startDateLTE, backPayEndDateRelateTo);
                  countedWorkDays = countWorkDays(startDateLTE, backPayEndDateRelateTo, workPattern);

                  outsideLTEDayCount = countDays(backPayStartDateRelateTo, beforeLTEStartDate);
                  outsideLTEWPDayCount = countWorkDays(backPayStartDateRelateTo, beforeLTEStartDate, workPattern);

                  amountInsideLTE = singleDayBackPay * countedWorkDays;
                  amountOutsideLTE = singleDayBackPay * outsideLTEWPDayCount;

                  tempInsideLTEPreviousFinancialYear = {...tempInsideLTEPreviousFinancialYear, insideLTEPrevFinYearCalculations: `${startDateLTE} — ${backPayEndDateRelateTo} ${countedWorkDays} work pattern days => $${singleDayBackPay} / ${countedWorkDays} = ${formatResult(Number(backPayNumber.toFixed(2)))}`,
                    insideLTEPrevFinYearCalculationsPartial: `${startDateLTE} — ${backPayEndDateRelateTo} ${countedWorkDays} work pattern days => $${singleDayBackPay} / ${countedWorkDays} = `,
                    insideLTEPrevFinYearDayCounts: countedDays,
                    insideLTEPrevFinYearWPDayCounts: countedWorkDays,
                    insideLTEPrevFinYearAmount: amountInsideLTE, insideLTEPrevFinYearPeriods: {
                      startDateLTEOrRelateTo: startDateLTE, backpaymentRelateToEndDate: backPayEndDateRelateTo,
                    }
                    
                  };

                  tempOutsideLTENotDHB = {
                    ...tempOutsideLTENotDHB,
                    outsideLTECalculations: `${backPayStartDateRelateTo} — ${beforeLTEStartDate} ${outsideLTEWPDayCount} work pattern days => $${singleDayBackPay} * ${outsideLTEWPDayCount} = $${amountInsideLTE}`,
                    outsideLTECalculationsPartial: `${backPayStartDateRelateTo} — ${beforeLTEStartDate} ${outsideLTEWPDayCount} work pattern days => $${singleDayBackPay} * ${outsideLTEWPDayCount} = `,
                    outsidePeriodDates: backPayStartDateRelateTo && beforeLTEStartDate && {
                      backPayStartDateRelateTo: backPayStartDateRelateTo ? backPayStartDateRelateTo: "",
                      backPayEndDateRelateTo: backPayEndDateRelateTo ? backPayEndDateRelateTo : "",
                    },
                    outsideLTEAmount: amountOutsideLTE ? amountOutsideLTE : 0,
                    outsideLTEDayCount: outsideLTEDayCount ? outsideLTEDayCount : 0,
                    outsideLTEWPDayCount: outsideLTEWPDayCount ? outsideLTEWPDayCount : 0,
                  }
                }else if (!isInsideLTE && isOutsideLTE){

                  outsideLTEDayCount = countDays(backPayStartDateRelateTo, backPayEndDateRelateTo);
                  outsideLTEWPDayCount = countWorkDays(backPayStartDateRelateTo, backPayEndDateRelateTo, workPattern);

                  amountOutsideLTE = singleDayBackPay * outsideLTEWPDayCount;

                  tempOutsideLTENotDHB = {
                    ...tempOutsideLTENotDHB,
                    outsideLTECalculations: `${backPayStartDateRelateTo} — ${backPayEndDateRelateTo} ${outsideLTEWPDayCount} work pattern days => $${singleDayBackPay} * ${outsideLTEWPDayCount} = $${amountOutsideLTE}`,
                    outsideLTECalculationsPartial: `${backPayStartDateRelateTo} — ${backPayEndDateRelateTo} ${outsideLTEWPDayCount} work pattern days => $${singleDayBackPay} * ${outsideLTEWPDayCount} = `,
                    outsidePeriodDates: backPayStartDateRelateTo && backPayEndDateRelateTo && {
                      backPayStartDateRelateTo: backPayStartDateRelateTo ? backPayStartDateRelateTo: "",
                      backPayEndDateRelateTo: backPayEndDateRelateTo ? beforeLTEStartDate : "",
                    },
                    outsideLTEAmount: amountOutsideLTE ? amountOutsideLTE : 0,
                    outsideLTEDayCount: outsideLTEDayCount ? outsideLTEDayCount : 0,
                    outsideLTEWPDayCount: outsideLTEWPDayCount ? outsideLTEWPDayCount : 0,
                  }

                }

              }
              
            }
          }
          
        datesEarningsAndPeriodsRelatedTo = {
          insideSTE: insideSTEDayCount && insideSTEDayCountsWP ? {
            ...insideSTE, insideSTEDayCount, insideSTEDayCountsWP, startDateSTE, backPayEndDateRelateTo, finalInsideSTECalculations, finalInsideSTECalculationsPartial, insideSTEAmount,
            } : undefined,
          insideLTE: {...insideLTE},
          outsideLTE: {...outsideLTE}
        }
         
        let totalWPDayCounts = 0;
        return { 
          totalBackPayPeriodOverlapDateSTE: { startDateSTE, backPayRelateToEndDate: backPayEndDateRelateTo, totalBackPayInsideSTE: 0 },
          totalInsideLTE: { startDateLTE, beforeLTEStartDate, totalBackPayInsideLTE: 0 },
          totalOutSideLTE: { outsideLTEDate: backPayStartDateRelateTo, beforeLTEStartDate, totalBackPayOutsideLTE: 0 }, datesEarningsAndPeriodsRelatedTo,
          totalDayCounts: { payPeriodStartDateRelateTo: backPayStartDateRelateTo, payPeriodEndDateRelateTo: backPayEndDateRelateTo, totalDayCountsNoWP: daysCountedRelatedTo},
          totalDayCountsWP: { outsideLTEDaysWPCount: outsideLTEDayCounts, insideLTEDaysWPCount: insideLTEDayCounts, insideSTEDaysWPCount: insideSTEDayCount, totalDayCountWPForBackPay: totalWPDayCounts }, 
          singleDayBackPay, 
          singleDayCalculations,
          dayCounts: {
            totalDayCounts,
            totalWPDayCounts: workDaysCounted
          },
          isDofi: isDofi ? true : false,
          isDHB, dates, backPayDates, nonDHBResults: {
            currentFinYear: {
              insideSTECurrentFinancialYear: {
                steAmountNotDHB: steAmountNotDHB ? steAmountNotDHB : 0,
                steAmountNotDHBCalculations: steAmountNotDHBCalculations ?  steAmountNotDHBCalculations : "",
                steAmountNotDHBCalculationsPartial: steAmountNotDHBCalculationsPartial ? steAmountNotDHBCalculationsPartial : "",
                periodsInSTENotDHB: periodsInSTENotDHB ? periodsInSTENotDHB : "",
                periodsInSTENotDHBStart: startDateSTE && isInsideSTE ? startDateSTE : "",
                periodsInSTENotDHBEnd: startDateSTE && backPayEndDateRelateTo ? backPayEndDateRelateTo : "",
                steWorkPatternDayCounts: insideSTEDayCountsWP ? insideSTEDayCountsWP : 0,
                steDayCounts: insideSTEDayCount ? insideSTEDayCount : 0,
              },
              insideLTECurrentFinancialYear: typeof insideLTECurrentFinancialYear === "object" ? insideLTECurrentFinancialYear : `Keep ${isInsideSTE ? "the rest" : "all"} in this current financial year which is ${currentFinancialPeriod}, as it is received in the financial period it is paid. Financial period start date is ${currentFinancialYearStart}. Do not need to alter anything in LTE for this back payment amount $${backPayEarnings} paid ${backPayPaidStartDate} — ${backPayPaidEndDate}, falls within this current financial period ${currentFinancialPeriod}.`,
              currentFinancialYear: currentFinancialYear ? currentFinancialYearStart : "",
            },
            previousFinYear: {
              insideLTEPreviousFinancialYear: tempInsideLTEPreviousFinancialYear ? 
              {...tempInsideLTEPreviousFinancialYear}: undefined,
              outsideLTENotDHB: tempOutsideLTENotDHB ? 
              {...tempOutsideLTENotDHB}: undefined,
              previousFinancialYearOutsideLTE: tempPreviousFinancialYearOutsideLTE ? 
              {...tempPreviousFinancialYearOutsideLTE } : undefined,
            },
            backPaymentDates: {
              backPaymentStartDate: backPayPaidStartDate ? backPayPaidStartDate: "",
              backPaymentEndDate: backPayPaidEndDate ? backPayPaidEndDate : "",
              backPaymentStartDateRelateTo: backPayStartDateRelateTo ? backPayStartDateRelateTo : "",
              backPaymentEndDateRelateTo: backPaymentEndDateRelateTo ? backPaymentEndDateRelateTo : "",
              beforeLTEStartDate:  beforeLTEStartDate ? beforeLTEStartDate : "",
              beforeSTEStartDate:  beforeSTEStartDate ? beforeSTEStartDate : ""
            },
            financialYearDates: {
              currentFinancialYearStart, 
              currentFinancialYearEnd,
              currentFinancialPeriod,
              previousFinancialYearStart,
              previousFinancialYearEnd,
              previousFinancialPeriod,
            },
            booleanPeriods : {
              isInsideSTE,
              isInsideLTE,
              isOutsideLTE,
            }
          },
        } 
        
      } 

  }
  return null;
}

const getCountedWorkDays = (startDate: string, endDate: string, workPattern: PatternOfWork, workPatternInput: PatternOfWorkInput): number => {
  let count

  if(workPattern){
     count = countWorkDays(convertToDateFormat(startDate), convertToDateFormat(endDate), workPattern);
  }
  else {
     count = countWorkDaysNew(convertToDateFormat(startDate), convertToDateFormat(endDate), workPatternInput);
  }
  return count;
}

const calculateBackpay = ({ isDHB, dateObjects , isOutsideLTE, isInsideSTE, isInsideLTE, backPayStartDateRelateTo, backPayEndDateRelateTo, workPattern, backPayEarnings, backPayPaidStartDate, backPayPaidEndDate, isDofi }: CalculateBackPay ): ResultType | null => {

    let selected = isAtLeastOneDaySelected(workPattern);
    const { startDateLTE, endDateLTE, startDateSTE, endDateSTE, beforeSTEStartDate, beforeLTEStartDate, financialStartDates, financialEndDates } = dateObjects;
    if(isDHB && selected)
    {
      //this condition will apportion back pay that is inside STE, LTE and also outside LTE
      let allNeededObjects = getNeededObjects(isDHB, workPattern,backPayEarnings, isOutsideLTE, isInsideLTE, isInsideSTE, startDateLTE, endDateLTE, startDateSTE, endDateSTE, beforeLTEStartDate, beforeSTEStartDate, backPayStartDateRelateTo, backPayEndDateRelateTo, backPayPaidStartDate, backPayPaidEndDate, isDofi);
      return allNeededObjects;
    } else {
      if(!isDHB && selected && backPayPaidStartDate && backPayPaidEndDate){
        let tempBackPaymentStartDate = createDateFormat(backPayPaidStartDate);
        let tempBackPaymentEndDate = createDateFormat(backPayPaidEndDate);
        let tempFinancialStartDate = createDateFormat(financialStartDates);
        let tempFinancialEndDate = createDateFormat(financialEndDates);

        let allNeededObjects = getNeededObjects( isDHB, workPattern,backPayEarnings, isOutsideLTE, isInsideLTE, isInsideSTE, startDateLTE, endDateLTE, startDateSTE, endDateSTE, beforeLTEStartDate, beforeSTEStartDate, backPayStartDateRelateTo, backPayEndDateRelateTo, backPayPaidStartDate, backPayPaidEndDate, isDofi );
        
        
      return allNeededObjects;
    }
    return null;
  }
}

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
    // calculateDHB,
    isInsideSTEBool,
    isOutsideLTEBool,
    isInsideLTEBool,
    calculateBackpay,
    convertStringToNumber,
    formatNumberWithCommas,
    validateDateAndCompleted,
    isAtLeastOneDaySelected,
    formatIntoNumber,
    convertSingleDateToInitialFormat,
    getFinDates,
    getFinDates_,
    getNeededObjects,
    dateLessThanPreviousYear,
    dateGreaterThanCurrentYear,
    formatResult,
    isFirefox,
    validateDateAndDisplay,
    beyondLTE_EndDate,
    getFinancialYears,
    formatFinancialDate,
    countDaysNew,
    countWorkDaysNew,
    // getNeededObjectsNew,
    isAtLeastOneDaySelectedNew,
    differenceInDays,
    // caculateBackpayNew,
    getCountedWorkDays,
    isCurrentFinancialYear
  }