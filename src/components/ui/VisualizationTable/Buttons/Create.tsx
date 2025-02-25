'use client';

import Dropdown from '@/components/ui/Dropdown';
import clsx from 'clsx';
import { NavArrowDown, Plus } from 'iconoir-react';
import { FC, useMemo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import useGoTo from '@/hooks/useGoTo';

interface VisualizationTableButtonCreateProps {
   routes: Record<string, string>;
   disabled?: boolean;
}

const VisualizationTableButtonCreate = ({
   routes,
   disabled,
}: VisualizationTableButtonCreateProps) => {
   const goTo = useGoTo(routes);
   const createOptions = useMemo(() => Object.keys(routes), [routes]);

   return (
      <Dropdown
         rootProps={{
            open: disabled ? false : undefined,
         }}
         trigger={
            <button
               disabled={disabled}
               className="px-5 w-40 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
            >
               Create new
               <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                  <Plus className="h-5 w-5" strokeWidth={2} />
               </span>
            </button>
         }
      >
         {createOptions.map((createOption) => (
            <DropdownMenu.Item
               key={createOption}
               onClick={() => goTo(createOption)}
               className={clsx(
                  'text-sm font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center px-4 py-2.5 relative select-none outline-none text-zinc-500 data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600'
               )}
            >
               {createOption}
            </DropdownMenu.Item>
         ))}
      </Dropdown>
   );
};

export default VisualizationTableButtonCreate;
