'use client';

import RegisterForm, {
   registerDefaultValues,
   registerInformationSchema,
   registerInformationSchemaType,
} from '@/components/Register/Form';
import SaveButton from '@/components/ui/Buttons/Save';
import usePost from '@/hooks/usePost';
import { dateFormat, getTimezone } from '@/lib/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHookstate } from '@hookstate/core';
import { format } from 'date-fns';
import { UserPlus } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type RegisterRequestBody = Omit<
   registerInformationSchemaType,
   'headShot' | 'photoIdPhoto' | 'otherIdPhoto' | 'expirationDate'
> & {
   timeZone: string;
   expirationDate?: string;
};

const InstructorCreation = () => {
   const router = useRouter();

   const form = useForm<registerInformationSchemaType>({
      resolver: zodResolver(registerInformationSchema),
      values: registerDefaultValues,
   });

   const [registerInstructorPost, registerInstructorLoading] = usePost<
      RegisterRequestBody,
      { userId: string }
   >('users', ['register', 'instructor']);

   const createdInstructorId = useHookstate('');

   const [uploadUserContents, uploadContentsLoading] = usePost<FormData, any>(
      'users',
      ['upload', 'content', createdInstructorId]
   );

   const UploadContents = useCallback(() => {
      const { headShot, photoIdPhoto, otherIdPhoto } = form.getValues();

      const formData = new FormData();

      if (headShot) {
         formData.append('headShot', headShot);
      }
      if (photoIdPhoto) {
         formData.append('photoIdPhoto', photoIdPhoto);
      }
      if (otherIdPhoto) {
         formData.append('otherIdPhoto', otherIdPhoto);
      }

      toast.promise(
         uploadUserContents(
            formData,
            {
               success: () => {
                  router.push('/admin/users?table=Instructors');
                  router.refresh();
               },
            },
            {
               throw: true,
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         ),
         {
            loading: '(2/2) Uploading user photos...',
            success: '(2/2) User photos uploaded',
            error: 'Failed uploading user photos',
         }
      );
   }, [form, uploadUserContents, router]);

   const Register = useCallback(() => {
      const {
         headShot,
         photoIdPhoto,
         otherIdPhoto,
         expirationDate,
         ...values
      } = form.getValues();

      const requestBody: RegisterRequestBody = {
         ...values,
         timeZone: getTimezone(),
      };
      if (expirationDate) {
         requestBody.expirationDate = format(expirationDate, dateFormat);
      }

      toast.promise(
         registerInstructorPost(
            requestBody,
            {
               success: ({ userId }) => {
                  createdInstructorId.set(userId);
                  UploadContents();
               },
            },
            { throw: true }
         ),
         {
            loading: '(1/2) Registering instructor user...',
            success: '(1/2) Instructor user registered',
            error: 'Failed registering instructor user',
         }
      );
   }, [form, registerInstructorPost, createdInstructorId, UploadContents]);

   const Cancel = useCallback(() => {
      router.back();
   }, [router]);

   return (
      <div className="relative flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <UserPlus
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Instructor creation
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={registerInstructorLoading || uploadContentsLoading}
                  onClick={form.handleSubmit(Register)}
                  loading={registerInstructorLoading || uploadContentsLoading}
               />
               <button
                  onClick={Cancel}
                  className="px-5 py-3.5 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm bg-gradient-to-b from-red-500 to-red-600 rounded-2xl shadow-inner-red"
               >
                  Cancel
               </button>
            </div>
         </div>
         <div className="flex mt-5 flex-grow gap-5 h-[1px]">
            <div className="w-full p-10 overflow-auto relative rounded-2xl bg-zinc-50 border border-zinc-200">
               <div className="max-w-lg w-full flex flex-col gap-10 mx-auto">
                  <RegisterForm
                     enableSteps={false}
                     form={form}
                     noContainerStyles={true}
                     expirationDate={true}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default InstructorCreation;
