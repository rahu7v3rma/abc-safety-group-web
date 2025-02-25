'use client';

import { Edit } from 'iconoir-react';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

const VisualizationTableButtonUpdate: FC = () => {
   const router = useRouter();
   const pathname = usePathname();
   return (
      <div className="flex items-center gap-2.5">
         <button
            onClick={() => router.push(pathname + '/update')}
            className="px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
         >
            Update
            <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
               <Edit className="h-4 w-4" strokeWidth={2} />
            </span>
         </button>
      </div>
   );
};

export default VisualizationTableButtonUpdate;
