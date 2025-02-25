'use client';

import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import clsx from 'clsx';
import { Check } from 'iconoir-react';
import { FC, useState } from 'react';

type VisualizationTableButtonSubmitProps = {
   loading: boolean;
   confirmationAction: () => void;
   confirmationTitle: string;
   confirmationDescription?: string;
   confirmationSevere?: boolean;
   disabled?: boolean;
   className?: string;
};

const VisualizationTableButtonSubmit: FC<
   VisualizationTableButtonSubmitProps
> = ({
   loading,
   confirmationAction,
   confirmationTitle,
   confirmationDescription,
   confirmationSevere,
   disabled,
   className,
}) => {
   const [openConfirmation, setOpenConfirmation] = useState(false);
   return (
      <Confirmation
         title={confirmationTitle}
         description={confirmationDescription}
         open={disabled ? false : openConfirmation}
         setDialogOpen={setOpenConfirmation}
         severe={confirmationSevere ?? false}
         action={confirmationAction}
      >
         <div className={clsx('flex items-center gap-2.5', className)}>
            <button
               disabled={disabled || loading}
               className={clsx(
                  'px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border font-semibold text-sm py-2 bg-gradient-to-b rounded-2xl gap-2 border-blue-800 from-blue-400 to-blue-500 shadow-inner-blue'
               )}
               onClick={() => setOpenConfirmation(true)}
            >
               Submit
               <span className="flex items-center justify-center h-8 w-8 ml-2 -mr-2 rounded-[0.6rem] bg-blue-600">
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

export default VisualizationTableButtonSubmit;
