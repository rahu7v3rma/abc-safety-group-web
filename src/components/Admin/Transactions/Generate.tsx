'use client';

import SaveButton from '@/components/ui/Buttons/Save';
import DropdownHook from '@/components/ui/DropdownHook';
import DropdownPaginated from '@/components/ui/DropdownPaginated';
import InputNumber from '@/components/ui/InputNumber';
import Textarea from '@/components/ui/TextArea';
import {
   fetchBundles,
   fetchCourses,
   searchFetchBundles,
   searchFetchCourses,
} from '@/data/pagination/courses';
import { fetchUsers, searchFetchUsers } from '@/data/pagination/users';
import usePost from '@/hooks/usePost';
import { zodResolver } from '@hookform/resolvers/zod';
import { PagePlus } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
   TTransactionsGenerateSchema,
   TransactionsGenerateRequestBody,
   TransactionsGenerateSchema,
   transactionsGenerateStateDefault,
} from './Schema';

type AdminTransactionsGenerateProps = {};

const AdminTransactionsGenerate: FC<AdminTransactionsGenerateProps> = () => {
   const router = useRouter();

   const {
      handleSubmit,
      control,
      reset,
      formState: { errors },
      getValues,
      trigger,
   } = useForm<TTransactionsGenerateSchema>({
      resolver: zodResolver(TransactionsGenerateSchema),
      defaultValues: transactionsGenerateStateDefault,
   });

   const {
      field: { value: userIdValue, onChange: userIdOnChange },
   } = useController({ name: 'userId', control });
   const {
      field: {
         value: transactionTypeIdValue,
         onChange: transactionTypeIdOnChange,
      },
   } = useController({ name: 'transactionTypeId', control });
   const {
      field: { value: priceValue, onChange: priceOnChange },
   } = useController({ name: 'price', control });
   const {
      field: { value: notesValue, onChange: notesOnChange },
   } = useController({ name: 'notes', control });

   const [selectedTransactionType, setSelectedTransactionType] = useState('');

   const [transactionGeneratePost, transactionGeneratePostLoading] = usePost<
      TransactionsGenerateRequestBody,
      any
   >('transactions', ['create']);

   const Save = useCallback(() => {
      trigger();
      const values = getValues();

      if (values.userId && values.price) {
         const requestBody: TransactionsGenerateRequestBody = {
            userId: values.userId.value,
            price: values.price,
            amount: values.price,
            description: 'Generated transaction record in LMS',
         };
         if (values.transactionTypeId) {
            if (selectedTransactionType === 'Course') {
               requestBody.courseId = values.transactionTypeId.value;
            }
            if (selectedTransactionType === 'Bundle') {
               requestBody.bundleId = values.transactionTypeId.value;
            }
         }
         if (values.notes) {
            requestBody.notes = values.notes;
         }
         toast.promise(
            transactionGeneratePost(
               requestBody,
               {
                  success: () => {
                     reset(transactionsGenerateStateDefault);
                     setSelectedTransactionType('');
                     router.back();
                     router.refresh();
                  },
               },
               {
                  throw: true,
               }
            ),
            {
               loading: 'Generating transaction...',
               success: 'Generated transaction!',
               error: 'Failed generating transaction.',
            }
         );
      }
   }, [
      trigger,
      getValues,
      reset,
      transactionGeneratePost,
      router,
      selectedTransactionType,
   ]);

   const Cancel = useCallback(() => {
      reset(transactionsGenerateStateDefault);
      setSelectedTransactionType('');
      router.back();
   }, [router, reset]);

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <PagePlus
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Transaction generation
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={transactionGeneratePostLoading}
                  onClick={Save}
                  loading={transactionGeneratePostLoading}
               />
               <button
                  className="px-5 py-3.5 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm bg-gradient-to-b from-red-500 to-red-600 rounded-2xl shadow-inner-red"
                  onClick={Cancel}
               >
                  Cancel
               </button>
            </div>
         </div>
         <div className="flex-grow mt-5 h-[1px] p-10 overflow-auto relative rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="max-w-xl mx-auto w-full">
               <form
                  onSubmit={handleSubmit(Save)}
                  className="flex flex-col gap-4"
               >
                  <DropdownPaginated
                     trigger={trigger}
                     label="User"
                     placeholder="Select user"
                     value={userIdValue}
                     onChange={userIdOnChange}
                     fetch={(page) => fetchUsers(page, 'student')}
                     searchFetch={(query, page) =>
                        searchFetchUsers(query, page, 'student')
                     }
                     dropdownTriggerClassname="w-full"
                     error={errors.userId}
                  />
                  <InputNumber
                     trigger={trigger}
                     label="Price"
                     iconLabel="$"
                     placeholder="Enter amount here"
                     value={priceValue}
                     onChange={priceOnChange}
                     error={errors.price}
                  />
                  <DropdownHook
                     trigger={trigger}
                     label="Transaction type"
                     placeholder="Select transaction type"
                     options={['Course', 'Bundle']}
                     value={selectedTransactionType}
                     onChange={(option: string) => {
                        setSelectedTransactionType(option);
                        transactionTypeIdOnChange(undefined);
                     }}
                     dropdownTriggerClassname="w-full"
                     required={false}
                  />
                  {selectedTransactionType === 'Course' && (
                     <DropdownPaginated
                        trigger={trigger}
                        label="Course"
                        placeholder="Select course"
                        value={transactionTypeIdValue}
                        fetch={fetchCourses}
                        searchFetch={searchFetchCourses}
                        onChange={transactionTypeIdOnChange}
                        dropdownTriggerClassname="w-full"
                        required={false}
                     />
                  )}
                  {selectedTransactionType === 'Bundle' && (
                     <DropdownPaginated
                        trigger={trigger}
                        label="Bundle"
                        placeholder="Select bundle"
                        value={transactionTypeIdValue}
                        fetch={fetchBundles}
                        searchFetch={searchFetchBundles}
                        onChange={transactionTypeIdOnChange}
                        dropdownTriggerClassname="w-full"
                        required={false}
                     />
                  )}
                  <Textarea
                     value={notesValue}
                     onChange={notesOnChange}
                     label="Notes"
                     required={false}
                  />
               </form>
            </div>
         </div>
      </div>
   );
};

export default AdminTransactionsGenerate;
