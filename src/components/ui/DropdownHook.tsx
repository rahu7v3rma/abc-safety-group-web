'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { ArrowSeparateVertical, Xmark } from 'iconoir-react';
import React, { FC, useMemo, useState } from 'react';
import { FieldError, Merge } from 'react-hook-form';
import Dropdown from './Dropdown';

export type DropdownOption = {
   text: string;
   value: any;
   subtext?: string;
};

interface DropdownHookProps {
   trigger?: () => void;
   label?: string;
   required?: boolean;
   value?: string | DropdownOption | null;
   options: (string | DropdownOption)[];
   placeholder?: string;
   onChange: any;
   error?: Merge<FieldError, (FieldError | undefined)[]>;
   dropdownTriggerClassname?: string;
   disabled?: boolean;
}

const DropdownHook: FC<DropdownHookProps> = ({
   trigger,
   label,
   required = true,
   value,
   placeholder,
   options,
   onChange,
   error,
   dropdownTriggerClassname,
   disabled,
}) => {
   const [search, setSearch] = useState<string>('');

   function getText(option: string | DropdownOption) {
      return typeof option === 'object' ? option.text : option;
   }

   function getSubtext(option: string | DropdownOption) {
      return typeof option === 'object' ? option.subtext : null;
   }

   const searchOptions = useMemo(() => {
      if (search.length) {
         const searchValue = search.trim().toLowerCase();

         const output: (string | DropdownOption)[] = [];

         options.forEach((option) => {
            let optionValue = option;

            if (typeof optionValue === 'object') {
               optionValue = getText(option).toLowerCase();
            } else {
               optionValue = optionValue.toLowerCase();
            }

            if (optionValue.startsWith(searchValue)) {
               return output.push(option);
            }

            if (optionValue.match(new RegExp(searchValue, 'gi'))) {
               return output.push(option);
            }
         });

         return output;
      }
      return false;
   }, [search, options]);

   function optionSelected(option: string | DropdownOption) {
      if (value) {
         if (typeof option === 'object' && typeof value === 'object') {
            return option.value === value.value;
         } else {
            return option === value;
         }
      }
      return false;
   }

   return (
      <div className="flex flex-col">
         {label && (
            <label className="font-medium tracking-tight">
               <span
                  className={clsx(
                     'font-bold text-lg text-red-500 align-sub',
                     required && 'mr-2'
                  )}
               >
                  {required ? '*' : ''}
               </span>
               {label}
            </label>
         )}
         <Dropdown
            disabled={disabled}
            trigger={
               <button
                  disabled={disabled}
                  className={clsx(
                     'px-5 group bg-white  overflow-auto shadow-sm inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center font-medium border text-base py-2 rounded-2xl',
                     {
                        'text-zinc-700': !!value,
                        'text-zinc-400': !value,
                     },
                     error
                        ? 'border-red-400 ring-[1px] ring-red-400'
                        : 'hover:border-zinc-400 data-[state=open]:border-blue-500 data-[state=open]:ring-[1px] data-[state=open]:ring-blue-500 border-zinc-300',
                     dropdownTriggerClassname ?? 'w-52',
                     label && 'mt-2'
                  )}
               >
                  <p className="truncate pr-2.5">
                     {value ? getText(value) || placeholder : placeholder}
                  </p>
                  <span className="flex flex-shrink-0 items-center justify-center h-9 w-9 -mr-2 bg-zinc-200/50 text-zinc-500 rounded-[0.6rem]">
                     <ArrowSeparateVertical
                        className=" h-5 w-5"
                        strokeWidth={2}
                     />
                  </span>
               </button>
            }
            search={
               options.length > 10 ? (
                  <div className="relative">
                     <input
                        type="text"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                           setSearch(e.target.value);
                        }}
                        value={search}
                        className="w-full font-medium placeholder:tracking-tight py-3 pl-4 pr-12 rounded-xl bg-zinc-50 transition duration-200 ease-linear shadow-sm border border-zinc-200 hover:border-zinc-300 focus:outline-none focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500"
                        placeholder="Search..."
                     />
                     <div className="absolute right-0 inset-y-0">
                        <button
                           onClick={() => setSearch('')}
                           className="px-3 rounded-2xl h-full text-red-500 hover:text-red-600 transition duration-200 ease-linear"
                        >
                           <Xmark className="h-5 w-5" strokeWidth={2} />
                        </button>
                     </div>
                  </div>
               ) : null
            }
         >
            {options.length ? (
               searchOptions && searchOptions.length ? (
                  searchOptions.map((option, optionIndex) => (
                     <DropdownMenu.Item
                        key={optionIndex}
                        disabled={optionSelected(option)}
                        onClick={() => {
                           onChange(option);
                           if (trigger) trigger();
                           setSearch('');
                        }}
                        className={clsx(
                           'text-base font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex flex-col px-4 py-2.5 relative select-none outline-none data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600',
                           optionSelected(option)
                              ? 'bg-zinc-200/75 text-black'
                              : 'text-zinc-500'
                        )}
                     >
                        <span>{getText(option)}</span>
                        {getSubtext(option) && (
                           <span className="text-xs text-zinc-400">
                              {getSubtext(option)}
                           </span>
                        )}
                     </DropdownMenu.Item>
                  ))
               ) : (
                  options.map((option, optionIndex) => (
                     <DropdownMenu.Item
                        key={optionIndex}
                        disabled={optionSelected(option)}
                        onClick={() => {
                           onChange(option);
                           if (trigger) trigger();
                           setSearch('');
                        }}
                        className={clsx(
                           'text-base font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex flex-col px-4 py-2.5 relative select-none outline-none data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600',
                           optionSelected(option)
                              ? 'bg-zinc-200/75 text-black'
                              : 'text-zinc-500'
                        )}
                     >
                        <span>{getText(option)}</span>
                        {getSubtext(option) && (
                           <span className="text-xs text-zinc-400">
                              {getSubtext(option)}
                           </span>
                        )}
                     </DropdownMenu.Item>
                  ))
               )
            ) : (
               <div className="px-4 py-2 tracking-tight text-zinc-400 font-medium">
                  No options
               </div>
            )}
         </Dropdown>
         {error && (
            <div className="text-sm text-red-500 mt-2 font-medium tracking-tight">
               {error.message}
            </div>
         )}
      </div>
   );
};

export default DropdownHook;
