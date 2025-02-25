'use client';

import Dropdown from '@/components/ui/Dropdown';
import { uncamelcase } from '@/lib/helpers';
import { State } from '@hookstate/core';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { Check, Filter, Xmark } from 'iconoir-react';

interface VisualizationTableButtonCreateProps {
   filters: State<string[], {}>;
   filter: Record<string, (active: boolean) => void>;
   disabled?: boolean;
}

const VisualizationTableButtonCreate = ({
   filters,
   filter,
   disabled,
}: VisualizationTableButtonCreateProps) => {
   return (
      <Dropdown
         rootProps={{ open: disabled ? false : undefined }}
         trigger={
            <button
               disabled={disabled}
               className="px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-zinc-800 font-semibold text-sm py-2 bg-gradient-to-b from-zinc-400 to-zinc-500 rounded-2xl shadow-inner-zinc"
            >
               Filter
               <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-zinc-600 rounded-[0.6rem]">
                  <Filter className="h-5 w-5" strokeWidth={2} />
               </span>
            </button>
         }
      >
         {Object.keys(filter).map((filterOption) => (
            <DropdownMenu.Item
               key={filterOption}
               onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (filters.value.includes(filterOption)) {
                     const newFilters = filters.value.filter(
                        (activeFilter) => activeFilter !== filterOption
                     );
                     filters.set(newFilters);
                     filter[filterOption](false);
                  } else {
                     const newFilters = [...filters.value, filterOption];
                     filters.set(newFilters);
                     filter[filterOption](true);
                  }
               }}
               className={clsx(
                  'text-sm font-medium tracking-tight group cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center px-4 py-2.5 relative select-none outline-none data-[highlighted]:bg-zinc-200/75 data-[highlighted]:text-zinc-600',
                  filters.value.includes(filterOption)
                     ? 'bg-zinc-200/75 text-zinc-800'
                     : 'text-zinc-500'
               )}
            >
               {filters.value.includes(filterOption) && (
                  <>
                     <Check
                        className="h-5 w-5 group-hover:hidden mr-2 -ml-2 text-green-500"
                        strokeWidth={2}
                     />
                     <Xmark
                        className="h-5 w-5 hidden group-hover:inline-block mr-2 -ml-2 text-red-500"
                        strokeWidth={2}
                     />
                  </>
               )}
               {uncamelcase(filterOption)}
            </DropdownMenu.Item>
         ))}
      </Dropdown>
   );
};

export default VisualizationTableButtonCreate;
