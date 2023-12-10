import {  differenceInDays } from "date-fns";
const includeLastDay = 1;

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
  const createDateFromFormat = (dateString: string | Date): Date | undefined => {
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
    }else if( dateString instanceof Date ){
      let year = dateString.getFullYear();
      let month = dateString.getMonth()+1;
      let day = dateString.getDate();
      return new Date(`${year}/${month}/${day}`);
    }   
    return undefined;
  }

  const validateDate = (input: string): boolean => {
    // const numericInput = input.replace(/\D/g, '');
    const dateRegex = /^((\d{2})(\d{2})(\d{2}))|((\d{2})(\d{2})(\d{4}))|((\d{1,2})\/(\d{1,2})\/(\d{2}))|((\d{2})\/(\d{2})\/(\d{2}))|((\d{2})\/(\d{2})\/(\d{4}))|((\d{1,2})\/(\d{2})\/(\d{4}))$/;
    if(dateRegex.test(input)){
        return true;
    }
    return false;
  }

  const getGreaterDate = (date1: Date, date2: Date) => {
    if (date1 > date2) {
      return date1;
    } else {
      return date2;
    }
  }

  const getLesserDate = (date1:Date, date2: Date) => {
    if (date1 < date2) {
      return date1;
    } else {
      return date2;
    }
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

  const  formatNumberWithCommas = (number: number): string => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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

  const convertToInitialDateFormat = (startDate: string, endDate: string ) => {

    const year1 = new Date(startDate).getFullYear();
    const month1 = new Date(startDate).getMonth()+1;
    const day1 = new Date(startDate).getDate();

    const year2 = new Date(endDate).getFullYear();
    const month2 = new Date(endDate).getMonth()+1;
    const day2 = new Date(endDate).getDate();

    return {
      start: `${day1}/${month1}/${year1}`,
      end: `${day2}/${month2}/${year2}`
    }

  }

  const overlapDateRangeString = (grossStartDate: string, grossEndDate: string, pwcStartDate: string, pwcEndDate: string ) => {
      
    let tempGrossStartDate = createDateFromFormat(grossStartDate) ?? new Date(grossStartDate);
    let tempGrossEndDate = createDateFromFormat(grossEndDate) ?? new Date(grossEndDate);
    let tempPWCStartDate = createDateFromFormat(pwcStartDate) ?? new Date(pwcStartDate);
    let tempPWCEndDate = createDateFromFormat(pwcEndDate) ?? new Date(pwcEndDate);
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

  const countDays = (startDateString: string, endDateString: string): number => {
    let tempStartDate = createDateFromFormat(startDateString) ?? new Date(startDateString) ;
    let tempEndDate = createDateFromFormat(endDateString) ?? new Date(endDateString);
    
    let daysCounted: number = (differenceInDays(tempEndDate, tempStartDate))+includeLastDay;
      return daysCounted;
  }; 

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
  

  const formatInputValue = (inputValue: string) => {
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

  const grossEarningInputValueConverted = (input: string): string => {
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

  export default {
    formatDate,
    createDateFromFormat,
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
    formatNumber,
    formatInputValue,
    grossEarningInputValueConverted
  }