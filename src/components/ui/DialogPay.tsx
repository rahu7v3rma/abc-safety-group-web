'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import Dialog from './Dialog';
import { Paypal as PaypalIcon } from 'iconoir-react';
import Paypal, { PaymentSuccess, PaypalBody } from '../Paypal';
import { toast } from 'sonner';

interface DialogPayProps {
   title: string;
   description?: string;
   open: boolean;
   setOpen: Dispatch<SetStateAction<boolean>>;
   body: PaypalBody;
   action: (data: PaymentSuccess) => void;
   fail?: (description: string) => void;
}

const DialogPay: FC<DialogPayProps> = ({
   title,
   description,
   open,
   setOpen,
   body,
   action,
   fail,
}) => {
   function Success(data: PaymentSuccess) {
      toast.success('Payment success');
      action(data);
   }

   function Fail(description: string) {
      toast.error(description);
      if (fail) fail(description);
   }

   return (
      <Dialog open={open} onOpenChange={setOpen} zIndex={10002}>
         <div className="flex items-center gap-5 w-full">
            <div className="h-12 w-12 flex-shrink-0 flex-grow-0 rounded-full flex items-center justify-center bg-blue-500/10">
               <PaypalIcon className="h-6 w-6 text-blue-500" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
               <p className="text-xl font-semibold tracking-tight">{title}</p>
               {description && (
                  <p className="mt-2.5 text-zinc-500">{description}</p>
               )}
            </div>
         </div>
         <Paypal body={body} success={Success} fail={Fail} />
      </Dialog>
   );
};

export default DialogPay;
