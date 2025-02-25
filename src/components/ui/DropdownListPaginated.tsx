'use client';

import { useHookstate } from '@hookstate/core';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import {
   ArrowSeparateVertical,
   NavArrowLeft,
   NavArrowRight,
   Plus,
   Xmark,
} from 'iconoir-react';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldError, Merge } from 'react-hook-form';

import useDebounce from '@/hooks/useDebounce';
import { APIResponsePagination } from '@/lib/types';
import Dropdown from './Dropdown';
import { DropdownOption } from './DropdownHook';
import Spinner from './Spinner';

export type DropdownPaginatedFetchReturn<D> = {
   options: DropdownOption[] | false;
   pagination: APIResponsePagination | false;
   data: D[] | false;
};

interface DropdownListPaginatedProps {
   trigger?: () => void;
   label: string;
   required?: boolean;
   values?: DropdownOption[];
   fetch: (page: number) => Promise<DropdownPaginatedFetchReturn<any>>;
   searchFetch?: (
      query: string,
      page: number
   ) => Promise<DropdownPaginatedFetchReturn<any>>;
   placeholder: string;
   onChange?: any;
   error?: Merge<FieldError, any[]>;
   dropdownTriggerClassname?: string;
   wrapperClassName?: string;
}

const DropdownListPaginated: FC<DropdownListPaginatedProps> = ({
   trigger,
   label,
   required = true,
   values,
   fetch,
   searchFetch,
   placeholder,
   onChange,
   error,
   dropdownTriggerClassname,
   wrapperClassName,
}) => {
   const openLoading = useHookstate<boolean>(true);
   const [open, setOpen] = useState<boolean>(false);

   const [fetchedPage, setFetchedPage] = useState<number>(0);
   const [page, setPage] = useState<number>(1);
   const [searchPage, setSearchPage] = useState<number>(1);

   const loading = useHookstate<false | 'prev' | 'next'>(false);
   const searchLoading = useHookstate<boolean>(false);

   const options = useHookstate<DropdownOption[] | false>(false);
   const pagination = useHookstate<APIResponsePagination | false>(false);

   const [search, setSearch] = useState<string>('');
   const searchOptions = useHookstate<DropdownOption[] | false>(false);
   const searchPagination = useHookstate<APIResponsePagination | false>(false);

   const [selectedValue, setSelectedValue] = useState<DropdownOption | false>(
      false
   );

   useEffect(() => {
      async function getData() {
         const payload = await fetch(page);
         options.set(payload.options);
         pagination.set(payload.pagination);
         setFetchedPage(page);
         loading.set(false);
         if (!!openLoading.value) {
            openLoading.set(false);
         }
      }

      if (open && page !== fetchedPage) {
         getData();
      }
   }, [open, page, fetchedPage]);

   const Search = useCallback(async () => {
      if (searchFetch) {
         searchLoading.set(true);
         const payload = await searchFetch(search, searchPage);
         searchOptions.set(payload.options);
         searchPagination.set(payload.pagination);
         loading.set(false);
         searchLoading.set(false);
      }
   }, [
      searchFetch,
      search,
      searchPage,
      searchOptions,
      searchPagination,
      loading,
      searchLoading,
   ]);

   useEffect(() => {
      if (search.trim().length) {
         Search();
      }
   }, [searchPage]);

   useDebounce(search, 500, () => {
      if (search.trim().length) {
         Search();
      }
   });

   function removeIndex(index: number) {
      if (values) {
         onChange(values.filter((_, i) => i !== index));
         if (trigger) trigger();
      }
   }

   function optionSelected(option: DropdownOption) {
      if (selectedValue && selectedValue.value === option.value) return true;
      return !!values?.find((v) => v.value == option.value);
   }

   const prevDisabled = useMemo(() => {
      if (searchPagination && searchPagination.value) {
         return searchPagination.value.curPage <= 1;
      } else if (pagination && pagination.value) {
         return pagination.value.curPage <= 1;
      }
      return true;
   }, [searchPagination, pagination]);

   const nextDisabled = useMemo(() => {
      if (searchPagination && searchPagination.value) {
         return (
            searchPagination.value.curPage === searchPagination.value.totalPages
         );
      } else if (pagination && pagination.value) {
         return pagination.value.curPage === pagination.value.totalPages;
      }
      return true;
   }, [searchPagination, pagination]);

   const NextPage = useCallback(() => {
      if (searchPagination && searchPagination.value) {
         loading.set('next');
         setSearchPage(searchPagination.value.curPage + 1);
      } else if (pagination && pagination.value) {
         loading.set('next');
         setPage(pagination.value.curPage + 1);
      }
   }, [searchPagination, pagination, loading]);

   const PreviousPage = useCallback(() => {
      if (searchPagination && searchPagination.value) {
         loading.set('prev');
         setSearchPage(searchPagination.value.curPage - 1);
      } else if (pagination && pagination.value) {
         loading.set('prev');
         setPage(pagination.value.curPage - 1);
      }
   }, [searchPagination, pagination, loading]);

   const resetSearch = useCallback(() => {
      setSearch('');
      setSearchPage(1);
      setSelectedValue(false);
      searchOptions.set(false);
      searchPagination.set(false);
   }, [setSearch, setSearchPage, searchOptions, searchPagination]);

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
         <div
            className={clsx(
               'mt-2 w-full gap-2',
               values && 'flex flex-wrap items-center'
            )}
         >
            {values &&
               values.map((value, valueIndex) => (
                  <p
                     key={valueIndex}
                     className="inline-flex items-center border border-zinc-200 bg-white text-blue-500 py-2 px-5 rounded-2xl shadow font-medium"
                  >
                     {value.text}
                     <button
                        onClick={() => removeIndex(valueIndex)}
                        type="button"
                        className="ml-3 -mr-2  text-red-500 p-2.5 rounded-xl transition duration-200 ease-linear bg-red-500/10 hover:bg-red-500/20"
                     >
                        <Xmark className="h-4 w-4" strokeWidth={2} />
                     </button>
                  </p>
               ))}
            <div
               className={clsx(
                  'inline-flex items-center gap-2',
                  !values && 'w-full'
               )}
            >
               <Dropdown
                  rootProps={{
                     onOpenChange: (value) => {
                        setOpen(value);
                     },
                  }}
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
                           {selectedValue ? selectedValue.text : placeholder}
                        </p>
                        <span className="flex items-center flex-shrink-0 justify-center h-9 w-9 -mr-2 bg-zinc-200/50 text-zinc-500 rounded-[0.6rem]">
                           <ArrowSeparateVertical
                              className="h-5 w-5"
                              strokeWidth={2}
                           />
                        </span>
                     </button>
                  }
                  search={
                     searchFetch && options.value && options.value.length ? (
                        <div className="relative">
                           <input
                              type="text"
                              onInput={(
                                 e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                 if (
                                    search.length &&
                                    !e.target.value.trim().length
                                 ) {
                                    resetSearch();
                                 }
                                 setSearch(e.target.value);
                              }}
                              value={search}
                              className="w-full font-medium placeholder:tracking-tight py-3 pl-4 pr-12 rounded-xl bg-zinc-50 transition duration-200 ease-linear shadow-sm border border-zinc-200 hover:border-zinc-300 focus:outline-none focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500"
                              placeholder="Search..."
                           />
                           <div className="absolute right-0 inset-y-0">
                              <button
                                 onClick={() => {
                                    if (!searchLoading.value) {
                                       resetSearch();
                                    }
                                 }}
                                 className={clsx(
                                    'px-3 rounded-2xl h-full transition duration-200 ease-linear',
                                    searchLoading.value
                                       ? 'text-blue-500'
                                       : 'text-red-500 hover:text-red-600'
                                 )}
                              >
                                 {searchLoading.value ? (
                                    <Spinner className="h-5 w-5" />
                                 ) : (
                                    <Xmark
                                       className="h-5 w-5"
                                       strokeWidth={2}
                                    />
                                 )}
                              </button>
                           </div>
                        </div>
                     ) : null
                  }
               >
                  <div
                     className={clsx(
                        options.value && options.value.length && 'min-w-[16rem]'
                     )}
                  >
                     {openLoading.value ? (
                        <div className="flex flex-col py-2.5 text-center items-center justify-center">
                           <Spinner className="h-8 w-8 text-blue-500" />
                        </div>
                     ) : searchOptions.value && searchOptions.value.length ? (
                        <div>
                           {searchOptions.value.map((option, optionIndex) => (
                              <DropdownMenu.Item
                                 key={optionIndex}
                                 disabled={optionSelected(option)}
                                 onClick={() => {
                                    if (!optionSelected(option)) {
                                       setSelectedValue(option);
                                    }
                                 }}
                                 className={
                                    'text-base data-[disabled]:cursor-not-allowed data-[disabled]:bg-zinc-200/75 font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex flex-col items-start px-4 py-2.5 relative select-none outline-none text-zinc-500 data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600'
                                 }
                              >
                                 <p>{option.text}</p>
                                 {option.subtext && (
                                    <p className="text-xs text-zinc-400">
                                       {option.subtext}
                                    </p>
                                 )}
                              </DropdownMenu.Item>
                           ))}
                           {!!searchPagination.value && (
                              <div className="mt-2.5 flex items-center justify-between">
                                 <button
                                    disabled={prevDisabled}
                                    onClick={PreviousPage}
                                    className="font-medium disabled:opacity-75 disabled:cursor-not-allowed flex items-center bg-gradient-to-b from-blue-400 to-blue-500 border border-blue-600 shadow-inner-blue text-white py-2.5 text-sm pl-2.5 pr-5 rounded-xl tracking-tight"
                                 >
                                    {loading.value === 'prev' ? (
                                       <Spinner className="mr-1 h-5 w-5" />
                                    ) : (
                                       <NavArrowLeft
                                          className="mr-1 h-5 w-5"
                                          strokeWidth={2}
                                       />
                                    )}
                                    Prev
                                 </button>
                                 <p className="text-sm font-medium">
                                    {searchPagination.value.curPage} /{' '}
                                    {searchPagination.value.totalPages}
                                 </p>
                                 <button
                                    disabled={nextDisabled}
                                    onClick={NextPage}
                                    className="font-medium disabled:opacity-75 disabled:cursor-not-allowed flex items-center bg-gradient-to-b from-blue-400 to-blue-500 border border-blue-600 shadow-inner-blue text-white py-2.5 text-sm pr-2.5 pl-5 rounded-xl tracking-tight"
                                 >
                                    Next
                                    {loading.value === 'next' ? (
                                       <Spinner className="ml-1 h-5 w-5" />
                                    ) : (
                                       <NavArrowRight
                                          className="ml-1 h-5 w-5"
                                          strokeWidth={2}
                                       />
                                    )}
                                 </button>
                              </div>
                           )}
                        </div>
                     ) : !searchOptions.value &&
                       options.value &&
                       options.value.length ? (
                        <div>
                           {options.value.map((option, optionIndex) => (
                              <DropdownMenu.Item
                                 key={optionIndex}
                                 disabled={optionSelected(option)}
                                 onClick={() => {
                                    if (!optionSelected(option)) {
                                       setSelectedValue(option);
                                    }
                                 }}
                                 className={
                                    'text-base data-[disabled]:cursor-not-allowed data-[disabled]:bg-zinc-200/75 font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex flex-col items-start px-4 py-2.5 relative select-none outline-none text-zinc-500 data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600'
                                 }
                              >
                                 <p>{option.text}</p>
                                 {option.subtext && (
                                    <p className="text-xs text-zinc-400">
                                       {option.subtext}
                                    </p>
                                 )}
                              </DropdownMenu.Item>
                           ))}
                           {!!pagination.value && (
                              <div className="mt-2.5 flex items-center justify-between">
                                 <button
                                    disabled={prevDisabled}
                                    onClick={PreviousPage}
                                    className="font-medium disabled:opacity-75 disabled:cursor-not-allowed flex items-center bg-gradient-to-b from-blue-400 to-blue-500 border border-blue-600 shadow-inner-blue text-white py-2.5 text-sm pl-2.5 pr-5 rounded-xl tracking-tight"
                                 >
                                    {loading.value === 'prev' ? (
                                       <Spinner className="mr-1 h-5 w-5" />
                                    ) : (
                                       <NavArrowLeft
                                          className="mr-1 h-5 w-5"
                                          strokeWidth={2}
                                       />
                                    )}
                                    Prev
                                 </button>
                                 <p className="text-sm font-medium">
                                    {pagination.value.curPage} /{' '}
                                    {pagination.value.totalPages}
                                 </p>
                                 <button
                                    disabled={nextDisabled}
                                    onClick={NextPage}
                                    className="font-medium disabled:opacity-75 disabled:cursor-not-allowed flex items-center bg-gradient-to-b from-blue-400 to-blue-500 border border-blue-600 shadow-inner-blue text-white py-2.5 text-sm pr-2.5 pl-5 rounded-xl tracking-tight"
                                 >
                                    Next
                                    {loading.value === 'next' ? (
                                       <Spinner className="ml-1 h-5 w-5" />
                                    ) : (
                                       <NavArrowRight
                                          className="ml-1 h-5 w-5"
                                          strokeWidth={2}
                                       />
                                    )}
                                 </button>
                              </div>
                           )}
                        </div>
                     ) : (
                        <div className="px-4 py-2 tracking-tight text-zinc-400 font-medium">
                           No options
                        </div>
                     )}
                  </div>
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

export default DropdownListPaginated;
