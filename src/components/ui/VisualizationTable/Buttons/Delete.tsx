'use client';

import { FC, useState } from 'react';
import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import { Trash } from 'iconoir-react';

type VisualizationTableButtonDeleteProps = {
   confirmationAction: () => void;
   loading: boolean;
   confirmationTitle: string;
};

const VisualizationTableButtonDelete: FC<
   VisualizationTableButtonDeleteProps
> = ({ confirmationAction, loading, confirmationTitle }) => {
   const [openConfirmation, setOpenConfirmation] = useState(false);
   return (
      <Confirmation
         title={confirmationTitle}
         open={openConfirmation}
         setDialogOpen={setOpenConfirmation}
         severe={false}
         action={confirmationAction}
      >
         <div className="flex items-center gap-2.5">
            <button
               disabled={loading}
               className="px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm py-2 bg-gradient-to-b from-red-400 to-red-500 rounded-2xl shadow-inner-red gap-2"
               onClick={() => setOpenConfirmation(true)}
            >
               Delete
               <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-red-600 rounded-[0.6rem]">
                  {loading ? (
                     <Spinner className="h-4 w-4" />
                  ) : (
                     <Trash className="h-4 w-4" strokeWidth={2} />
                  )}
               </span>
            </button>
         </div>
      </Confirmation>
   );
};

export default VisualizationTableButtonDelete;
