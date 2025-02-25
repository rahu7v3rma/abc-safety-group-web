'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { ArrowSeparateVertical, Plus, Xmark } from 'iconoir-react';
import React, { FC, useMemo, useState } from 'react';
import { FieldError, Merge } from 'react-hook-form';

import Dropdown from './Dropdown';

type DropdownOption = {
   text: string;
   value: any;
};

interface DropdownListProps {
   trigger?: () => void;
   label: string;
   required?: boolean;
   values?: (string | DropdownOption)[];
   options: (string | DropdownOption)[];
   placeholder: string;
   onChange?: any;
   error?: Merge<FieldError, (FieldError | undefined)[]>;
   dropdownTriggerClassname?: string;
   wrapperClassName?: string;
}

const DropdownList: FC<DropdownListProps> = ({
   trigger,
   label,
   required = true,
   values,
   options,
   placeholder,
   onChange,
   error,
   dropdownTriggerClassname,
   wrapperClassName,
}) => {
   const [selectedValue, setSelectedValue] = useState<
      string | DropdownOption | false
   >(false);
   const [search, setSearch] = useState<string>('');

   function removeIndex(index: number) {
      if (values) {
         onChange(values.filter((_, i) => i !== index));
         if (trigger) trigger();
      }
   }

   function getText(option: string | DropdownOption) {
      return typeof option === 'object' ? option.text : option;
   }

   function optionSelected(option: string | DropdownOption) {
      return !!values?.find((v) =>
         typeof v === 'object' && typeof option === 'object'
            ? v.value == option.value
            : v == option
      );
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
                     {getText(value)}
                     <button
                        onClick={() => removeIndex(valueIndex)}
                        type="button"
                        className="ml-3 -mr-2  text-red-500 p-2.5 rounded-xl transition duration-200 ease-linear bg-red-500/10 hover:bg-red-500/20"
                     >
                        <Xmark className="h-4 w-4" strokeWidth={2} />
                     </button>
                  </p>
               ))}
            <div className="inline-flex items-center gap-2">
               <Dropdown
                  trigger={
                     <button
                        className={clsx(
                           'px-5 group bg-white overflow-auto shadow-sm inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center font-medium text-base py-2 rounded-2xl',
                           {
                              'text-zinc-700': !!selectedValue,
                              'text-zinc-400': !selectedValue,
                           },
                           dropdownTriggerClassname ?? 'w-52',
                           error
                              ? 'border border-red-500 ring-[1px] ring-red-500'
                              : ' border border-zinc-300 hover:border-zinc-400 data-[state=open]:border data-[state=open]:border-blue-500 data-[state=open]:ring-[1px] data-[state=open]:ring-blue-500'
                        )}
                     >
                        <p className="truncate pr-2.5">
                           {selectedValue
                              ? getText(selectedValue)
                              : placeholder}
                        </p>
                        <span className="flex items-center flex-shrink-0 justify-center h-9 w-9 -mr-2 bg-zinc-200/50 text-zinc-500 rounded-[0.6rem]">
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
                              onInput={(
                                 e: React.ChangeEvent<HTMLInputElement>
                              ) => {
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
                                 if (!optionSelected(option)) {
                                    setSelectedValue(option);
                                 }
                                 setSearch('');
                              }}
                              className={
                                 'text-base data-[disabled]:cursor-not-allowed data-[disabled]:bg-zinc-200/75 font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center px-4 py-2.5 relative select-none outline-none text-zinc-500 data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600'
                              }
                           >
                              {getText(option)}
                           </DropdownMenu.Item>
                        ))
                     ) : (
                        options.map((option, optionIndex) => (
                           <DropdownMenu.Item
                              key={optionIndex}
                              disabled={optionSelected(option)}
                              onClick={() => {
                                 if (!optionSelected(option)) {
                                    setSelectedValue(option);
                                 }
                                 setSearch('');
                              }}
                              className={
                                 'text-base data-[disabled]:cursor-not-allowed data-[disabled]:bg-zinc-200/75 font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center px-4 py-2.5 relative select-none outline-none text-zinc-500 data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600'
                              }
                           >
                              {getText(option)}
                           </DropdownMenu.Item>
                        ))
                     )
                  ) : (
                     <div className="px-4 py-2 tracking-tight text-zinc-400 font-medium">
                        No options
                     </div>
                  )}
               </Dropdown>
               <button
                  type="button"
                  onClick={() => {
                     if (
                        onChange &&
                        selectedValue &&
                        (!values || !values.includes(selectedValue))
                     ) {
                        onChange([...(values || []), selectedValue]);
                        setSelectedValue(false);
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

export default DropdownList;
