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

const AdminCreation = () => {
   const router = useRouter();

   const form = useForm<registerInformationSchemaType>({
      resolver: zodResolver(registerInformationSchema),
      values: registerDefaultValues,
   });

   const [registerAdminPost, registerAdminLoading] = usePost<
      RegisterRequestBody,
      { userId: string }
   >('users', ['register', 'admin']);

   const createdAdminId = useHookstate('');

   const [uploadUserContents, uploadContentsLoading] = usePost<FormData, any>(
      'users',
      ['upload', 'content', createdAdminId]
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
                  router.push('/admin/users?table=Admins');
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
         registerAdminPost(
            requestBody,
            {
               success: ({ userId }) => {
                  createdAdminId.set(userId);
                  UploadContents();
               },
            },
            { throw: true }
         ),
         {
            loading: '(1/2) Registering admin user...',
            success: '(1/2) Admin user registered',
            error: 'Failed registering admin user',
         }
      );
   }, [form, registerAdminPost, createdAdminId, UploadContents]);

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
               Admin creation
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={registerAdminLoading || uploadContentsLoading}
                  onClick={form.handleSubmit(Register)}
                  loading={registerAdminLoading || uploadContentsLoading}
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

export default AdminCreation;
