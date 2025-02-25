'use client';

import clsx from 'clsx';
import { ComponentProps, FC, forwardRef, useRef, useState } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { registerInformationSchemaType } from '../Register/Form';

interface Props {
   trigger?: () => void;
   onChange: (value: registerInformationSchemaType['height']) => void;
   error?:
      | Merge<
           FieldError,
           FieldErrorsImpl<{
              feet: number;
              inches: number;
           }>
        >
      | undefined;
   label: string;
   required?: boolean;
   className?: string;
   value: registerInformationSchemaType['height'];
}

const HeightInput: FC<Props> = ({
   trigger,
   onChange,
   error,
   label,
   required = true,
   className,
   value,
}) => {
   const feetInputRef = useRef<any>();
   const inchesInputRef = useRef<any>();

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
         <div className="mt-2 grid grid-cols-2 gap-2.5">
            <div>
               <div className="relative">
                  <input
                     id="feet"
                     ref={feetInputRef}
                     type="number"
                     step="any"
                     min="0"
                     max="999999999"
                     onWheel={() => {
                        feetInputRef.current?.blur();
                     }}
                     value={value.feet ?? ''}
                     onChange={(e: any) => {
                        const v = parseFloat(e.target.value);
                        onChange({
                           feet: isNaN(v) ? undefined : v,
                           inches: value.inches,
                        });
                        if (e.target.value.length === 1) {
                           inchesInputRef.current?.focus();
                        }
                        if (trigger) trigger();
                     }}
                     className={clsx(
                        'font-medium disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:border-zinc-300 tracking-wide pl-10 pr-5 py-3.5 text-zinc-700 text-base outline-none transition duration-200 ease-linear border shadow-sm rounded-xl',
                        error && error.feet
                           ? 'border-red-400 ring-[1px] ring-red-400'
                           : 'hover:border-zinc-400 focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500 border-zinc-300',
                        className ?? 'w-full'
                     )}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                     <p className="text-lg font-medium text-zinc-400">ft</p>
                  </div>
               </div>
               {error && error.feet && (
                  <div className="text-sm text-red-500 mt-2 font-medium tracking-tight">
                     {error.feet.message}
                  </div>
               )}
            </div>
            <div>
               <div className="relative">
                  <input
                     id="inches"
                     ref={inchesInputRef}
                     type="number"
                     step="any"
                     min="0"
                     max="999999999"
                     onWheel={() => {
                        inchesInputRef.current?.blur();
                     }}
                     value={value.inches ?? ''}
                     onChange={(e: any) => {
                        const v = parseFloat(e.target.value);
                        onChange({
                           inches: isNaN(v) ? undefined : v,
                           feet: value.feet,
                        });
                        if (trigger) trigger();
                     }}
                     className={clsx(
                        'font-medium disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:border-zinc-300 tracking-wide py-3.5 pl-10 pr-5 text-zinc-700 text-base outline-none transition duration-200 ease-linear border shadow-sm rounded-xl',
                        error && error.inches
                           ? 'border-red-400 ring-[1px] ring-red-400'
                           : 'hover:border-zinc-400 focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500 border-zinc-300',

                        className ?? 'w-full'
                     )}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                     <p className="text-lg font-medium text-zinc-400">in</p>
                  </div>
               </div>
               {error && error.inches && (
                  <div className="text-sm text-red-500 mt-2 font-medium tracking-tight">
                     {error.inches.message}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default HeightInput;
