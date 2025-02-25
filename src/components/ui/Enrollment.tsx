import { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';
import Dialog from './Dialog';
import { PageFlip, PageStar, WarningTriangle } from 'iconoir-react';
import Checkbox from '@/components/ui/Checkbox';

interface EnrollmentProps {
   title: string;
   name: string;
   open: boolean;
   setDialogOpen: Dispatch<SetStateAction<boolean>>;
   action: any;
   checkbox?: {
      label: string;
      checked: boolean;
      setChecked: Dispatch<SetStateAction<boolean>>;
   };
}

const Enrollment: FC<EnrollmentProps> = ({
   title,
   name,
   open,
   setDialogOpen,
   action,
   checkbox,
}) => {
   return (
      <Dialog
         open={open}
         onOpenChange={(open) => {
            if (!open) {
               if (checkbox) checkbox.setChecked(false);
            }
            setDialogOpen(open);
         }}
         zIndex={10002}
      >
         <div className="flex items-start gap-5 w-full">
            <div className="h-12 w-12 flex-shrink-0 flex-grow-0 rounded-full flex items-center justify-center bg-blue-500/10">
               <PageFlip className="h-6 w-6 text-blue-500" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
               <p className="text-xl font-semibold tracking-tight">{title}</p>
               <p className="mt-2.5 text-zinc-500">
                  You are enrolling into{' '}
                  <span className="font-medium text-zinc-600">{name}</span>
               </p>
               {checkbox && (
                  <div className="flex gap-2 items-center mt-5">
                     <Checkbox
                        id={checkbox.label}
                        name={checkbox.label}
                        checked={checkbox.checked}
                        onCheckedChange={(checked: boolean) =>
                           checkbox.setChecked(checked)
                        }
                        className="h-7 w-7 flex-shrink-0 flex-grow-0"
                        checkClassName="w-5 h-5"
                     />
                     <label
                        htmlFor={checkbox.label}
                        className="ml-1 text-zinc-600 font-medium tracking-tight"
                     >
                        {checkbox.label}
                     </label>
                  </div>
               )}
            </div>
         </div>
         <div className="mt-10 gap-x-2.5 w-full flex items-center justify-end">
            <button
               onClick={() => {
                  setDialogOpen(false);
                  if (checkbox) checkbox.setChecked(false);
               }}
               className="py-3 px-6 font-medium rounded-xl bg-zinc-500 transition duration-200 ease-linear hover:bg-zinc-600 text-white"
            >
               Cancel
            </button>
            <button
               onClick={() => {
                  action();
                  setDialogOpen(false);
               }}
               className="py-3 px-6 font-medium rounded-xl bg-blue-500 transition duration-200 ease-linear hover:bg-blue-600 text-white"
            >
               Confirm
            </button>
         </div>
      </Dialog>
   );
};

export default Enrollment;
