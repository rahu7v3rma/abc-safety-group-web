'use client';

import SaveButton from '@/components/ui/Buttons/Save';
import InputNumber from '@/components/ui/InputNumber';
import Textarea from '@/components/ui/TextArea';
import usePost from '@/hooks/usePost';
import { TTransaction } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Page } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { TTransactionsUpdateSchema, TransactionsUpdateSchema } from './Schema';

type Props = {
   transaction: TTransaction;
};

const TransactionUpdate: FC<Props> = ({ transaction }) => {
   const { transactionId } = transaction;

   const router = useRouter();

   const {
      formState: { errors },
      control,
      trigger,
      getValues,
   } = useForm<TTransactionsUpdateSchema>({
      resolver: zodResolver(TransactionsUpdateSchema),
      values: {
         price: transaction.price,
         description: transaction.description,
         notes: transaction.notes,
      },
   });

   const {
      field: { value: priceValue, onChange: priceOnChange },
   } = useController({ name: 'price', control });
   const {
      field: { value: notesValue, onChange: notesOnChange },
   } = useController({ name: 'notes', control });

   const [updateTransactionPost, updateTransactionPostLoading] = usePost<
      TTransactionsUpdateSchema,
      any
   >('transactions', ['update', transactionId]);

   const Update = useCallback(() => {
      trigger();
      const values = getValues();
      if (values.price) {
         toast.promise(
            updateTransactionPost(
               values,
               {
                  success: () => {
                     router.back();
                     router.refresh();
                  },
               },
               {
                  throw: true,
               }
            ),
            {
               loading: 'Updating transaction...',
               success: 'Updated transaction!',
               error: 'Failed updating transaction.',
            }
         );
      }
   }, [trigger, getValues, updateTransactionPost, router]);

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <Page className="mr-4 h-8 w-8 text-blue-500" strokeWidth={2} />
               Transaction update
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={updateTransactionPostLoading}
                  onClick={Update}
                  loading={updateTransactionPostLoading}
               />
               <button
                  className="px-5 py-3.5 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm bg-gradient-to-b from-red-500 to-red-600 rounded-2xl shadow-inner-red"
                  onClick={() => router.back()}
               >
                  Cancel
               </button>
            </div>
         </div>
         <div className="mt-5 h-[1px] gap-5 bg-zinc-50 rounded-2xl border border-zinc-200 p-10 flex flex-col flex-grow overflow-auto">
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-5">
               <InputNumber
                  label="Amount"
                  value={priceValue}
                  onChange={priceOnChange}
                  error={errors.price}
                  trigger={trigger}
               />
               <Textarea
                  label="Notes"
                  required={false}
                  value={notesValue}
                  onChange={notesOnChange}
               />
            </div>
         </div>
      </div>
   );
};

export default TransactionUpdate;
