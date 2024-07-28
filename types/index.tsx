
import React, { MouseEventHandler, FocusEvent, ChangeEvent } from "react";

export interface CustomButtonProps {
  title: String,
  buttonType?: String,
  containerStyles?: string;
  handleClick?: MouseEventHandler <HTMLButtonElement>;
};

export interface IncapacityType {
  dofi: boolean,
  dosi: boolean,
}

export interface NavbarProps {
  isSelected: boolean, 
  data: dataItem[];
  containerStyles?: string;
  handleClick?: MouseEventHandler <HTMLButtonElement>;
};

export interface dataItem {
    title: String,
    onClick: () => void;
};

export interface DatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  onChange?:  String;
};

export interface GrossEarningsInputProps {
  onChange: (data: GrossEarningsData) => void;
};
  
export interface GrossEarningsData {
  startDate: string;
  endDate: string;
  workPattern: { [key: string]: boolean };
};

export interface CompensationInputProps {
  onChange: (data: CompensationData) => void;
};
  
export interface CompensationData {
  startDate: string;
  endDate: string;
};

export interface WorkPattern {
  [day: string]: boolean;
}

export interface NumberInputProps {
  value: string;
  onChange: (newValue: string) => void;
  onBlur:(event: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  
};

export interface FindDateOverlapProps {
  grossEarningsStartDate: string,
  grossEarningsEndDate: string,
  pwcStartDate: string,
  pwcEndDate: string,
};

export type BackPayments = {
  isClicked: boolean,
};

export interface  DayToggleProps {
  day: keyof PatternOfWork;
  type: string,
  handleWorkPatternChange: (day: keyof PatternOfWork, type: 'full' | 'half' | '') => void;
  index: number | string,
  dayType?: string,

};

export type PatternOfWorkInput = {
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
};
//original pattern of work
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
  start: string;
  end: string;
};

export type BlurHandlerProps = {
  value: string;
  setValue: (value: string) => void;
  setIsCompleted: (isCompleted: boolean) => void;
  setError: (hasError: boolean) => void;
};

export interface DateInputProps {
  inputTitle: string;
  inputValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  error: boolean | null;
  inputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  text?: string;
  setDisplayAll?: (value: boolean) => void;
  setValue?: (value: string) => void;
  customStyle?: React.CSSProperties,
  id?: string,
};

export interface OnBlurDate {
  dateValue: string;
  setDateValue: (value: string) => void;
  setDateError: (error: boolean) => void;
  setDateCompleted: (completed: boolean) => void;
  setDisplayAll?: (value: boolean) => void;
};

export type Result = {
  grossEarnings: string;
  grossEarningsStartDate: string;
  grossEarningsEndDate: string;
  daysCounted: string;
  workPatternDaysCounted: string;
  pwcStartDate: string;
  pwcEndDate: string;
  start: string;
  end: string;
  countDaysOverlapWithPWC: string;
  totalGrossForPeriodReduction: string;
  singleDayGrossWP: string;
};

//original
export interface WorkPatternSelectorProps {
  workPattern: Record<string, boolean>;
  handleWorkPatternChange: (day: string) => void;
  isWPSelected: boolean;
  setDisplayAll: (value: boolean) => void;
  setIsClicked: (value: boolean) => void;
}

export interface WorkPatternSelectorPropsInput {
  day: string,
  type: PatternOfWork
}

export interface EarningsInputProp {
  title: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onFocus?: () => void;
  error: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  setDisplayAll: (value: boolean) => void;
  setIsClicked: (value: boolean) => void
}

export interface DhbBackPay {
  dbhBackPayPeriodStartDate: string | Date;
  dbhBackPayPeriodEndDate: string | Date;
  startDateSTE: string | Date;
  endDateSTE: string | Date;
  startDateLTE: string | Date;
  endDateLTE: string | Date;
}

export interface BeforeDate {
  date: string | Date;
  dateFormat?: boolean;
  readableFormat?: boolean;
  dateObjectFormat?: boolean;
}

export interface DateFormats {
  date: string | Date;
  dateFormat?: boolean;
  readableFormat?: boolean;
  dateObjectFormat?: boolean;
}

export interface DateObject {
  startDateLTE: string ;
  endDateLTE: string;
  startDateSTE: string;
  endDateSTE: string;
  beforeLTEStartDate: string  ,
  beforeSTEStartDate: string;
  financialStartDates: string;
  financialEndDates: string;
}

export interface CalculateBackPay {
  isDHB: boolean;
  dateObjects: DateObject;
  isOutsideLTE: boolean;
  isInsideSTE: boolean;
  isInsideLTE: boolean,
  backPayStartDateRelateTo: string;
  backPayEndDateRelateTo: string;
  workPattern: PatternOfWork;
  backPayEarnings: string;
  backPayPaidStartDate: string;
  backPayPaidEndDate: string;
  isDofi: boolean;
}

export interface CalculateBackPayNew {
  isDHB: boolean;
  dateObjects: DateObject;
  isOutsideLTE: boolean;
  isInsideSTE: boolean;
  isInsideLTE: boolean,
  backPayStartDateRelateTo: string;
  backPayEndDateRelateTo: string;
  workPattern: PatternOfWorkInput;
  backPayEarnings: string;
  backPayPaidStartDate: string;
  backPayPaidEndDate: string;
}

//original bottom
// export interface CalculateBackPay {
//   isDHB: boolean;
//   dateObjects: DateObject;
//   isOutsideLTE: boolean;
//   isInsideSTE: boolean;
//   isInsideLTE: boolean,
//   backPayStartDateRelateTo: string;
//   backPayEndDateRelateTo: string;
//   workPattern: PatternOfWork;
//   backPayEarnings: string;
//   backPayPaidStartDate: string;
//   backPayPaidEndDate: string;
//   incapacity: IncapacityType;
// }

export interface TotalBackPayPeriodOverlapDateSTE {
  startDateSTE: string;
  backPayRelateToEndDate: string;
  totalBackPayInsideSTE: number;
}

export interface TotalInsideLTE {
  startDateLTE: string;
  beforeLTEStartDate: string;
  totalBackPayInsideLTE: number;
}

export interface TotalOutSideLTE {
  outsideLTEDate: string;
  beforeLTEStartDate: string;
  totalBackPayOutsideLTE: number;
  outsidePeriodLTEDatesOverlap?: string | undefined;
}

export interface TotalDayCountsPayRelateTo {
  payPeriodStartDateRelateTo: string;
  payPeriodEndDateRelateTo: string;
  totalDayCountsNoWP: number;
  payPeriodRelateToWPDayCounts: number;
}

export interface TotalDayCountsWP {
  outsideLTEDaysWPCount: number | undefined;
  insideLTEDaysWPCount: number | undefined;
  insideSTEDaysWPCount: number | undefined;
  totalDayCountWPForBackPay: number;
}

export interface InsideSTE {
  insideSTEDayCount: number | undefined;
  insideSTEDayCountsWP: number | undefined;
  startDateSTE: string;
  backPayEndDateRelateTo: string;
  finalInsideSTECalculations?: string;
  finalInsideSTECalculationsPartial?: string;
  insideSTEAmount?: number ;
  greaterDateInsideSTE?: string;
}

export interface InsideLTE {
  insideLTEDayCountsWP: number | undefined;
  insideLTEDayCounts: number | undefined;
  finalInsideLTECalculations?: string;
  finalInsideLTECalculationsPartial?: string;
  startDateLTE: string;
  beforeSTEStartDate?: string;
  insidePeriodLTEDatesOverlap?: string;
  backPayEndDateRelateTo?: string;
  backPayStartDateRelateTo?: string;
  insideLTEAmount?: number | undefined; 
}

export interface OutsideLTE {
  backPayStartDateRelateTo: string;
  backPayEndDateRelateTo?: string,
  beforeLTEStartDate: string;
  outsideLTEDayCountsWP: number | undefined;
  outsideLTEDayCounts: number | undefined;
  outsidePeriodLTEDatesOverlap?: string;
  finalOutsideLTECalculations?: string;
  finalOutsideLTECalculationsPartial?: string;
  outsideLTEAmount?: number | undefined;
  
}

export interface DatesEarningsAndPeriodsRelatedTo {
  insideSTE: InsideSTE | undefined ;
  insideLTE: InsideLTE | undefined  ;
  outsideLTE: OutsideLTE | undefined ;
}

export interface FinancialDates {
  currentFinancialYearStart?: string,
  currentFinancialYearEnd?: string,
  previousFinancialYearStart?: string,
  previousFinancialYearEnd?: string,
  nextFinancialYearStart?: string,

}

export interface ValueSTE_LTE_Boolean{
  isInsideSTE: boolean,
  isInsideLTE: boolean,
  isOutsideLTE: boolean,
}

export interface FinancialDateTypes {
  currentFinancialYearStart: string,
  currentFinancialYearEnd: string,
  currentFinancialPeriod: string,
  previousFinancialYearStart: string,
  previousFinancialYearEnd: string,
  previousFinancialPeriod: string,
}

export interface booleanLTE_STE_Values {
  isInsideSTE: boolean,
  isInsideLTE: boolean,
  isOutsideLTE: boolean,
}

export interface InsideSTENotDHB {
  steAmountNotDHB: number;
  steAmountNotDHBCalculations: string,
  steAmountNotDHBCalculationsPartial: string,
  periodsInSTENotDHB: string,
  periodsInSTENotDHBStart: string,
  periodsInSTENotDHBEnd: string,
  steWorkPatternDayCounts: number,
  steDayCounts: number,
}

export interface InsideLTECurrentFinancialYear {
  currentFinYearCalculations?: string,
  currentFinYearCalculationsPartial?: string,
  lteAmountCurrentYearNotDHB?: number,
  keepInLTECurrentFinancialYear?: boolean,
}

export interface CurrentFinancialYearNotDHB {
  insideSTECurrentFinancialYear: InsideSTENotDHB ;
  insideLTECurrentFinancialYear: InsideLTECurrentFinancialYear | string,
  currentFinancialYear?: string,
}

export interface OutsideLTEDates  {
  backPayStartDateRelateTo: string | "",
  backPayEndDateRelateTo: string | "",
}

export interface OutsidePreviousLTEDates {
  outsideLTEDates?: OutsideLTEDates,
  outsideLTECalculations: string | "",
  outsideLTECalculationsPartial?: string | "",
  beforeStartDateLTE?: string,
  outsideDayLTEDayCount: number,
  outsideDayLTEWPDayCount: number,
}

export interface OutsideLTENotDHB {
  outsideLTECalculations: string | "",
  outsideLTECalculationsPartial?: string | "",
  outsidePeriodDates: OutsideLTEDates | "",
  outsideLTEAmount: number,
  outsideLTEDayCount: number,
  outsideLTEWPDayCount: number,
}

export interface PrevDateYears {
  startDateLTEOrRelateTo: string,
  backpaymentRelateToEndDate: string,
}

export interface InsideLTENotDHB {
  insideLTEPrevFinYearCalculations: string,
  insideLTEPrevFinYearCalculationsPartial: string,
  insideLTEPrevFinYearDayCounts: number,
  insideLTEPrevFinYearWPDayCounts: number,
  insideLTEPrevFinYearAmount: number,
  insideLTEPrevFinYearPeriods: PrevDateYears,
}

export interface PreviousFinancialYear {
  insideLTEPreviousFinancialYear?: InsideLTENotDHB | undefined,
  outsideLTENotDHB: OutsideLTENotDHB | undefined,
  previousFinancialYearOutsideLTE?: OutsidePreviousLTEDates | undefined,
}

export interface BackPaymentDates {
  backPaymentStartDate?: string | "",
  backPaymentEndDate?: string | "",
  backPaymentStartDateRelateTo?: string | "",
  backPaymentEndDateRelateTo?: string | "",
  beforeLTEStartDate?: string | "",
  beforeSTEStartDate?: string | "",
}

export interface FinancialDates {
  currentFinancialYearDate: string,
  currentFinancialPeriod: string,
  previousFinancialYearDate: string,
  previousFinancialPeriod: string,
  
}

export interface isInWhichPeriod {
  isInsideSTE: boolean,
  isInsideLTE: boolean,
  isOutsideLTE: boolean,
}

export interface NonDHBResults {
  currentFinYear?: CurrentFinancialYearNotDHB | undefined,
  previousFinYear?: PreviousFinancialYear | undefined,
  backPaymentDates: BackPaymentDates,
  financialYearDates: FinancialDateTypes,
  booleanPeriods?: isInWhichPeriod,
}

export interface DayCounts {
  totalDayCounts: number,
  totalWPDayCounts: number,
}

export interface BackPayDates {
  periodStartDate: string,
  periodEndDate: string,
  paidStartDate: string,
  paidEndDate: string
}

export interface STE_LTE_Dates {
  startDateSTE: string,
  endDateSTE: string,
  startDateLTE: string,
  endDateLTE: string,
}

export interface ResultType {
  totalBackPayPeriodOverlapDateSTE?: TotalBackPayPeriodOverlapDateSTE ,
  totalInsideLTE?: TotalInsideLTE,
  totalOutSideLTE?: TotalOutSideLTE ,
  totalDayCountsPayRelateTo?: TotalDayCountsPayRelateTo,
  totalDayCountsWP?: TotalDayCountsWP,
  totalDayCounts?: object,
  workPattern?: PatternOfWork,
  datesEarningsAndPeriodsRelatedTo: DatesEarningsAndPeriodsRelatedTo ,
  singleDayBackPay?: number,
  singleDayCalculations?: string,
  dayCounts: DayCounts,
  backPay?: number | undefined | null,
  isDofi?: boolean,
  isDHB?: boolean,
  dates?: STE_LTE_Dates,
  backPayDates?: BackPayDates,
  inputRef?: React.RefObject<HTMLDivElement>,
  nonDHBResults?: NonDHBResults,
}

export interface TotalDayCounts {
  payPeriodStartDateRelateTo: string,
  payPeriodEndDateRelateTo: string,
  totalDayCountsNoWP: number,
}

export interface ResultTypeNew {
  totalBackPayPeriodOverlapDateSTE?: TotalBackPayPeriodOverlapDateSTE,
  totalInsideLTE?: TotalInsideLTE | undefined,
  totalOutSideLTE?: TotalOutSideLTE | undefined,
  totalDayCountsPayRelateTo?: TotalDayCountsPayRelateTo,
  totalDayCountsWP?: TotalDayCountsWP,
  totalDayCounts?: TotalDayCounts,
  workPattern: PatternOfWork,
  workPatternInput?: PatternOfWorkInput,
  datesEarningsAndPeriodsRelatedTo?: DatesEarningsAndPeriodsRelatedTo,
  singleDayBackPay?: number,
  singleDayCalculations?: string,
  backPay?: number | undefined | null,
  isDofi: boolean,
  isDHB: boolean,
  inputRef?: React.RefObject<HTMLDivElement>,
  nonDHBResults?: NonDHBResults,
}


