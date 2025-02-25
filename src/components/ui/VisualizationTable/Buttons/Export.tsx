'use client';

import {
   TVisualizationTableDisableds,
   TVisualizationTableFunctions,
} from '@/lib/types';
import { Download } from 'iconoir-react';
import React, { FC } from 'react';
import Spinner from '../../Spinner';

interface VisualizationTableButtonExport {
   func: TVisualizationTableFunctions['export'];
   tableDisabled: boolean;
   disabled: TVisualizationTableDisableds['export'];
   loading?: boolean;
}

const VisualizationTableButtonExport: FC<VisualizationTableButtonExport> = ({
   func,
   tableDisabled,
   disabled,
   loading,
}) => {
   return (
      <button
         onClick={() => {
            if (func) func();
         }}
         disabled={tableDisabled || disabled || loading}
         className="px-5 w-32 flex justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white bg-zinc-400 border border-zinc-800 font-semibold text-sm py-2 bg-gradient-to-b from-zinc-400 to-zinc-500 rounded-2xl shadow-inner-zinc"
      >
         Export
         <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-zinc-600 rounded-[0.6rem]">
            {loading ? (
               <Spinner className="h-4 w-4" />
            ) : (
               <Download className="h-4 w-4" strokeWidth={2} />
            )}
         </span>
      </button>
   );
};

export default VisualizationTableButtonExport;
