'use client';

import clsx from 'clsx';
import { ComponentProps, FC, forwardRef, useRef } from 'react';
import { FieldError } from 'react-hook-form';

interface InputNumberProps extends Omit<ComponentProps<'input'>, 'className'> {
   trigger?: () => void;
   iconLabel?: string;
   label: string;
   required?: boolean;
   value?: number;
   onChange: any;
   error?: FieldError;
   wrapperClassName?: string;
   className?: string;
}

const InputNumber: FC<InputNumberProps> = ({
   trigger,
   iconLabel,
   error,
   label,
   required = true,
   value,
   onChange,
   wrapperClassName,
   className,
   ...props
}) => {
   const numberInputRef = useRef<HTMLInputElement>(null);
   return (
      <div className={clsx('relative', wrapperClassName)}>
         <label htmlFor={label} className="font-medium tracking-tight">
            <span
               className={clsx(
                  'font-bold text-lg',
                  required && 'mr-2',
                  props.disabled ? 'text-zinc-400' : 'text-red-500'
               )}
               style={{
                  verticalAlign: 'sub',
               }}
            >
               {required ? '*' : ''}
            </span>
            {label}
         </label>
         <div className="mt-2 relative">
            <input
               ref={numberInputRef}
               type="number"
               step="any"
               min="0"
               max="999999999"
               onWheel={() => {
                  numberInputRef.current?.blur();
               }}
               value={value ?? ''}
               onChange={(e: any) => {
                  const v = parseFloat(e.target.value);
                  onChange(isNaN(v) ? '' : v);
                  if (trigger) trigger();
               }}
               className={clsx(
                  'font-medium disabled:cursor-not-allowed placeholder:tracking-tight disabled:opacity-75 disabled:hover:border-zinc-300 tracking-wide py-3.5 text-zinc-700 text-base outline-none transition duration-200 ease-linear border shadow-sm rounded-xl',
                  error
                     ? 'border-red-400 ring-[1px] ring-red-400'
                     : 'hover:border-zinc-400 focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500 border-zinc-300',
                  iconLabel ? 'pl-10 pr-5' : 'px-5',
                  className ?? 'w-full'
               )}
               {...props}
            />
            {iconLabel && (
               <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                  <p className="text-lg font-medium text-zinc-400">
                     {iconLabel}
                  </p>
               </div>
            )}
         </div>
         {error && (
            <div className="text-sm text-red-500 mt-2 font-medium tracking-tight">
               {error.message}
            </div>
         )}
      </div>
   );
};

export default InputNumber;
