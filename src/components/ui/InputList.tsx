'use client';

import clsx from 'clsx';
import { Plus, Xmark } from 'iconoir-react';
import { FC, useState } from 'react';
import { FieldError, Merge } from 'react-hook-form';

interface InputListProps {
   trigger?: () => void;
   label: string;
   required?: boolean;
   values?: string[];
   placeholder: string;
   onChange?: any;
   error?: Merge<FieldError, (FieldError | undefined)[]>;
   wrapperClassName?: string;
}

const InputList: FC<InputListProps> = ({
   trigger,
   label,
   required = true,
   values,
   placeholder,
   onChange,
   error,
}) => {
   const [value, setValue] = useState<string>('');

   function removeIndex(index: number) {
      if (values) {
         onChange(values.filter((_, i) => i !== index));
         if (trigger) trigger();
      }
   }

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
         <div className="mt-2 flex flex-wrap items-center gap-2">
            {values &&
               values.map((value, valueIndex) => (
                  <p
                     key={valueIndex}
                     className="inline-flex items-center border border-zinc-200 bg-white text-blue-500 py-2 px-5 rounded-2xl shadow font-medium"
                  >
                     {value}
                     <button
                        onClick={() => removeIndex(valueIndex)}
                        type="button"
                        className="ml-3 -mr-2 text-red-500 p-2.5 rounded-xl transition duration-200 ease-linear bg-red-500/10 hover:bg-red-500/20"
                     >
                        <Xmark className="h-4 w-4" strokeWidth={2} />
                     </button>
                  </p>
               ))}
            <div className="inline-flex items-center gap-2">
               <input
                  type="text"
                  className={clsx(
                     'px-5 group w-52 text-zinc-700 placeholder:text-zinc-400 bg-white shadow-sm inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center font-medium text-base py-3.5 rounded-2xl',
                     error
                        ? 'border border-red-500 ring-[1px] ring-red-500'
                        : 'border border-zinc-300 hover:border-zinc-400 focus:border focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500'
                  )}
                  placeholder={placeholder}
                  value={value}
                  onInput={(e: any) => setValue(e.target.value)}
               />
               <button
                  type="button"
                  onClick={() => {
                     if (onChange && value) {
                        onChange([...(values || []), value]);
                        setValue('');
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

export default InputList;
