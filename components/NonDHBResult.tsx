'use client';
import React from 'react';
import functions from "../functions";
const  { formatResult } =  functions;

import { ResultType, ValueSTE_LTE_Boolean } from '../types';

interface BackPayResultProps {
  resultType: ResultType,
  resultRef?: React.RefObject<HTMLDivElement>,
  valueSTE_LTE_Boolean: ValueSTE_LTE_Boolean,
  isPaidInCurrentFinancialYear: boolean,
}

const NonDHBResult = ({ resultType, resultRef, valueSTE_LTE_Boolean, isPaidInCurrentFinancialYear }: BackPayResultProps) => {

  if(!resultType){
    return
  }
  if(!valueSTE_LTE_Boolean.isInsideLTE && !valueSTE_LTE_Boolean.isInsideSTE && !valueSTE_LTE_Boolean.isOutsideLTE){
    return;
  }
  const { isInsideSTE, isInsideLTE, isOutsideLTE } = valueSTE_LTE_Boolean;
  const { 
    datesEarningsAndPeriodsRelatedTo, singleDayBackPay, dayCounts,
    singleDayCalculations, isDofi, nonDHBResults, dates, backPayDates } = resultType;
    
    if(!datesEarningsAndPeriodsRelatedTo){
      return;
    }

    if(!nonDHBResults){
      return;
    }

    const {
      currentFinYear, previousFinYear, backPaymentDates, financialYearDates, 
    } = nonDHBResults

    if(!currentFinYear){
      return;
    }
    if(!previousFinYear){
      return;
    }
    const { insideLTEPreviousFinancialYear, outsideLTENotDHB, previousFinancialYearOutsideLTE } = previousFinYear ;

    const { currentFinancialYear, insideSTECurrentFinancialYear, insideLTECurrentFinancialYear } = currentFinYear;
    if(!insideSTECurrentFinancialYear || !currentFinancialYear || !insideLTECurrentFinancialYear){
      return;
    }

    if(!dayCounts){
      return;
    }
    const { totalDayCounts, totalWPDayCounts  } = dayCounts;
    const { steAmountNotDHB, steDayCounts, steAmountNotDHBCalculations, steAmountNotDHBCalculationsPartial, periodsInSTENotDHB, periodsInSTENotDHBStart, periodsInSTENotDHBEnd, steWorkPatternDayCounts } = insideSTECurrentFinancialYear;

  return (
    <div className='flex flex-1 flex-col relative w-full'>
      <p className='font-bold text-2xl text-center py-3'>
        BackPay Apportioned
      </p>
      <div className="">
        { resultType && (
          <div>
            <div>
              <div>{ datesEarningsAndPeriodsRelatedTo && (
                <>
                  { nonDHBResults && (
                      <div className='flex flex-col'>
                        <div className="">
                          <div className='space-x-2'>
                            <span className='font-bold '>
                              Back payment period it relates to:
                            </span>
                            <span className=''>
                              {backPaymentDates?.backPaymentStartDateRelateTo} — {backPaymentDates?.backPaymentEndDateRelateTo}
                            </span>
                          </div>
                          <div className="">
                            <div className="space-x-2">
                              <span className='font-bold '>
                                Day counts for payment date it relates to above: 
                              </span>
                              <span className='italic underline_ '>
                                {totalDayCounts}
                              </span>
                            </div>
                            <div className="space-x-2">
                              <span className='font-bold '>
                                Day counts for payment date it relates to based on work pattern above: 
                              </span>
                              <span className='italic underline_ '>
                                {totalWPDayCounts}
                              </span>
                            </div>
                            <div className="flex flex-row space-x-2">
                              <span className='font-bold '>Single Day calculations: </span>
                              <div className="flex flex-row space-x-2">
                                <span className=''>{singleDayCalculations}</span>
                                <span className='underline_ italic '>${singleDayBackPay}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                      </div>
                      <div className="flex flex-row space-x-3">
                        <div className="space-x-2">
                          <span className=' font-bold'>
                            Current Financial Year Start Date:
                          </span>
                          <span className='justify-center items-center '>
                            {financialYearDates?.currentFinancialPeriod}
                          </span>
                        </div>
                        <div className="space-x-2">
                          <span className=' font-bold'>
                            Previous Financial Year End Date:
                          </span>
                          <span className='justify-center items-center '>
                            {financialYearDates?.previousFinancialPeriod}
                          </span>
                        </div>
                      </div>
                      { isDofi && (
                        <div className='bg-green-500 rounded-md p-3 text-inherit text-white hover:bg-green-700 mt-3'>
                          <div className="flex justify-center pb-3">
                            { isPaidInCurrentFinancialYear && (
                              <p className='text-xl font-bold underline_'>
                                Results for DOFI Non-DHB in current Financial Year
                              </p>
                            ) 
                            }
                          </div>
                          { !isInsideSTE && isOutsideLTE && isInsideLTE && !isPaidInCurrentFinancialYear && (
                            <div className="">
                              <div>
                                <div className="flex justify-center py-2">
                                  <p className='font-bold text-2xl underline_'>Results for DOFI Non-DHB in previous financial year</p>
                                </div>
                                <div className='flex flex-row space-x-2'>
                                  <p className='font-bold'>LTE periods:</p>
                                  <p>{dates?.startDateLTE} — {dates?.endDateLTE}</p>
                                </div>
                                <div className="">
                                  <div className="flex justify-center py-2">
                                    <p className="underline_ font-bold text-xl">Back Pay Dates information</p>
                                  </div>
                                  <div className="flex flex-row space-x-2">
                                    <p className='font-bold'>Back pay paid dates:</p>
                                    <p>{backPayDates?.paidStartDate} — {backPayDates?.paidEndDate}</p>
                                  </div>
                                  <div className="flex flex-row space-x-2">
                                    <p className='font-bold'>Back pay relate to dates:</p>
                                    <p>{backPayDates?.periodStartDate} — {backPayDates?.periodEndDate}</p>
                                  </div>
                                </div>
                                <div className="">
                                  <div className="">
                                    <p>Back payment is <span className='font-bold underline_'>received</span> in the <span className='italic underline_ font-bold'>{financialYearDates?.previousFinancialPeriod}</span> financial year period, which is in the previous financial year. Please refer to information above for more details.</p>
                                    <p></p>
                                  </div>
                                  <div className="">
                                    <p>Back payment <span className='underline_ font-bold'>relates to</span> the <span className='italic underline_ font-bold' >{financialYearDates?.previousFinancialPeriod}</span> financial year, which is the previous financial year period. Please refer to information above for more details.</p>
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="">
                                      <div className="flex justify-center text-inherit font-bold text-xl">
                                        <p className='underline_'>Keep inside LTE</p>
                                      </div>
                                      <div className="">
                                        <p className='font-bold'>Periods inside LTE calculations</p>
                                        <div className="flex flex-row space-x-2">
                                          <p>{insideLTEPreviousFinancialYear?.insideLTEPrevFinYearCalculationsPartial}</p>
                                          <p className='font-bold'>${formatResult(Number(insideLTEPreviousFinancialYear?.insideLTEPrevFinYearAmount.toFixed(2)))}</p>
                                        </div>
                                      </div>
                                      <div className="flex flex-row space-x-2 font-bold text-inherit items-end ">
                                        <p><span className='underline_'>Keep</span> inside LTE <span className='underline_'>${formatResult(Number(insideLTEPreviousFinancialYear?.insideLTEPrevFinYearAmount.toFixed(2)))}</span></p>
                                      </div>
                                    </div>
                                    <div className="">
                                      <div className="flex justify-center text-inherit font-bold text-xl">
                                        <p className='underline_'>
                                          Remove periods outside LTE
                                        </p>
                                      </div>
                                      <div className="">
                                        <p className='font-bold '>Remove amount outside LTE calculations:</p>
                                      </div>
                                      <div className="flex flex-row space-x-2">
                                        <p>{outsideLTENotDHB?.outsideLTECalculationsPartial}</p>
                                        <p className='font-bold'>${formatResult(Number(outsideLTENotDHB?.outsideLTEAmount.toFixed(2)))}</p>
                                      </div>
                                      <div className="flex flex-row text-inherit font-bold space-x-2">
                                        <p className='underline_'>Remove</p>
                                        <p>${formatResult(Number(outsideLTENotDHB?.outsideLTEAmount.toFixed(2)))}</p>
                                        <p>from LTE</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                          }
                          { isInsideSTE && isPaidInCurrentFinancialYear  && insideSTECurrentFinancialYear && (
                            <div>
                              <p className='flex justify-center font-bold text-xl underline_ py-3'>Back pay in STE information</p>
                              <div className='flex flex-row space-x-2'>
                                <span className='font-bold '>
                                  Periods inside STE:
                                </span>
                                <span className='font-bold '>
                                  {insideSTECurrentFinancialYear?.periodsInSTENotDHB}
                                </span>
                              </div>
                              <div className="flex flex-row space-x-4">
                                <div className="space-x-2">
                                  <span className='font-bold '>
                                    Day counts inside STE:
                                  </span>
                                  <span className='underline_ italic  font-bold'>
                                    {insideSTECurrentFinancialYear?.steDayCounts}
                                  </span>
                                </div>
                                <div className="space-x-2">
                                  <span className='font-bold '>
                                    Day counts based on work pattern inside STE:
                                  </span>
                                  <span className='underline_ italic '>
                                    {insideSTECurrentFinancialYear?.steWorkPatternDayCounts}
                                  </span>
                                </div>
                              </div>
                              <div className="">
                                <div>
                                  <span className="font-bold">
                                    Keep this amount inside STE:
                                  </span>
                                </div>
                                <div className="flex flex-row space-x-2">
                                  <span className="font-bold">
                                    {insideSTECurrentFinancialYear?.steAmountNotDHBCalculationsPartial}
                                  </span>
                                  <span className="font-bold underline_">
                                    ${formatResult(Number((insideSTECurrentFinancialYear?.steAmountNotDHB).toFixed(2)))}
                                  </span>
                                </div>
                              </div>
                              <div className="">
                                <div className="flex flex-col">
                                  <span className='flex justify-center font-bold text-xl underline_ py-3'>
                                    LTE Current Financial Period Information
                                  </span>
                                  <span className='font-bold'>
                                      Keep all in LTE as Non-DHB back payment is received in the financial period it is paid. This back pay is paid {backPaymentDates?.backPaymentStartDate} — {backPaymentDates?.backPaymentEndDate}, which is in the <span className="underline_">current</span> financial period {financialYearDates?.currentFinancialPeriod}.
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          { isOutsideLTE && !isPaidInCurrentFinancialYear && (
                          <div> 
                            <div className="">
                              <p className='flex justify-center font-bold text-xl underline_ pb-3'>
                                Result for previous financial period outside LTE
                              </p>
                            </div>
                            <div className="flex flex-row space-x-2">
                              <p className='font-bold'>LTE periods: </p>
                              <p>{dates?.startDateLTE} — {dates?.endDateLTE}</p>
                            </div>
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>Back pay periods paid:</p>
                                <p>{backPaymentDates.backPaymentStartDate} — {backPaymentDates.backPaymentEndDate}</p>
                              </div>
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>Back pay periods it relates to: </p>
                                <div className="flex flex-row space-x-2">
                                  <p>{backPaymentDates.backPaymentStartDateRelateTo} — {backPaymentDates.backPaymentEndDateRelateTo}</p>
                                  <p className='font-bold'>${formatResult(Number(outsideLTENotDHB?.outsideLTEAmount.toFixed(2)))}</p>
                                </div>
                              </div>
                            <div className="flex justify-center font-bold text-lg text-inherit py-2">
                              <p><span className='underline_'>Remove</span> all back pay amount <span className='underline_'>${formatResult(Number(outsideLTENotDHB?.outsideLTEAmount.toFixed(2)))}</span> as it is all outside LTE.</p>
                            </div>
                          </div>
                          )}
                          { !isInsideSTE && isPaidInCurrentFinancialYear  && insideSTECurrentFinancialYear && (
                          <div> 
                            <span className='flex justify-center font-bold text-xl underline_ pb-3'>
                              LTE Current Financial Period
                            </span>
                            {insideLTECurrentFinancialYear && typeof insideLTECurrentFinancialYear === "string" && (
                              <div>
                                <p className='font-bold '>{insideLTECurrentFinancialYear}</p>
                              </div>
                            )
                            }
                          </div>
                          )}
                          { !isInsideSTE && !isOutsideLTE && isInsideLTE && !isPaidInCurrentFinancialYear && (
                            <div>
                              <div className="flex justify-center py-2">
                                <p className='underline_ font-bold text-xl'>Results for DOFI in previous financial year</p>
                              </div>
                              <div className='flex flex-row space-x-2'>
                                <p className='font-bold'>LTE periods:</p>
                                <p>{dates?.startDateLTE} — {dates?.endDateLTE}</p>
                              </div>
                              <div className="">
                                <div className="flex justify-center py-2">
                                  <p className="underline_ font-bold text-xl">Back Pay Dates information</p>
                                </div>
                                <div className="flex flex-row space-x-2 ">
                                  <p className='font-bold'>Back pay paid dates:</p>
                                  <div className="flex flex-row space-x-2">
                                    <p>{backPayDates?.paidStartDate} — {backPayDates?.paidEndDate}</p>
                                    <p className='font-bold italic underline_'>${formatResult(Number(insideLTEPreviousFinancialYear?.insideLTEPrevFinYearAmount.toFixed(2)))}</p>
                                  </div>
                                </div>
                                <div className="flex flex-row space-x-2">
                                  <p className='font-bold'>Back pay relate to dates:</p>
                                  <div className="flex flex-row space-x-2">
                                    <p>{backPayDates?.periodStartDate} — {backPayDates?.periodEndDate}</p>
                                    <p className='font-bold italic underline_'>${formatResult(Number(insideLTEPreviousFinancialYear?.insideLTEPrevFinYearAmount.toFixed(2)))}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="">
                                <div className="font-bold text-inherit ">
                                  <p>Back payment is <span className="font-bold italic underline_">received</span> in the <span className='italic underline_'>{financialYearDates?.previousFinancialPeriod}</span> financial year period, which is in the previous financial year. Please refer to information above for more details.</p>
                                  <p></p>
                                </div>
                                <div className="font-bold text-inherit ">
                                  <p>Back payment <span className='underline_'>relates to</span> the <span className='italic underline_'>{financialYearDates?.previousFinancialPeriod}</span> financial year, which is the previous financial year period. Please refer to information above for more details.</p>
                                </div>
                                <div className="flex justify-center py-3">
                                  <p className='font-bold text-xl underline_'>No apportioning needed for back pay as payments are within LTE periods.</p>
                                </div>
                              </div>
                            </div>
                          )
                          }
                        </div>
                        )
                      }
                      {!isDofi && (
                        <div className='text-white text-inherit rounded-lg my-3 bg-green-500 hover:bg-green-700 p-3'>
                          { !isInsideSTE && !isOutsideLTE && isInsideLTE && !isPaidInCurrentFinancialYear && (
                            <div>
                                <div className="flex justify-center py-3">
                                  <p className='text-xl font-bold underline_'>
                                    Results for DOSI Non-DHB in previous financial year
                                  </p>
                                </div>
                              <div className='flex flex-row space-x-2'>
                                <p className="font-bold">LTE periods:</p>
                                <p>{dates?.startDateLTE} — {dates?.endDateLTE}</p>
                              </div>
                              <div className="">
                                <div className="flex justify-center py-2">
                                  <p className="underline_ font-bold text-xl">Back Pay Dates information</p>
                                </div>
                                <div className="flex flex-row space-x-2">
                                  <p className="font-bold">Back pay paid dates:</p>
                                  <p>{backPayDates?.paidStartDate} — {backPayDates?.paidEndDate}</p>
                                </div>
                                <div className="flex flex-row space-x-2">
                                  <p className="font-bold">Back pay relate to dates:</p>
                                  <p>{backPayDates?.periodStartDate} — {backPayDates?.periodEndDate}</p>
                                </div>
                              </div>
                              <div className="">
                                <div className="font-bold text-inherit ">
                                  <p>Back payment is received in the <span className='italic underline_'>{financialYearDates?.previousFinancialPeriod}</span> financial year period, which is in the previous financial year. Please refer to information above for more details.</p>
                                  <p></p>
                                </div>
                                <div className="font-bold text-inherit ">
                                  <p>Back payment <span className='underline_'>relates to</span> the <span className='italic underline_'>{financialYearDates?.previousFinancialPeriod}</span> financial year, which is the previous financial year period. Please refer to information above for more details.</p>
                                </div>
                                <div className="flex justify-center py-3">
                                  <p className='font-bold underline_'>No apportioning needed for back pay as payments are within LTE dates</p>
                                </div>
                              </div>
                            </div>
                          )
                          }
                          { isInsideSTE && isPaidInCurrentFinancialYear  && insideSTECurrentFinancialYear && (
                            <div>
                              <div className="">
                                <div className="flex justify-center">
                                  <p className='font-bold text-xl underline_'>Result for DOSI Non-DHB current financial year</p>
                                </div>
                                <div className="flex flex-col">
                                  <span className='flex justify-center font-bold text-xl underline_ py-3'>
                                    LTE Current Financial Period Information
                                  </span>
                                  <span className='font-bold'>
                                      Keep all in LTE as Non-DHB back payment is received in the financial period it is paid. This back pay is paid {backPaymentDates?.backPaymentStartDate} — {backPaymentDates?.backPaymentEndDate}, which is in the <span className="underline_">current</span> financial period {financialYearDates?.currentFinancialPeriod}.
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          { !isInsideSTE && isPaidInCurrentFinancialYear  && insideSTECurrentFinancialYear && (
                          <div> 
                            <div className="flex justify-center font-bold text-xl py-2">
                              <p className='underline_'>Result for DOSI Non-DHB in current financial year</p>
                            </div>
                            <div className="flex justify-center">
                              <span className='font-bold text-xl underline_ pb-3'>
                                LTE Current Financial Period Information
                              </span>
                            </div>
                            {insideLTECurrentFinancialYear && typeof insideLTECurrentFinancialYear === "string" && (
                              <div>
                                <p className='font-bold '>{insideLTECurrentFinancialYear}</p>
                              </div>
                            )
                            }
                          </div>
                          )}
                          {!isInsideSTE && isOutsideLTE && !isInsideLTE && !isPaidInCurrentFinancialYear && (
                            <div>
                              <div className="flex justify-center py-2">
                                <p className='font-bold text-xl underline_'>Results for previous financial period DOSI</p>
                              </div>
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>LTE periods:</p>
                                <p>{dates?.startDateLTE} — {dates?.endDateLTE}</p>
                              </div>
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>Back pay paid dates:</p>
                                <p>{backPayDates?.paidStartDate} — {backPayDates?.paidEndDate}</p>
                              </div>
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>Back pay relate to dates:</p>
                                <div className="flex flex-row space-x-2">
                                  <p>{backPayDates?.periodStartDate} — {backPayDates?.periodEndDate}</p>
                                  <p className="font-bold underline_">{formatResult(Number(outsideLTENotDHB?.outsideLTEAmount.toFixed(2)))}</p>
                                </div>
                              </div>
                              <div className="flex justify-center py-3 text-inherit font-bold text-lg">
                                <p>Remove all <span className='underline_'>${formatResult(Number(outsideLTENotDHB?.outsideLTEAmount.toFixed(2)))}</span> from LTE as it is outside the LTE period.</p>
                              </div>
                            </div>
                          )

                          }
                          { !isInsideSTE && isOutsideLTE && isInsideLTE && !isPaidInCurrentFinancialYear && (
                            <div className="">
                              <div>
                                <div className='flex justify-center py-3'>
                                  <p className='font-bold text-xl underline_'>Results for DOSI Non-DHB in previous financial year</p>
                                </div>
                                <div className='flex flex-row space-x-2'>
                                  <p className='font-bold'>LTE periods:</p>
                                  <p>{dates?.startDateLTE} — {dates?.endDateLTE}</p>
                                </div>
                                <div className="">
                                  <div className="flex justify-center py-2">
                                    <p className="underline_ font-bold text-xl">Back Pay Dates information</p>
                                  </div>
                                  <div className="flex flex-row space-x-2">
                                    <p className='font-bold'>Back pay paid dates:</p>
                                    <p>{backPayDates?.paidStartDate} — {backPayDates?.paidEndDate}</p>
                                  </div>
                                  <div className="flex flex-row space-x-2">
                                    <p className='font-bold'>Back pay relate to dates:</p>
                                    <p>{backPayDates?.periodStartDate} — {backPayDates?.periodEndDate}</p>
                                  </div>
                                </div>
                                <div className="">
                                  <div className="">
                                    <p>Back payment is <span className="font-bold italic underline_">received</span> in the <span className='italic underline_ font-bold'>{financialYearDates?.previousFinancialPeriod}</span> financial year period, which is in the previous financial year. Please refer to information above for more details.</p>
                                    <p></p>
                                  </div>
                                  <div className="">
                                    <p>Back payment <span className='underline_ font-bold italic'>relates to</span> the <span className='italic underline_ font-bold'>{financialYearDates?.previousFinancialPeriod}</span> financial year, which is the previous financial year period. Please refer to information above for more details.</p>
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="">
                                      <div className="flex justify-center text-inherit font-bold text-xl">
                                        <p className='underline_'>Keep inside LTE</p>
                                      </div>
                                      <div className="">
                                        <p className='font-bold'>Periods inside LTE calculations</p>
                                        <div className="flex flex-row space-x-2">
                                          <p>{insideLTEPreviousFinancialYear?.insideLTEPrevFinYearCalculationsPartial}</p>
                                          <p className='font-bold underline_'>${formatResult(Number(insideLTEPreviousFinancialYear?.insideLTEPrevFinYearAmount.toFixed(2)))}</p>
                                        </div>
                                      </div>
                                      <div className="flex flex-row space-x-2 font-bold">
                                        <p><span className='underline_'>Keep</span> inside LTE <span className='underline_'>${formatResult(Number(insideLTEPreviousFinancialYear?.insideLTEPrevFinYearAmount.toFixed(2)))}</span></p>
                                      </div>
                                    </div>
                                    <div className="">
                                      <div className="flex justify-center text-inherit font-bold text-xl">
                                        <p className='underline_'>
                                          Remove periods outside LTE
                                        </p>
                                      </div>
                                      <div className="font-bold text-inherit ">
                                        <p>Remove amount outside LTE calculations:</p>
                                      </div>
                                      <div className="flex flex-row space-x-2">
                                        <p>{outsideLTENotDHB?.outsideLTECalculationsPartial}</p>
                                        <p className='font-bold'>${formatResult(Number(outsideLTENotDHB?.outsideLTEAmount.toFixed(2)))}</p>
                                      </div>
                                      <div className="flex flex-row text-inherit font-bold space-x-2">
                                        <p className='underline_'>Remove</p>
                                        <p>${formatResult(Number(outsideLTENotDHB?.outsideLTEAmount.toFixed(2)))}</p>
                                        <p>from LTE</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                          }
                        </div>
                      )
                      }
                    </div>        
                    )
                  }
                </>
              )}
              </div>
            </div>
          </div>
          )
        }
      </div>
    </div>
  );
}

export default NonDHBResult