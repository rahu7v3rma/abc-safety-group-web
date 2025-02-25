'use client';

import { formatting } from '@/lib/helpers';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Plus, Xmark } from 'iconoir-react';
import { FC, useState } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { FieldError, Merge } from 'react-hook-form';
import DatePickerInput from './DatePickerInput';

interface DatePickerInputListProps {
   trigger?: () => void;
   label: string;
   required?: boolean;
   values?: Date[];
   onChange?: any;
   error?: Merge<FieldError, (FieldError | undefined)[]>;
   wrapperClassName?: string;
   datePicker?: Partial<ReactDatePickerProps>;
   className?: string;
}

const DatePickerInputList: FC<DatePickerInputListProps> = ({
   trigger,
   label,
   required = true,
   values,
   onChange,
   error,
   datePicker,
   wrapperClassName,
}) => {
   const [value, setValue] = useState<Date | null>(null);

   function removeIndex(index: number) {
      if (values) {
         onChange(values.filter((_, i) => i !== index));
         if (trigger) trigger();
      }
   }

   return (
      <div className={clsx('relative w-full', wrapperClassName)}>
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
         <div className="mt-2 flex flex-wrap items-center gap-2">
            {values &&
               values.map((value, valueIndex) => (
                  <p
                     key={valueIndex}
                     className="inline-flex items-center border border-zinc-200 bg-white text-blue-500 py-2 px-5 rounded-2xl shadow font-medium"
                  >
                     {format(
                        value,
                        (datePicker?.dateFormat as string) || formatting
                     )}
                     <button
                        onClick={() => removeIndex(valueIndex)}
                        type="button"
                        className="ml-3 -mr-2  text-red-500 py-2 rounded-xl transition duration-200 ease-linear px-2 bg-red-500/10 hover:bg-red-500/20"
                     >
                        <Xmark className="h-5 w-5" strokeWidth={2} />
                     </button>
                  </p>
               ))}
            <div className="inline-flex items-center gap-2">
               <DatePicker
                  {...datePicker}
                  showPopperArrow={false}
                  wrapperClassName={clsx('block w-52')}
                  selected={value}
                  onChange={(date) => {
                     setValue(date);
                  }}
                  customInput={(<DatePickerInput error={error} />) as any}
                  minDate={new Date()}
               />
               <button
                  type="button"
                  onClick={() => {
                     if (onChange && value) {
                        onChange([...(values || []), value]);
                        setValue(null);
                        if (trigger) trigger();
                     }
                  }}
                  className="px-4 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white font-semibold text-sm py-4 bg-blue-500 rounded-2xl"
               >
                  <Plus className="h-5 w-5" strokeWidth={2} />
               </button>
            </div>
         </div>
         {error && (
            <div className="text-sm text-red-500 mt-2 font-medium tracking-tight">
               {error.message}
            </div>
         )}
      </div>
   );
};

export default DatePickerInputList;
