'use client';

import * as iconoirIcons from 'iconoir-react';
import { FC, useState } from 'react';

import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import { TIcons } from '@/lib/types';

type VisualizationTableButtonStartProps = {
   loading: boolean;
   confirmationAction: () => void;
   confirmationTitle: string;
   confirmationDescription?: string;
   confirmationSevere?: boolean;
   disabled?: boolean;
   timed?: boolean;
   icon: TIcons;
};

const VisualizationTableButtonStart: FC<VisualizationTableButtonStartProps> = ({
   loading,
   confirmationAction,
   confirmationTitle,
   confirmationDescription,
   confirmationSevere,
   disabled,
   icon,
}) => {
   const [openConfirmation, setOpenConfirmation] = useState(false);

   const Icon = iconoirIcons[icon] as any;

   return (
      <Confirmation
         title={confirmationTitle}
         description={confirmationDescription}
         open={disabled ? false : openConfirmation}
         setDialogOpen={setOpenConfirmation}
         severe={confirmationSevere ?? false}
         action={confirmationAction}
      >
         <div className="flex items-center gap-2.5">
            <button
               disabled={disabled || loading}
               className="w-30 shadow-inner-indigo inline-flex items-center justify-between gap-2 rounded-2xl border border-indigo-800 bg-gradient-to-b from-indigo-400 to-indigo-500 px-5 py-2 text-sm font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear disabled:cursor-not-allowed disabled:opacity-75"
               onClick={() => setOpenConfirmation(true)}
            >
               Start
               <span className="-mr-2 ml-2 flex h-8 w-8 items-center justify-center rounded-[0.6rem] bg-indigo-600">
                  {loading ? (
                     <Spinner className="h-4 w-4" />
                  ) : (
                     <Icon className="h-4 w-4" strokeWidth={2} />
                  )}
               </span>
            </button>
         </div>
      </Confirmation>
   );
};

export default VisualizationTableButtonStart;
