'use client';

import { FC } from 'react';
import { FieldError, Merge } from 'react-hook-form';
import Checkbox from './Checkbox';
import clsx from 'clsx';

interface Props {
   trigger?: () => void;
   error?: Merge<FieldError, (FieldError | undefined)[]>;
   label?: string;
   values?: string[];
   options: string[];
   onChange: any;
   required?: boolean;
   wrapperClassName?: string;
   className?: string;
}

const CheckboxListHook: FC<Props> = ({
   trigger,
   label,
   values,
   options,
   onChange,
   error,
   required = true,
   wrapperClassName,
   className,
}) => {
   function handleChecked(option: string, checked: boolean) {
      if (checked) {
         onChange([...(values || []), option]);
      } else {
         onChange(values ? values.filter((value) => value !== option) : []);
      }
      if (trigger) trigger();
   }

   return (
      <div className={clsx('relative', wrapperClassName)}>
         {label && (
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
         )}
         <div
            className={clsx('gap-2.5 mt-2.5 w-full grid', className)}
            style={{
               gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
            }}
         >
            {options.map((option, optionIndex) => (
               <div
                  key={optionIndex}
                  className="flex flex-col items-start gap-2.5"
               >
                  <Checkbox
                     id={option}
                     name={option}
                     checked={values?.includes(option)}
                     onCheckedChange={(checked: boolean) =>
                        handleChecked(option, checked)
                     }
                     className="h-8 w-8 flex-shrink-0 flex-grow-0"
                     checkClassName="w-6 h-6"
                  />
                  <label
                     htmlFor={option}
                     className="font-medium tracking-tight"
                  >
                     {option}
                  </label>
               </div>
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

export default CheckboxListHook;
