'use client';

import useDebounce from '@/hooks/useDebounce';
import { TVisualizationTableSearch } from '@/lib/types';
import { State } from '@hookstate/core';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { ArrowSeparateVertical, Calendar, Search } from 'iconoir-react';
import { FC, useCallback, useMemo, useState } from 'react';
import Dropdown from '../Dropdown';
import Spinner from '../Spinner';

export type SearchState = {
   searchValue: false | string;
   searchIcon: false | typeof Calendar;
};
interface VisualizationTableSearchProps {
   searchOptions?: readonly string[];
   search?: boolean | Record<string, () => void>;
   searchState?: State<SearchState, {}>;
   func?: TVisualizationTableSearch<false | string>;
   loading?: boolean;
   reset?: () => void;
}

const VisualizationTableSearch: FC<VisualizationTableSearchProps> = ({
   searchOptions,
   search,
   searchState,
   func,
   loading,
   reset,
}) => {
   const [searchValue, setSearchValue] = useState<string>('');

   useDebounce(searchValue, 500, (value) => {
      const realValue = value.trim();
      if (realValue.length) {
         if (func) func(realValue, option);
      } else {
         if (reset) reset();
      }
   });

   const [option, setOption] = useState<false | string>(
      searchOptions && searchOptions.length ? searchOptions[0] : false
   );

   const RenderIcon = useCallback(() => {
      if (searchState && searchState.value) {
         const Icon = searchState.searchIcon.get({ noproxy: true });
         if (Icon) {
            return (
               <Icon
                  className="text-zinc-400 transition duration-200 ease-linear group-focus-within:text-zinc-500 h-5 w-5"
                  strokeWidth={2}
               />
            );
         }
      }

      return (
         <Search
            className="text-zinc-400 transition duration-200 ease-linear group-focus-within:text-zinc-500 h-5 w-5"
            strokeWidth={2}
         />
      );
   }, [searchState]);

   const isInputDisabled = useMemo(() => {
      if (searchState && searchState.value) {
         return !!searchState.searchValue.value;
      }
      return false;
   }, [searchState]);

   const resetSearchState = useCallback(() => {
      if (searchState && searchState.value) {
         if (searchState.searchIcon) {
            searchState.searchIcon.set(false);
         }
         if (searchState.searchValue) {
            searchState.searchValue.set(false);
         }
      }
   }, [searchState]);

   const SearchValue = useMemo(() => {
      if (
         searchState &&
         searchState.value &&
         searchState.searchValue.value &&
         searchState.searchValue.value.trim().length
      ) {
         return searchState.searchValue.value;
      }

      return searchValue;
   }, [searchState ? searchState.value : searchState, searchValue]);

   return (
      <div className="flex items-center gap-2">
         <div className="relative group w-full">
            <input
               type="text"
               placeholder={option || 'Search...'}
               onInput={(e: any) => {
                  if (isInputDisabled) return;
                  if (option) {
                     if (
                        typeof search === 'object' &&
                        search.hasOwnProperty(option)
                     ) {
                        return;
                     }
                  }
                  setSearchValue(e.target.value);
               }}
               value={SearchValue}
               className={clsx(
                  'py-3 pl-[3rem] font-medium w-56 disabled:opacity-75 disabled:cursor-not-allowed rounded-xl shadow-sm placeholder:text-zinc-400 placeholder:text-sm bg-zinc-50 border transition duration-200 ease-linear hover:border-zinc-400 focus:border-blue-500 outline-none focus:ring-[1px] focus:ring-blue-500 border-zinc-300',
                  searchOptions && searchOptions.length
                     ? 'pr-[3.5rem]'
                     : 'pr-[1rem]'
               )}
               onClick={() => {
                  if (option) {
                     if (
                        typeof search === 'object' &&
                        search.hasOwnProperty(option)
                     ) {
                        search[option]();
                     }
                  }
               }}
            />
            <div className="absolute pointer-events-none inset-y-0 flex items-center ml-4">
               {loading ? (
                  <Spinner className="h-5 w-5 text-blue-500" />
               ) : (
                  RenderIcon()
               )}
            </div>
            <div className="absolute right-2 flex items-center gap-2 inset-y-0">
               {searchOptions && searchOptions.length && (
                  <Dropdown
                     trigger={
                        <button
                           className={clsx(
                              'group transition disabled:opacity-75 disabled:cursor-not-allowed duration-200 ease-linear outline-none py-2.5 px-2.5 rounded-xl inline-flex bg-zinc-200/50 border border-zinc-200 hover:bg-zinc-200 data-[state=open]:bg-zinc-200 items-center'
                           )}
                        >
                           <ArrowSeparateVertical
                              className="h-4 w-4 text-zinc-500 group-data-[state=open]:text-zinc-700"
                              strokeWidth={2}
                           />
                        </button>
                     }
                  >
                     {searchOptions.map((searchOption) => (
                        <DropdownMenu.Item
                           key={searchOption}
                           disabled={searchOption === option}
                           onClick={() => {
                              if (searchOption !== option) {
                                 setOption(searchOption);
                                 setSearchValue('');
                                 resetSearchState();
                                 if (reset) {
                                    reset();
                                 }
                                 if (
                                    typeof search === 'object' &&
                                    search.hasOwnProperty(searchOption)
                                 ) {
                                    search[searchOption]();
                                 }
                              }
                           }}
                           className={clsx(
                              'text-sm font-medium cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center px-4 py-2.5 relative select-none outline-none',
                              searchOption === option
                                 ? 'text-zinc-700 bg-zinc-200/75'
                                 : 'text-zinc-500 data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600'
                           )}
                        >
                           {searchOption}
                        </DropdownMenu.Item>
                     ))}
                  </Dropdown>
               )}
            </div>
         </div>
      </div>
   );
};

export default VisualizationTableSearch;
