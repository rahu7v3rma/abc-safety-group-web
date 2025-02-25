'use client';

import { Community } from 'iconoir-react';
import { FC } from 'react';

type VisualizationTableButtonManageProps = {
   onClick: () => void;
};

const VisualizationTableButtonManage: FC<
   VisualizationTableButtonManageProps
> = ({ onClick }) => {
   return (
      <div className="flex items-center gap-2.5">
         <button
            className={`px-5 w-30 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-indigo-800 font-semibold text-sm py-2 bg-gradient-to-b from-indigo-400 to-indigo-500 rounded-2xl shadow-inner-indigo gap-2`}
            onClick={onClick}
         >
            Manage
            <span
               className={`flex items-center justify-center h-8 w-8 ml-2 -mr-2 bg-indigo-600 rounded-[0.6rem]`}
            >
               <Community className="h-4 w-4" strokeWidth={2} />
            </span>
         </button>
      </div>
   );
};

export default VisualizationTableButtonManage;
