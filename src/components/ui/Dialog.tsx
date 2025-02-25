'use client';

import * as RDialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { Xmark } from 'iconoir-react';
import { ReactNode, forwardRef } from 'react';

interface DialogProps extends RDialog.DialogProps {
   trigger?: ReactNode;
   contentClassName?: string;
   zIndex?: number;
   disablePadding?: boolean;
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
   (
      {
         trigger,
         children,
         contentClassName,
         zIndex,
         disablePadding = false,
         ...props
      },
      ref?
   ) => (
      <RDialog.Root {...props}>
         {trigger && <RDialog.Trigger asChild>{trigger}</RDialog.Trigger>}
         <RDialog.Portal>
            <RDialog.Overlay
               style={{
                  zIndex: zIndex ?? 10000,
               }}
               className="bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-overlayShow fixed inset-0"
            />
            <RDialog.Content
               ref={ref}
               className={clsx(
                  'data-[state=open]:animate-contentShow overflow-auto fixed top-[50%] left-[50%] max-h-[95vh] w-[90vw] rounded-3xl translate-x-[-50%] translate-y-[-50%] bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none',
                  contentClassName ?? 'max-w-lg',
                  !disablePadding && 'py-10 px-10'
               )}
               style={{
                  zIndex: zIndex ?? 10000,
               }}
            >
               {children}
               <RDialog.Close asChild>
                  <button
                     className="text-red-500 hover:text-red-600 absolute h-10 w-10 hover:bg-red-500/10 transition duration-200 ease-linear rounded-xl top-3 right-3 inline-flex appearance-none items-center justify-center focus:outline-none"
                     aria-label="Close"
                  >
                     <Xmark className="h-6 w-6" strokeWidth={2} />
                  </button>
               </RDialog.Close>
            </RDialog.Content>
         </RDialog.Portal>
      </RDialog.Root>
   )
);

export default Dialog;
