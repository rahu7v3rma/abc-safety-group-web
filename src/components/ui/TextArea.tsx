'use client';

import clsx from 'clsx';
import { ComponentProps, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface Props extends Omit<ComponentProps<'textarea'>, 'className'> {
   trigger?: () => void;
   error?: FieldError;
   label: string;
   required?: boolean;
   className?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
   ({ trigger, error, label, required = true, className, ...props }, ref) => {
      return (
         <div className="relative">
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
            <textarea
               id={label}
               name={label}
               ref={ref}
               className={clsx(
                  'w-full mt-2 resize-none py-3.5 text-zinc-700 disabled:cursor-not-allowed font-medium placeholder:font-normal placeholder:text-zinc-400 outline-none transition duration-200 ease-linear px-4 border shadow-sm rounded-xl',
                  error
                     ? 'border-red-400 ring-[1px] ring-red-400'
                     : 'hover:border-zinc-400 disabled:hover:border-zinc-300 focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500 border-zinc-300',
                  className
               )}
               {...props}
               onChange={(e) => {
                  if (trigger) trigger();
                  if (props.onChange) props.onChange(e);
               }}
               onInput={(e) => {
                  if (trigger) trigger();
                  if (props.onChange) props.onChange(e as any);
               }}
            />
            {error && (
               <div className="text-sm text-red-500 mt-2 font-medium tracking-tight">
                  {error.message}
               </div>
            )}
         </div>
      );
   }
);

export default Textarea;
