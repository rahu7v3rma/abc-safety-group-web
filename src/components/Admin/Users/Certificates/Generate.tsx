'use client';

import SaveButton from '@/components/ui/Buttons/Save';
import DatePickerInputHook from '@/components/ui/DatePickerInputHook';
import Input from '@/components/ui/Input';
import usePost from '@/hooks/usePost';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { PagePlus } from 'iconoir-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export const certificateGenerateSchema = z.object({
   certificateName: z.string(),
   expirationDate: z.date().optional(),
});

type GenerateCertificatePayload = {
   certificateName: string;
   userIds: string[];
   expirationDate?: string;
};

const AdminUserProfileCertificatesGenerate = () => {
   const router = useRouter();
   const { id: userId } = useParams<{ id: string }>();

   const {
      handleSubmit,
      formState: { errors },
      control,
      trigger,
      getValues,
      reset,
   } = useForm<z.infer<typeof certificateGenerateSchema>>({
      resolver: zodResolver(certificateGenerateSchema),
      values: {
         certificateName: '',
         expirationDate: undefined,
      },
   });

   const {
      field: { value: certificateNameValue, onChange: certificateNameOnChange },
   } = useController({ name: 'certificateName', control });
   const {
      field: { value: expirationDate, onChange: expirationDateOnChange },
   } = useController({ name: 'expirationDate', control });

   const [generateCertificate, generateCertificateLoading] = usePost<
      GenerateCertificatePayload,
      { success: boolean }
   >('admin', ['users', 'certificates', 'generate']);

   const Continue = useCallback(() => {
      trigger();

      const { certificateName, expirationDate } = getValues();

      if (certificateName) {
         const payload: GenerateCertificatePayload = {
            certificateName,
            userIds: [userId],
         };

         if (expirationDate) {
            payload.expirationDate = format(expirationDate, 'MM/dd/yyyy');
         }

         toast.promise(
            generateCertificate(
               payload,
               {
                  success: () => {
                     reset();
                     router.back();
                     router.refresh();
                  },
               },
               {
                  throw: true,
               }
            ),
            {
               loading: 'Generating certificate...',
               success: 'Success generating certificate',
               error: 'Failed generating certificate',
            }
         );
      }
   }, [trigger, getValues, userId, generateCertificate, reset, router]);

   const Cancel = useCallback(() => {
      reset();
      router.back();
      router.refresh();
   }, [reset, router]);

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <PagePlus
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Certificate generation
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={generateCertificateLoading}
                  onClick={Continue}
                  loading={generateCertificateLoading}
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
            <div className="max-w-3xl mx-auto w-full">
               <form
                  onSubmit={handleSubmit(Continue)}
                  className="flex flex-col gap-7"
               >
                  <Input
                     required={true}
                     trigger={trigger}
                     label="Certificate name"
                     className="placeholder:text-zinc-500 placeholder:font-medium placeholder:!text-base"
                     value={certificateNameValue}
                     onChange={certificateNameOnChange}
                     error={errors.certificateName}
                  />
                  <div className="grid grid-cols-5 gap-5">
                     <DatePickerInputHook
                        trigger={trigger}
                        label="Expiration date"
                        wrapperClassName="col-span-3"
                        value={expirationDate}
                        onChange={expirationDateOnChange}
                        error={errors.expirationDate}
                        datePicker={{
                           dateFormat: 'MMM d, yyyy',
                        }}
                        required={false}
                     />
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default AdminUserProfileCertificatesGenerate;
