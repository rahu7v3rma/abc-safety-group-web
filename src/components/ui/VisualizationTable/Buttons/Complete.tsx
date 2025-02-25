'use client';

import { FC, useState } from 'react';
import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import { Check } from 'iconoir-react';

type VisualizationTableButtonCompleteProps = {
   confirmationAction: () => void;
   loading: boolean;
   confirmationTitle: string;
   confirmationDescription?: string;
};

const VisualizationTableButtonComplete: FC<
   VisualizationTableButtonCompleteProps
> = ({
   confirmationAction,
   loading,
   confirmationTitle,
   confirmationDescription,
}) => {
   const [openConfirmation, setOpenConfirmation] = useState(false);
   return (
      <Confirmation
         title={confirmationTitle}
         open={openConfirmation}
         setDialogOpen={setOpenConfirmation}
         severe={false}
         action={confirmationAction}
         description={confirmationDescription}
      >
         <div className="flex items-center gap-2.5">
            <button
               disabled={loading}
               className="px-5 w-36 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-green-800 font-semibold text-sm py-2 bg-gradient-to-b from-green-400 to-green-500 rounded-2xl shadow-inner-green gap-2"
               onClick={() => setOpenConfirmation(true)}
            >
               Complete
               <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-green-600 rounded-[0.6rem]">
                  {loading ? (
                     <Spinner className="h-4 w-4" />
                  ) : (
                     <Check className="h-4 w-4" strokeWidth={2} />
                  )}
               </span>
            </button>
         </div>
      </Confirmation>
   );
};

export default VisualizationTableButtonComplete;
