'use client';

import clsx from 'clsx';
import { Calendar, Xmark } from 'iconoir-react';
import { ComponentProps, forwardRef } from 'react';

interface DatePickerInputProps extends ComponentProps<'button'> {
   value?: any;
   onClick?: any;
   error?: any;
   cancel?: boolean;
   onClickCancel?: () => void;
}

const DatePickerInput = forwardRef<HTMLButtonElement, DatePickerInputProps>(
   ({ value, onClick, error, cancel, onClickCancel }, ref) => (
      <button
         type="button"
         className={clsx(
            'relative flex items-center group w-full transition duration-200 ease-linear px-4 py-3.5 bg-white shadow-sm border rounded-2xl font-medium justify-between',
            value ? 'text-black' : 'text-zinc-400',
            error
               ? 'border-red-500 ring-[1px] ring-red-500'
               : ' border-zinc-300 hover:border-zinc-400 focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500 hover:border-brand-700'
         )}
         onClick={onClick}
         ref={ref}
      >
         {value || 'Pick a date...'}
         <div className="flex gap-2">
            <div className="inset-y-0 flex items-center text-blue-500 transition duration-200 ease-linear opacity-75 group-hover:opacity-100">
               <Calendar strokeWidth={2} />
            </div>
            {cancel && (
               <div
                  className="inset-y-0 flex items-center text-red-500 transition duration-200 ease-linear opacity-75 group-hover:opacity-100"
                  onClick={(event) => {
                     event.stopPropagation();
                     onClickCancel && onClickCancel();
                  }}
               >
                  <Xmark strokeWidth={2} />
               </div>
            )}
         </div>
      </button>
   )
);

export default DatePickerInput;
