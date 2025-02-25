'use client';

import { FC } from 'react';
import { FieldError, Merge } from 'react-hook-form';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import DatePickerInput from './DatePickerInput';
import clsx from 'clsx';

interface Props {
   trigger?: () => void;
   error?: Merge<FieldError, (FieldError | undefined)[]>;
   label?: string;
   value: Date | undefined | null;
   onChange: any;
   required?: boolean;
   wrapperClassName?: string;
   className?: string;
   datePicker?: Partial<ReactDatePickerProps>;
   cancel?: boolean;
   onClickCancel?: () => void;
}

const DatePickerInputHook: FC<Props> = ({
   trigger,
   label,
   value,
   onChange,
   error,
   required = true,
   wrapperClassName,
   className,
   datePicker,
   cancel,
   onClickCancel,
}) => {
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
         <DatePicker
            minDate={new Date()}
            popperPlacement="top-start"
            showPopperArrow={false}
            showYearDropdown
            {...datePicker}
            wrapperClassName={clsx(
               'block',
               className ?? 'w-full',
               label && 'mt-2'
            )}
            selected={value}
            onChange={(date) => {
               onChange(date);
               if (trigger) trigger();
            }}
            customInput={
               <DatePickerInput
                  error={error}
                  value="Pick a date..."
                  cancel={cancel}
                  onClickCancel={onClickCancel}
               />
            }
         />
         {error && (
            <div className="text-sm text-red-500 mt-2 font-medium tracking-tight">
               {error.message}
            </div>
         )}
      </div>
   );
};

export default DatePickerInputHook;
