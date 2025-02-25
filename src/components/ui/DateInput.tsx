'use client';

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';

interface DateInputProps {
   trigger?: () => void;
   label: string;
   required?: boolean;
   value: string;
   onChange: any;
   error?: FieldError;
}

const dateInputStyle = cva(
   [
      'w-full py-3.5 border text-zinc-700 placeholder:text-base font-medium placeholder:font-normal placeholder:text-zinc-400 outline-none transition duration-200 ease-linear px-4',
   ],
   {
      variants: {
         intent: {
            default:
               'border-zinc-300 focus:border-blue-500 focus:z-10 focus:ring-[1px] focus:ring-blue-500',
            error: 'border-red-500 ring-[1px] ring-red-500',
         },
      },
   }
);

const DateInput: FC<DateInputProps> = ({
   trigger,
   label,
   required = true,
   value,
   onChange,
   error,
}) => {
   const dayInputRef = useRef<HTMLInputElement>(null);
   const monthInputRef = useRef<HTMLInputElement>(null);
   const yearInputRef = useRef<HTMLInputElement>(null);

   const valueSplit = value
      ? (value.split('/') as [string, string, string])
      : '';
   const [month, setMonth] = useState<number | false>(
      valueSplit ? parseInt(valueSplit[0]) : false
   );
   const [day, setDay] = useState<number | false>(
      valueSplit ? parseInt(valueSplit[1]) : false
   );
   const [year, setYear] = useState<number | false>(
      valueSplit ? parseInt(valueSplit[2]) : false
   );

   useEffect(() => {
      if (month && day && year) {
         onChange(`${month}/${day}/${year}`);
      } else {
         onChange(undefined);
      }
   }, [onChange, day, month, year]);

   return (
      <div className="relative w-full">
         <label className="font-medium tracking-tight">
            <span
               className={clsx(
                  'font-bold text-lg text-red-500',
                  required && 'mr-2'
               )}
               style={{
                  verticalAlign: 'sub',
               }}
            >
               {required ? '*' : ''}
            </span>
            {label}
         </label>
         <div className="mt-1 grid grid-cols-4 w-full">
            <input
               ref={monthInputRef}
               type="number"
               maxLength={2}
               onWheel={() => {
                  monthInputRef.current?.blur();
               }}
               onInput={(e: any) => {
                  const newValue = e.target.value;
                  if (newValue.length > 2) return;
                  setMonth(e.target.value);
                  if (e.target.value.length === 2) {
                     dayInputRef.current?.focus();
                  }
                  if (trigger) trigger();
               }}
               value={month ? month.toString() : ''}
               className={clsx(
                  dateInputStyle({ intent: error ? 'error' : 'default' }),
                  'col-span-1 rounded-l-xl'
               )}
               placeholder="MM"
            />
            <input
               ref={dayInputRef}
               type="number"
               maxLength={2}
               onWheel={() => {
                  dayInputRef.current?.blur();
               }}
               onInput={(e: any) => {
                  const newValue = e.target.value;
                  if (newValue.length > 2) return;
                  setDay(e.target.value);
                  if (e.target.value.length === 2) {
                     yearInputRef.current?.focus();
                  }
                  if (trigger) trigger();
               }}
               value={day ? day.toString() : ''}
               className={clsx(
                  dateInputStyle({ intent: error ? 'error' : 'default' }),
                  'col-span-1 -ml-[1px]'
               )}
               placeholder="DD"
            />
            <input
               ref={yearInputRef}
               type="number"
               maxLength={3}
               onWheel={() => {
                  yearInputRef.current?.blur();
               }}
               onInput={(e: any) => {
                  const newValue = e.target.value;
                  if (newValue.length > 4) {
                     return;
                  }
                  setYear(e.target.value);
                  if (trigger) trigger();
               }}
               value={year ? year.toString() : ''}
               className={clsx(
                  dateInputStyle({ intent: error ? 'error' : 'default' }),
                  'col-span-2 -ml-[3px] rounded-r-xl'
               )}
               placeholder="YYYY"
            />
         </div>
         {error && (
            <div className="text-sm text-red-500 mt-2 font-medium tracking-tight">
               {error.message}
            </div>
         )}
      </div>
   );
};

export default DateInput;
