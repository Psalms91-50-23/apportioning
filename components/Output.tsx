import React from 'react';
import { Result } from '@/types';
import functions from '@/functions';
const { formatStringNumberWithCommas } = functions;

const Output = ({ grossEarnings, grossEarningsStartDate, grossEarningsEndDate, daysCounted,workPatternDaysCounted, pwcStartDate, pwcEndDate, start, end, countDaysOverlapWithPWC, totalGrossForPeriodReduction, singleDayGrossWP }: Result ) => {
  return (
    <div className="">
        <div className="">
            <p className="font-bold">Normal wages date range</p>
            <p>{grossEarningsStartDate} — {grossEarningsEndDate}</p>
        </div>
        <div className="flex flex-col">
            <div className="flex flex-row space-x-5">
            <div className="flex flex-row">
                <p className="font-bold">
                    Days counted for above dates: 
                </p>
                <p className="italic ml-3">
                    {daysCounted}
                </p>
            </div>
            <div className="flex flex-row">
                <p className="font-bold">
                    Days counted for above dates based on work pattern: 
                </p>
                <p className="italic ml-3">
                    {workPatternDaysCounted}
                </p>
            </div>
            </div>
            <div>
            <p className="font-bold">
                Single day gross earnings based on work pattern calculations: 
            </p>
            <p>
                ${grossEarnings} / {workPatternDaysCounted} = ${formatStringNumberWithCommas(singleDayGrossWP)}
            </p>
            </div>
        </div>
        <div className="">
            <p className="font-bold">
            Previous weekly compensation date range
            </p>
            <p>{pwcStartDate} — {pwcEndDate}</p>
        </div>
        <div className="">
            <p className="font-bold">
            Normal wage and previous weekly compensation date overlap
            </p>
            <p>{start} — {end}  {formatStringNumberWithCommas(countDaysOverlapWithPWC)} {Number(countDaysOverlapWithPWC) > 1 ? "days" : "day"} overlap based on work pattern</p> 
            <p className="font-bold">
                {countDaysOverlapWithPWC} * ${formatStringNumberWithCommas(singleDayGrossWP)} = 
                <span className='underline ml-2'>
                    ${formatStringNumberWithCommas(totalGrossForPeriodReduction)}
                </span>
            </p>
        </div>
    </div>
  )
}

export default Output