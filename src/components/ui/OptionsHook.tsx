'use client';

import { FC } from 'react';
import { FieldError } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import DatePickerInput from './DatePickerInput';
import clsx from 'clsx';

interface Props {
   trigger?: () => void;
   error?: FieldError;
   label: string;
   value?: string;
   values: string[];
   onChange: any;
   required?: boolean;
   wrapperClassName?: string;
   className?: string;
}

const OptionsHook: FC<Props> = ({
   trigger,
   label,
   value: selectedValue,
   values,
   onChange,
   error,
   required = true,
   wrapperClassName,
   className,
}) => {
   return (
      <div className={clsx('relative', wrapperClassName)}>
         <label htmlFor={label} className="font-medium tracking-tight">
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
         <div
            className={clsx('gap-2.5 mt-2.5 w-full grid', className)}
            style={{
               gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
            }}
         >
            {values.map((value, valueIndex) => (
               <button
                  key={valueIndex}
                  type="button"
                  onClick={() => {
                     onChange(value);
                     if (trigger) trigger();
                  }}
                  className={clsx(
                     'transition duration-200 font-medium ease-linear tracking-tight py-3 rounded-2xl',
                     {
                        'bg-zinc-200 hover:bg-blue-500 hover:text-white text-zinc-600':
                           selectedValue !== value,
                        'bg-blue-500 text-white': selectedValue === value,
                     }
                  )}
               >
                  {value}
               </button>
            ))}
         </div>
         {error && (
            <div className="text-sm text-red-500 mt-2 font-medium tracking-tight">
               {error.message}
            </div>
         )}
      </div>
   );
};

export default OptionsHook;
