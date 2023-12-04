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

  const createDateFromFormat = (dateString: string) => {
    // console.log({dateString});
      const [day, month, year] = dateString.split('/');
      let formattedDate = `${year}-${month}-${day}`
      return new Date(formattedDate);
  }

  const validateDate = (input: string): boolean => {
    const numericInput = input.replace(/\D/g, '');
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
  
  export default {
    formatDate,
    createDateFromFormat,
    validateDate,
    getLesserDate,
    getGreaterDate
  }