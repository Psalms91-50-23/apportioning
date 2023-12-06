
import { MouseEventHandler, FocusEvent } from "react";

export interface CustomButtonProps {
    title: String,
    buttonType?: String,
    containerStyles?: string;
    handleClick?: MouseEventHandler <HTMLButtonElement>;
}

export interface NavbarProps {
    isSelected: boolean, 
    data: dataItem[];
    containerStyles?: string;
    handleClick?: MouseEventHandler <HTMLButtonElement>;
}

export interface dataItem {
    title: String,
    onClick: () => void;
}

export interface DatePickerProps {
    selectedDate: Date | null;
    onSelectDate: (date: Date | null) => void;
    onChange?:  String;
  }

  export interface GrossEarningsInputProps {
    onChange: (data: GrossEarningsData) => void;
  }
  
  export interface GrossEarningsData {
    startDate: string;
    endDate: string;
    workPattern: { [key: string]: boolean };
  }

  export interface CompensationInputProps {
    onChange: (data: CompensationData) => void;
  }
  
  export interface CompensationData {
    startDate: string;
    endDate: string;
  }

  export interface WorkPattern {
    [day: string]: boolean;
  }

  export interface NumberInputProps {
    value: string;
    onChange: (newValue: string) => void;
    onBlur:(event: FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    
  }

export interface FindDateOverlapProps {
  grossEarningsStartDate: string,
  grossEarningsEndDate: string,
  pwcStartDate: string,
  pwcEndDate: string,
}

export type PatternOfWork = {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
};

export type DateRange = {
  start: Date;
  end: Date;
};

export type OverlapDates = {
  start: string,
  end: string
}

export type BlurHandlerProps = {
  value: string;
  setValue: (value: string) => void;
  setIsCompleted: (isCompleted: boolean) => void;
  setError: (hasError: boolean) => void;
};



// export interface DateOverlapResult {
//   overlapStartDate: string | null;
//   overlapEndDate: string | null;
// }
