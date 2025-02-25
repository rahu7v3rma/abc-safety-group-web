import Checkbox from '@/components/ui/Checkbox';
import clsx from 'clsx';
import { WarningTriangle } from 'iconoir-react';
import React, { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';
import Dialog from './Dialog';

type ConfirmationCheckbox = {
   label: string;
   checked: boolean;
   setChecked: Dispatch<SetStateAction<boolean>>;
   severeMessage?: string;
};

interface ConfirmationProps extends PropsWithChildren {
   title: string;
   open: boolean;
   setDialogOpen: Dispatch<SetStateAction<boolean>>;
   action: any;
   severe?: boolean;
   checkbox?: ConfirmationCheckbox | ConfirmationCheckbox[];
   description?: string;
   content?: React.JSX.Element;
   zIndex?: number;
}

const Confirmation: FC<ConfirmationProps> = ({
   title,
   children,
   open,
   setDialogOpen,
   action,
   severe = true,
   checkbox,
   description,
   content,
   zIndex,
}) => {
   return (
      <Dialog
         open={open}
         onOpenChange={(open) => {
            setDialogOpen(open);
         }}
         trigger={children}
         zIndex={zIndex ?? 10002}
      >
         <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 flex-shrink-0 flex-grow-0 items-center justify-center rounded-full bg-red-500/10">
               <WarningTriangle
                  className="h-6 w-6 text-red-500"
                  strokeWidth={2}
               />
            </div>
            <div>
               <p className="text-xl font-semibold tracking-tight">{title}</p>
               {description && (
                  <p className="mt-2.5 font-medium tracking-tight text-zinc-600">
                     {description}
                  </p>
               )}
               <p className="mt-2.5 text-zinc-500">
                  Are you sure you want to{' '}
                  <span className="font-medium text-zinc-600">{title}</span>?
                  {!!severe && ' This action cannot be undone.'}
               </p>
               {checkbox &&
                  (Array.isArray(checkbox) ? (
                     checkbox.map((currentCheckbox, currentCheckboxIndex) => (
                        <div
                           key={currentCheckboxIndex}
                           className="mt-5 flex items-center gap-2"
                        >
                           <Checkbox
                              id={currentCheckbox.label}
                              name={currentCheckbox.label}
                              checked={currentCheckbox.checked}
                              onCheckedChange={(checked: boolean) =>
                                 currentCheckbox.setChecked(checked)
                              }
                              className="h-7 w-7 flex-shrink-0 flex-grow-0"
                              checkClassName="w-5 h-5"
                           />
                           <label
                              htmlFor={currentCheckbox.label}
                              className="ml-1 font-medium tracking-tight text-black"
                           >
                              {currentCheckbox.label}
                           </label>
                        </div>
                     ))
                  ) : (
                     <div
                        className={clsx(
                           'mt-5 flex gap-2',
                           !checkbox.severeMessage && 'items-center',
                        )}
                     >
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
                        <div className="ml-1">
                           <label
                              htmlFor={checkbox.label}
                              className="font-medium tracking-tight text-black"
                           >
                              {checkbox.label}
                           </label>
                           {checkbox.severeMessage && (
                              <p className="text-xs text-zinc-500">
                                 {checkbox.severeMessage}
                              </p>
                           )}
                        </div>
                     </div>
                  ))}
               {content}
            </div>
         </div>
         <div className="mt-10 flex w-full items-center justify-end gap-x-2.5">
            <button
               onClick={() => setDialogOpen(false)}
               className="rounded-xl bg-zinc-500 px-6 py-3 font-medium text-white transition duration-200 ease-linear hover:bg-zinc-600"
            >
               Cancel
            </button>
            <button
               onClick={() => {
                  action();
                  setDialogOpen(false);
               }}
               className="rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition duration-200 ease-linear hover:bg-blue-600"
            >
               Confirm
            </button>
         </div>
      </Dialog>
   );
};

export default Confirmation;
