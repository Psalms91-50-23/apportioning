'use client';
import React, { useState, useRef, useEffect } from 'react';
import functions from "../functions";
const  { formatNumberWithCommas, formatResult } =  functions;

import { ResultType, STE_LTE_Dates } from '../types';

interface BackPayResultProps {
  resultType: ResultType;
  resultRef?: React.RefObject<HTMLDivElement>;
  allDates?: STE_LTE_Dates;
}

const DHBResult = ({ resultType, resultRef, allDates }: BackPayResultProps ) => {

  const [insideLTEAmount, setInsideLTEAmount] = useState<number| string>("");
  if(!resultType){
    return
  }
  
  const { 
    totalBackPayPeriodOverlapDateSTE, totalInsideLTE, 
    totalDayCountsPayRelateTo, datesEarningsAndPeriodsRelatedTo, singleDayBackPay, backPay, isDofi, dates } = resultType;

  if(!datesEarningsAndPeriodsRelatedTo){
    return
  }
  const { insideSTE, insideLTE, outsideLTE } = datesEarningsAndPeriodsRelatedTo;
  if(insideLTE){
    const { insideLTEAmount } = insideLTE;
  }

  useEffect(() => {
    if(insideLTE?.insideLTEAmount ){
      setInsideLTEAmount(insideLTE.insideLTEAmount);
    }
  }, [insideLTE])
  
  return (
    <div className='flex flex-1 flex-col relative w-full'>
      <span className='font-bold text-2xl text-center py-5'>
          BackPay Apportioned
      </span>
      <div className="">
        { resultType && (
          <div>
            <div className="">
              <div className="">  
                { totalDayCountsPayRelateTo && (
                  <>
                    <div className='flex flex-row'>
                      <p className='font-bold text-xl'>
                        BackPayment period it relates to:
                      </p>
                      <p className='italic text-lg ml-5'>
                        {totalDayCountsPayRelateTo?.payPeriodStartDateRelateTo} — {totalDayCountsPayRelateTo?.payPeriodEndDateRelateTo}
                      </p>
                    </div>
                      <div className="flex flex-row space-x-3">
                        <div className="flex flex-row space-x-3">
                          <p className='text-lg font-bold'>Day counts date above: </p>
                          <p className='text-lg'>
                            {totalDayCountsPayRelateTo?.totalDayCountsNoWP}
                          </p>
                        </div>
                        <div className="flex flex-row space-x-3">
                          <p className='text-lg font-bold'>
                            Day counts work pattern date above: 
                          </p>
                          <p className='text-lg'>
                            {totalDayCountsPayRelateTo?.payPeriodRelateToWPDayCounts}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-row space-x-3">
                          <p className='font-bold text-lg'>
                            Back pay/Bonuses Amount:
                          </p>
                          { backPay && (
                          <p className='text-lg'>
                            ${formatNumberWithCommas(backPay)}
                          </p>
                          )
                          }  
                        </div>
                        <div className="flex flex-row space-x-3">
                          <p className='font-bold text-lg'>
                            Single day calculations: 
                          </p>
                        { backPay && singleDayBackPay && totalDayCountsPayRelateTo?.payPeriodRelateToWPDayCounts && (
                        <p className='italic text-lg'>
                          ${formatNumberWithCommas(backPay)} / {totalDayCountsPayRelateTo?.payPeriodRelateToWPDayCounts} = ${singleDayBackPay}
                        </p>
                          )
                          }
                        </div>
                    </div>
                  </>
                  )
                }
              </div>
            </div>
            { !outsideLTE && !insideLTE && insideSTE && (
              <div className='my-3 bg-green-500 hover:bg-green-700 rounded-lg text-inherit text-white'>
                <div className="p-3">
                  { isDofi ? (
                    <div className="">
                      <div className="flex justify-center">
                        <p className='font-bold text-2xl underline'>Result for DHB DOFI</p>
                      </div>
                      <div className="flex flex-row justify-center py-3">
                        <p className='font-bold text-xl underline'>Back pay inside STE information</p>
                      </div>
                      <div className="flex flex-col space-x-2">
                        <div className="">
                          <p className='font-bold'>Back pay periods inside STE:</p>
                        { insideSTE?.greaterDateInsideSTE ? (
                          <div className='flex flex-col'>
                            <div className=''>
                              <p className="italic">{insideSTE?.greaterDateInsideSTE} — {insideSTE?.backPayEndDateRelateTo}</p>      
                            </div>
                            <div className="flex space-x-2">
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>Day counts:</p>
                                <p className="italic">{insideSTE?.insideSTEDayCount}</p>
                              </div>
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>Day counts work pattern:</p>
                                <p className="italic">{insideSTE?.insideSTEDayCountsWP}</p>
                              </div>
                            </div>
                            <div className="">
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>Keep inside STE:</p>
                                <p>{insideSTE?.finalInsideSTECalculationsPartial}<span className='font-bold underline'>${formatResult(Number(insideSTE?.insideSTEAmount?.toFixed(2)))}</span></p>
                              </div>
                            </div>
                            <div className="">
                              <div className="flex justify-center font-bold py-2">
                                <p className='underline text-xl'>Back pay inside LTE information</p>
                              </div>
                              <div className="">
                                <div className="flex flex-row space-x-2">
                                  <p className='font-bold'>LTE periods:</p>
                                  <p className='italic'>{dates?.startDateLTE} — {dates?.endDateLTE}</p>
                                </div>
                                <div className="flex flex-row space-x-2">
                                  <p className='font-bold'>Back pay relate to periods:</p>
                                  <p className='italic'>{totalDayCountsPayRelateTo?.payPeriodStartDateRelateTo} — {totalDayCountsPayRelateTo?.payPeriodEndDateRelateTo}</p>
                                </div>
                              </div>
                              <div className="flex flex-row text-inherit font-bold space-x-1">
                                <p>Keep</p>
                                <span className='underline'>ALL</span>
                                <p>inside LTE, nothing outside LTE</p>
                              </div>
                            </div>
                          </div>
                        ):(
                          <>
                            <p>{insideSTE?.startDateSTE} — {insideSTE?.backPayEndDateRelateTo}</p>  
                            <div className="flex space-x-2">
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>Day counts:</p>
                                <p className="italic">{insideSTE?.insideSTEDayCount}</p>
                              </div>
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>Day counts work pattern:</p>
                                <p className="italic">{insideSTE?.insideSTEDayCountsWP}</p>
                              </div>
                            </div>
                            <div className="">
                              <div className="flex flex-row space-x-2">
                                <p className='font-bold'>Keep inside STE:</p>
                                <p className="italic">{insideSTE?.finalInsideSTECalculationsPartial}<span className='font-bold underline'>${formatResult(Number(insideSTE?.insideSTEAmount?.toFixed(2)))}</span></p>
                              </div>
                            </div>   
                          </>
                        ) 
                        }
                        </div>
                      </div>
                    </div>
                  ): (
                    <div className='text-inherit font-bold'>
                      <div className="flex justify-center">
                        <p className='font-bold text-2xl underline'>Result for DOSI</p>
                      </div>
                      <div className="">
                        <div className="flex justify-center font-bold py-2">
                          <p className='underline text-xl'>Back pay inside LTE information</p>
                        </div>
                        <div className="">
                          <div className="flex flex-row space-x-2">
                            <p className="font-bold">LTE periods:</p>
                            <p className='italic'>{dates?.startDateLTE} — {dates?.endDateLTE}</p>
                          </div>
                          <div className="flex flex-row space-x-2">
                            <p className="font-bold">Back pay relate to periods:</p>
                            <p className='italic'>{totalDayCountsPayRelateTo?.payPeriodStartDateRelateTo} — {totalDayCountsPayRelateTo?.payPeriodEndDateRelateTo}</p>
                          </div>
                        </div>
                        <div className="flex flex-row text-inherit font-bold space-x-1">
                          <p>Keep</p>
                          <span className='underline'>ALL</span>
                          <p>inside LTE, nothing outside LTE</p>
                        </div>
                      </div>
                    </div>
                  )
                  }
                </div>
              </div>
            )
            }
            { outsideLTE && !insideLTE && !insideSTE && (
              <>
                <div className="flex flex-col py-2 rounded-md bg-green-500 my-3 px-3 text-white w-full">
                  <div className="flex justify-center">
                    {isDofi ? (
                    <>
                      <span className='font-bold text-xl underline py-3'>Result for DHB DOFI</span>
                    </>
                  ): (
                    <>
                      <span className='font-bold text-xl underline py-3'>Result for DHB DOSI</span>
                    </>
                  )
                  }
                </div>
                <div className="flex justify-center py-2">
                  <p className='font-bold text-xl underline'>Back pay outside LTE information</p>
                </div>
                <div className="">
                  <div className="">
                    { totalDayCountsPayRelateTo && (
                      <div>
                        <div className="flex flex-row space-x-2 ">
                          <p className='font-bold'>LTE period: </p>
                          <p className='italic'>{dates?.startDateLTE} — {dates?.endDateLTE}</p>
                        </div>
                        <div className='flex flex-row space-x-2'> 
                          <p className='font-bold'>Back pay periods outside LTE:</p>
                          <div className="flex flex-row space-x-2">
                            <p className="italic"> {totalDayCountsPayRelateTo?.payPeriodStartDateRelateTo} — {totalDayCountsPayRelateTo?.payPeriodEndDateRelateTo}</p>
                            <p className='underline font-bold'>${formatResult(Number(outsideLTE?.outsideLTEAmount?.toFixed(2)))}</p>
                          </div>
                        </div>
                        <div className="">
                          <p className="font-bold text-lg">Remove <span className='underline'>
                          all back payment</span> period from LTE for this back payment amount ${formatResult(Number(outsideLTE?.outsideLTEAmount?.toFixed(2)))} as it is all outside the LTE period.</p>
                        </div>
                      </div>
                    )
                    }
                    </div>
                  </div>
                </div>
              </>
              )
            } 
            { insideSTE && outsideLTE && insideLTE && (
              <div className='rounded-md text-white bg-green-500 hover:bg-green-700 my-3 p-3'>
                <div className='flex justify-center'>
                  { isDofi ? (
                    <p className='font-bold text-2xl underline'>Result for DHB DOFI  </p>
                  ) : <p className='font-bold text-2xl underline'>Result for DHB DOSI </p>
                  }
                </div>
                { insideSTE && isDofi && (
                  <div>
                    <div className="flex justify-center">
                      <p className='font-bold text-xl underline py-3'>
                        Back pay inside STE information
                      </p>
                    </div>
                    <div className="">
                      <div className="flex flex-row space-x-2">
                        <p className='font-bold'>Back Pay Periods:</p>
                        <p className='italic'>{insideSTE.startDateSTE} — {insideSTE.backPayEndDateRelateTo}</p>
                      </div>
                      <div className="flex flex-row space-x-2">
                        <div className="flex flex-row space-x-2">
                          <p className='italic font-bold'>Day counts for date above:</p>
                          <p className='italic'>{insideSTE.insideSTEDayCount}</p>
                        </div>
                        <div className="flex flex-row space-x-2">
                          <p className='font-bold'>Day counts work pattern date above:</p>
                          <p className='italic'>{insideSTE.insideSTEDayCountsWP}</p>
                        </div>
                      </div>
                      <div className="flex flex-row space-x-2">
                        <p className='font-bold'><span className='underline'>
                        Keep</span> inside STE:</p>
                        <p className=''>${singleDayBackPay} x {insideSTE.insideSTEDayCountsWP} = <span className='underline font-bold'>${formatResult(Number(insideSTE.insideSTEAmount?.toFixed(2)))}
                          </span></p>
                      </div>
                    </div>
                  </div>
                )
                }
                { outsideLTE && (
                  <div>
                    <div className="flex justify-center text-inherit font-bold">
                      <p className='text-xl underline py-2'>
                        Back pay outside LTE information
                      </p>
                    </div>
                    <div className="flex flex-row space-x-2">
                      <p className='font-bold'>Back Pay Periods outside LTE:</p>
                      <div className="flex flex-col">
                        <p className='italic'>
                         {outsideLTE.backPayStartDateRelateTo} — {outsideLTE.beforeLTEStartDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row space-x-2">
                      <div className="flex flex-row space-x-2">
                        <p className='font-bold'>Day counts dates above:</p>
                        <p className='italic'>{outsideLTE.outsideLTEDayCounts}</p>
                      </div>
                      <div className="flex flex-row space-x-2">
                        <p className='font-bold'>Day counts work pattern above:</p>
                        <p className='italic'>{outsideLTE.outsideLTEDayCountsWP}</p>
                      </div>
                    </div>
                    <div className="flex flex-row space-x-2">
                      <div className="">
                        <p className='text-inherit font-bold'><span className="underline">Remove
                          </span> from LTE as it is outside LTE:</p>
                      </div>
                      <div className="">
                        <p>${singleDayBackPay} x {outsideLTE.outsideLTEDayCountsWP} = <span className='underline font-bold'>${formatResult(Number((outsideLTE.outsideLTEAmount?.toFixed(2))))}</span></p>
                      </div>
                    </div>
                  </div>
                )
                }
              </div>
            )
            }
            { insideSTE && !outsideLTE && insideLTE && (
              <>
                <div className="bg-green-500 p-3 mt-3 rounded-xl text-inherit text-white hover:bg-green-700">
                    <div className="flex flex-wrap justify-center">
                      { isDofi ? (

                        <span className='flex-wrap font-bold text-2xl underline mb-2'>Result for DHB DOFI</span>

                      ): (
                        <span className='flex-wrap font-bold text-2xl underline mb-2'>Result for DHB DOSI</span>
                      )

                      }
                    </div>
                  { isDofi ? (
                  <div className=''>
                    { insideSTE && typeof insideSTE !== "string" && (
                      <>
                        <div>
                          <div className="flex justify-center py-2">
                            <span className='flex-wrap font-bold text-xl underline'> 
                              Back pay inside STE information
                            </span>
                          </div>
                          <div className="">
                            <div className="flex flex-wrap space-x-2">
                              <span className='font-bold'>Back pay periods in STE:</span>
                              <span className='flex flex-wrap italic'>
                                {insideSTE?.startDateSTE} — {insideSTE?.backPayEndDateRelateTo} 
                              </span>
                            </div>
                            <div className='flex flex-wrap'>
                              <div className='flex flex-wrap pr-3 space-x-2'>
                                <span className='font-bold flex flex-wrap justify-center'>
                                  Day counts for periods above:
                                </span>
                                <span className='flex flex-wrap justify-center underline'>
                                  {insideSTE?.insideSTEDayCount}
                                </span>
                              </div>
                              <div className='flex flex-wrap justify-center'>
                                <div className="flex flex-wrap space-x-2">
                                  <span className='flex flex-wrap font-bold'>
                                    Day counts for periods above based on work pattern:
                                  </span>
                                  <span className='flex flex-row flex-wrap justify-center underline'
                                  >  
                                    {insideSTE?.insideSTEDayCountsWP}  
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col flex-wrap">
                              <div>
                                <span className='font-bold'>Keep amount inside STE :</span>
                              </div>
                              <div className="flex flex-row">
                                <span className='flex flex-row pr-2'>{insideSTE?.finalInsideSTECalculationsPartial}
                                </span>
                                <span className='flex flex-row flex-wrap justify-center font-bold underline'>
                                  ${formatResult(Number(insideSTE.insideSTEAmount?.toFixed(2)))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div> 
                      <div className='flex-wrap rounded-lg mt-3 text-inherit text-white'>
                      {insideLTE && typeof insideLTE !== "string" ? 
                      (
                      <div className='flex-wrap rounded-lg mt-3 text-inherit text-white hover:bg-green-700'>
                        <div className='flex-wrapmt-3 text-inherit text-white'>
                          { isDofi && typeof insideSTE === 'string' && 
                            (
                              <div className='flex flex-col flex-wrap'>
                                <div>
                                  <span className='flex flex-wrap justify-center font-bold text-2xl underline'>
                                    Result for DHB DOFI
                                  </span>
                                </div>
                                <div className="">
                                  <span className='flex-wrap font-bold py-3'>
                                    Back pay overlap period in STE does not contain work pattern:
                                  </span>
                                </div>
                                <div className='flex flex-row flex-wrap space-x-3'>
                                  <span className='flex-wrap italic underline font-bold'>
                                    {insideSTE} 
                                  </span>
                                  <span>
                                    no work pattern overlap for the periods
                                  </span>
                                </div>
                              </div>
                            )
                          }
                          { insideLTE && typeof insideLTE !== "string" && (
                            <div className="flex flex-col flex-wrap">
                              <div className="flex justify-center py-2">
                                <p className='font-bold text-xl underline'>Keep inside LTE information</p>
                              </div>
                              <div className="flex flex-row py-1 space-x-2">
                                <p className='flex-wrap font-bold underline'>
                                  Back pay inside LTE as the periods are within LTE:
                                </p>
                                <p className='italic'>{allDates?.startDateLTE} — {allDates?.endDateLTE}</p>
                              </div>
                              <div className="space-x-1">
                                <span className='italic'>
                                  {insideLTE?.finalInsideLTECalculationsPartial}
                                </span>
                                { insideLTE?.insideLTEAmount && (
                                  <span className='font-bold underline'>
                                    ${formatResult(insideLTE?.insideLTEAmount)}
                                  </span>
                                )
                                }
                              </div>
                            </div>
                          )
                          }
                        </div>
                      </div>
                      ) :
                      <div className='flex-wrap rounded-lg mt-3 p-4 text-inherit text-white'>
                        <div className="">
                          <span className='flex flex-wrap justify-center font-bold text-2xl pb-2 underline'>
                            Result for DOSI
                          </span>
                          <span className='font-bold text-xl underline py-4'>
                            Keep inside LTE as the periods are within LTE for DOSI
                          </span>
                        </div>
                      </div>
                      }   
                      </div>
                    </>
                      )
                    }
                  </div>
                  ) : (
                    <>
                      { insideLTE && typeof insideLTE !== "string" && (
                            <div className="flex flex-col flex-wrap">
                              <div className="flex justify-center py-2">
                                <p className='font-bold text-xl underline'>Keep inside LTE information</p>
                              </div>
                              <div className="flex flex-row py-1 space-x-1">
                                <p className='flex-wrap font-bold underline'>
                                  Keep inside LTE as the periods are within LTE:
                                </p>
                                <p className='italic'>{allDates?.startDateLTE} — {allDates?.endDateLTE}</p>
                              </div>
                              <div className="space-x-3">
                                <span className='italic'>
                                  {insideLTE?.finalInsideLTECalculationsPartial}
                                </span>
                                { insideLTE?.insideLTEAmount && (
                                  <span className='font-bold underline'>
                                    ${formatResult(insideLTE?.insideLTEAmount)}
                                  </span>
                                )
                                }
                              </div>
                            </div>
                          )
                          }
                    </>
                  )
                  }
              </div>
            </>
              )
              }
              { insideSTE && outsideLTE && !insideLTE && (
              <div className=''>
                <div className='flex flex-col flex-wrap bg-green-500 py-3 px-3 rounded-lg text-inherit hover:bg-green-700 my-3 text-white'>
                  { isDofi ? (
                    <>
                      <div className="flex flex-wrap justify-center">
                        <p className='flex-wrap font-bold text-2xl underline mb-3'>
                          Result for DHB DOFI
                        </p>
                      </div>
                      { insideSTE && typeof insideSTE !== "string" && (
                        <div className="flex flex-row flex-wrap ">
                          <div className="flex flex-row pr-4">
                            <span className="flex-wrap font-bold pr-3">Day counts inside STE: </span>
                            <span className='flex-wrap items-center italic'>
                              {insideSTE?.startDateSTE} — {insideSTE?.backPayEndDateRelateTo} {insideSTE?.insideSTEDayCount} days 
                            </span>
                          </div>
                          <div className="flex flex-row flex-wrap">
                            <span className="flex-wrap font-bold pr-3">
                              Day counts inside STE based on work pattern: 
                            </span>
                            <span className='italic'>
                              {insideSTE?.startDateSTE} — {insideSTE?.backPayEndDateRelateTo} {insideSTE?.insideSTEDayCountsWP} days 
                            </span>
                          </div>
                        </div>
                      )}
                      <div className=''>    
                        <span className='flex-wrap font-bold text-l'>
                          Keep this amount inside STE:
                        </span>
                        { insideSTE && typeof insideSTE !== "string" && (
                          <div className="flex flex-row flex-wrap items-center">
                            <span className='flex items-center pr-2 italic'>
                              {insideSTE?.startDateSTE} — {insideSTE?.backPayEndDateRelateTo} {insideSTE?.insideSTEDayCountsWP} days = {insideSTE?.insideSTEDayCountsWP} x {singleDayBackPay} = 
                            </span>
                            <span className='flex-wrap items-center font-bold italic underline'>
                              ${formatResult(Number(insideSTE?.insideSTEAmount?.toFixed(2)))}
                            </span>
                          </div>
                        )
                        }
                      </div>
                      <div className="flex flex-row flex-wrap items-center">
                        { outsideLTE && typeof outsideLTE !== "string" && (
                          <>
                            <div className="items-center pr-3">
                              <span className='flex-wrap items-center font-bold'>Day counts outside LTE: </span>
                              <span className='items-center'>
                                {outsideLTE?.backPayStartDateRelateTo} — {outsideLTE?.beforeLTEStartDate} {outsideLTE?.outsideLTEDayCounts} days
                              </span>                     
                            </div>
                            <div className='flex-wrap'>
                              <span className='flex-wrap font-bold pr-3'>
                                Day counts outside LTE based on work pattern:
                              </span>
                              <span>
                                {outsideLTE?.backPayStartDateRelateTo} — {outsideLTE?.beforeLTEStartDate} {outsideLTE?.outsideLTEDayCountsWP} days
                              </span>
                            </div>
                          </>
                          )
                        }
                      </div>
                      <div>
                        <span className='flex-wrap font-bold text-l'>
                          Remove period earnings outside LTE:
                        </span>
                        { outsideLTE && typeof outsideLTE !== "string" && (
                          <div>
                            <div className="">
                              <span className='items-center italic'>
                                {outsideLTE?.backPayStartDateRelateTo} — {outsideLTE?.beforeLTEStartDate} {outsideLTE?.outsideLTEDayCountsWP} days work pattern = {outsideLTE?.outsideLTEDayCountsWP} x {singleDayBackPay} = {" "}
                                <span className='items-center flex-wrap font-bold italic underline'>
                                  ${formatResult(Number(outsideLTE?.outsideLTEAmount?.toFixed(2)))}
                                </span>
                              </span>
                            </div>
                            <span className='flex-wrap font-bold text-l'>
                              Keep this amount in LTE:
                            </span>
                            <span className='pl-2 italic'>
                              ${formatResult(Number(backPay))} — ${formatResult(Number(outsideLTE?.outsideLTEAmount))} = {` `}
                              <span className='flex-wrap items-center font-bold italic underline'>
                                ${formatResult(Number(backPay) - Number(outsideLTE?.outsideLTEAmount))}
                              </span>
                            </span>
                          </div>
                          )
                        }
                      </div>
                    </>
                    ):
                    <div>
                      <div className="flex justify-center items-center flex-wrap">
                        <span className='flex-wrap items-center font-bold text-2xl underline'>
                          Result for DOSI
                        </span>
                      </div>
                      <div>
                        <span className='flex-wrap font-bold text-l'>
                          Remove period earnings outside LTE:
                        </span>
                        { outsideLTE && typeof outsideLTE !== "string" && (
                          <div className='flex flex-col'>
                            <span className='italic'>
                              {outsideLTE?.finalOutsideLTECalculationsPartial}
                              <span className='flex-wrap font-bold italic underline'>
                                ${formatResult(Number(outsideLTE?.outsideLTEAmount?.toFixed(2)))}
                              </span>
                            </span>
                            <span className='flex-wrap font-bold text-l'>
                              Keep remaining amount in LTE:
                            </span>
                            <span className='italic'>
                              ${formatResult(Number(backPay))} — ${formatResult(Number(outsideLTE?.outsideLTEAmount))} = {` `}
                              <span className='flex-wrap font-bold italic underline'>
                                ${formatResult(Number(backPay) - Number(outsideLTE?.outsideLTEAmount))}
                              </span>
                            </span>
                          </div>
                          )
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            )
            }
            <div className="rounded-md text-inherit bg-green-500">
            { outsideLTE && insideLTE && !insideSTE && (
              <div className='flex flex-col flex-wrap 0 rounded-xl mt-3 p-5 text-inherit text-white testing' >
                <div className="flex flex-row flex-wrap justify-center  pt-2 pb-4 space-x-3">
                  <p ref={resultRef?.current && resultRef} className='flex flex-row flex-wrap text-2xl font-bold underline'>
                    { isDofi? (
                      <span>
                        Result for DHB DOFI
                      </span>
                    ):
                    <span>Result for DHB DOSI</span>
                    }
                  </p>
                </div>
                <div className="">
                  <div className="flex flex-col flex-wrap relative">
                    <div className="flex justify-center">
                      <p className='text-xl font-bold underline py-2'>Back pay outside LTE information</p>
                    </div>
                    <div className="flex flex-row space-x-2">
                      <p className='flex-wrap font-bold'>
                        Periods outside of LTE:
                      </p>
                      {outsideLTE && typeof outsideLTE !== 'string' && 
                        (
                          <p className='flex-wrap italic'>
                            {outsideLTE?.backPayStartDateRelateTo} — {outsideLTE?.beforeLTEStartDate}
                          </p>
                        )
                      }
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap">
                    <div className="flex flex-row space-x-3 flex-wrap">
                      <span className='font-bold flex-wrap'>
                        Work pattern day counts for above period:
                      </span>
                      {outsideLTE && typeof outsideLTE !== 'string' && 
                        (
                          <span className='italic flex-wrap pr-3'>
                            {outsideLTE?.outsideLTEDayCountsWP}
                          </span>
                        )
                      }
                    </div>
                    <div className="flex flex-row flex-wrap space-x-3">
                      <span className='flex-wrap font-bold'>
                        Day counts for above period:
                      </span>
                      {outsideLTE && typeof outsideLTE !== 'string' && 
                      (
                        <span className='flex-wrap italic'>
                          {outsideLTE?.outsideLTEDayCounts}
                        </span>
                      )
                    }
                    </div>
                  </div>
                  {outsideLTE && typeof outsideLTE !== 'string' && 
                    (
                      <>
                        { outsideLTE.outsideLTEDayCountsWP ? (
                          <div className='flex-wrap'>
                            <span className='flex-wrap font-bold'>
                              Back Pay overlap Period calculations outside of LTE: 
                            </span>
                            <div className='flex flex-row flex-wrap italic space-x-1'>
                              { outsideLTE && typeof outsideLTE !== 'string' && (
                                <>
                                  <span className='flex-row flex-wrap'>
                                    {outsideLTE?.finalOutsideLTECalculationsPartial} 
                                    {outsideLTE.outsideLTEAmount && (
                                      <span className='font-bold underline'>
                                        ${formatResult(Number((outsideLTE?.outsideLTEAmount).toFixed(2)))} 
                                      </span>
                                    )
                                    }
                                  </span>
                                </>
                              )
                              }
                            </div>
                          </div>
                        )
                        : ""
                        }
                      </>
                    )
                  }
                </div>
                <div className="space-x-4">
                  {outsideLTE && typeof outsideLTE !== 'string' && (
                    <>
                      {outsideLTE?.outsideLTEDayCountsWP ? (
                        <div className='flex flex-col'>
                          <div className="flex flex-wrap space-x-3 ">
                            <p className='font-bold flex-wrap'>
                              REMOVE FROM LTE
                            </p>
                            <p className='flex-wrap font-bold italic underline'>
                              ${formatResult(Number((outsideLTE.outsideLTEAmount)?.toFixed(2)))}
                            </p>               
                          </div>
                          <div className="flex justify-center py2">
                            <p className='font-bold text-xl underline py-2'>Back pay inside LTE information</p>
                          </div>
                          <div className='flex flex-col flex-wrap'>
                            <p className='flex flex-wrap font-bold'>
                              Keep in LTE as remaining periods are within it: 
                            </p>
                            <div className="flex flex-row flex-wrap">
                              { insideLTE && typeof insideLTE !== "string" && (
                                <>
                                  <p className='flex-wrap pr-2 italic'>
                                    {insideLTE?.finalInsideLTECalculationsPartial}
                                  </p>
                                  <p className='flex-wrap font-bold underline'>
                                    ${formatResult(Number((insideLTE?.insideLTEAmount)?.toFixed(2)))}
                                  </p>
                                </>
                              )
                              }
                            </div>
                          </div>
                        </div>
                      )
                      : outsideLTE?.outsideLTEDayCounts? (
                        <div className=''>
                          <span className='flex-wrap font-bold text-white'>Backpayment start date  {outsideLTE?.backPayStartDateRelateTo} <span className='flex-wrap italic underline'>"relate to"</span> fall outside of LTE start date {totalInsideLTE?.startDateLTE}, no work patterns fall in the periods outside of LTE <span className='flex-wrap italic underline'> AND </span>no periods fall within STE start date {totalBackPayPeriodOverlapDateSTE?.startDateSTE} as Backpayment end date {outsideLTE?.backPayEndDateRelateTo} <span className='flex-wrap italic underline'>"relate to"</span> is before STE date {totalBackPayPeriodOverlapDateSTE?.startDateSTE}</span>
                          <span className='flex-wrap font-bold text-white py-3 text-center'>
                            Keep BackPay of <span className='underline'>${formatResult(Number(backPay?.toFixed(2)))} 
                              </span> in LTE
                          </span>
                        </div>
                      )
                      : ""
                      }                     
                    </>
                    )
                  }
                  </div>
                </div>
                )
                }
              </div>
              { !outsideLTE && !insideSTE && insideLTE && (
                <>
                  <div className='flex-wrap rounded-lg bg-green-500 p-3 mt-4 text-inherit text-white hover:bg-green-700'>
                    <div className='flex flex-wrap justify-center py-3'>
                      { isDofi ? (
                        <p className='flex-wrap text-2xl font-bold underline'>
                          Result for DHB DOFI
                        </p>
                        ):
                        <p className='flex flex-wrap justify-center text-2xl font-bold underline'>
                          Result for DHB DOSI
                        </p>
                      }
                    </div>
                    <div>
                      <div className="flex flex-row justify-center py-2">
                        <p className='font-bold text-xl underline'>Back pay inside LTE information</p>
                      </div>
                      <div className='flex flex-row space-x-2'>
                        <p className='font-bold'>
                          Keep <span className='underline'>ALL</span> inside LTE as periods are within LTE:
                        </p>
                        <span>{allDates?.startDateLTE} — {allDates?.endDateLTE}</span>
                      </div>
                      <div className="flex flex-row">
                        {insideLTE.insideLTEAmount && (
                          <>
                            <p className='flex-wrap'>
                              {insideLTE.finalInsideLTECalculationsPartial} 
                            </p>
                            <p className='flex pl-2 font-bold underline'>
                              ${formatResult(Number(insideLTE.insideLTEAmount.toFixed(2)))}
                            </p>
                          </>
                        )
                        }
                      </div>
                    </div>
                  </div>
                </>
                )
              }
          </div>
          )
        }
      </div>
    </div>
  );
}

export default DHBResult