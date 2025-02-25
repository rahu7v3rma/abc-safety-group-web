'use client';

import RegisterForm, {
   registerDefaultValues,
   registerInformationSchema,
   registerInformationSchemaType,
} from '@/components/Register/Form';
import SaveButton from '@/components/ui/Buttons/Save';
import Checkbox from '@/components/ui/Checkbox';
import usePost from '@/hooks/usePost';
import { dateFormat, getTimezone } from '@/lib/helpers';
import { TImportStudent } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHookstate } from '@hookstate/core';
import { format } from 'date-fns';
import { UserPlus } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type RegisterRequestBody = Omit<
   registerInformationSchemaType,
   'headShot' | 'photoIdPhoto' | 'otherIdPhoto' | 'expirationDate'
> & {
   timeZone: string;
   expirationDate?: string;
};

type StudentCreationProps = {
   uploadToTrainingConnect?: boolean;
};

const StudentCreation: FC<StudentCreationProps> = ({
   uploadToTrainingConnect,
}) => {
   const router = useRouter();

   const form = useForm<registerInformationSchemaType>({
      resolver: zodResolver(registerInformationSchema),
      values: registerDefaultValues,
   });

   const [registerStudentPost, registerStudentLoading] = usePost<
      RegisterRequestBody,
      { userId: string }
   >('users', ['register', 'student']);

   const createdStudentId = useHookstate('');

   const [uploadUserContents, uploadContentsLoading] = usePost<FormData, any>(
      'users',
      ['upload', 'content', createdStudentId]
   );

   const [uploadToTrainingConnectCheckbox, setUploadToTrainingConnectChecbox] =
      useState(false);

   const [uploadToTrainingConnectPost, trainingConnectLoading] = usePost<
      { students: TImportStudent[] },
      any
   >('data', ['import', 'students']);

   const UploadToTrainingConnect = useCallback(
      (headShot?: string) => {
         const values = form.getValues();

         const student: TImportStudent = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            state: values.state,
            city: values.city,
            address: values.address,
            gender: values.gender,
            eyeColor: values.eyeColor,
            dob: values.dob,
            userId: createdStudentId.value,
            zipcode: String(values.zipcode),
            height: `${values.height.feet}'${values.height.inches}"`,
         };
         if (headShot) {
            student.headShot = headShot;
         }

         toast.promise(
            uploadToTrainingConnectPost(
               {
                  students: [student],
               },
               {
                  success: () => {
                     router.push('/admin/users?table=Students');
                     router.refresh();
                  },
               },
               { throw: true }
            ),
            {
               loading: 'Uploading to training connect...',
               success: 'Uploaded to training connect',
               error: 'Failed uploading to training connect',
            }
         );
      },
      [form, createdStudentId, uploadToTrainingConnectPost, router]
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
               success: (payload) => {
                  if (
                     uploadToTrainingConnectCheckbox &&
                     uploadToTrainingConnect
                  ) {
                     UploadToTrainingConnect(payload?.headShot);
                  } else {
                     router.push('/admin/users?table=Students');
                     router.refresh();
                  }
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
   }, [
      uploadUserContents,
      router,
      uploadToTrainingConnectCheckbox,
      UploadToTrainingConnect,
      form,
      uploadToTrainingConnect,
   ]);

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
         registerStudentPost(
            requestBody,
            {
               success: ({ userId }) => {
                  createdStudentId.set(userId);
                  if (
                     headShot instanceof File ||
                     photoIdPhoto instanceof File ||
                     otherIdPhoto instanceof File
                  ) {
                     UploadContents();
                  } else if (
                     uploadToTrainingConnectCheckbox &&
                     uploadToTrainingConnect
                  ) {
                     UploadToTrainingConnect();
                  } else {
                     router.push('/admin/users?table=Students');
                     router.refresh();
                  }
               },
            },
            { throw: true }
         ),
         {
            loading: '(1/2) Registering student user...',
            success: '(1/2) Student user registered',
            error: 'Failed registering student user',
         }
      );
   }, [
      registerStudentPost,
      form,
      createdStudentId,
      UploadContents,
      UploadToTrainingConnect,
      uploadToTrainingConnectCheckbox,
      router,
      uploadToTrainingConnect,
   ]);

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
               Student creation
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={
                     registerStudentLoading ||
                     uploadContentsLoading ||
                     trainingConnectLoading
                  }
                  onClick={form.handleSubmit(Register)}
                  loading={
                     registerStudentLoading ||
                     uploadContentsLoading ||
                     trainingConnectLoading
                  }
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
               <div className="max-w-lg w-full flex flex-col mx-auto">
                  <RegisterForm
                     enableSteps={false}
                     form={form}
                     noContainerStyles={true}
                     expirationDate={true}
                  />
                  {uploadToTrainingConnect && (
                     <div className="flex gap-2 items-center">
                        <Checkbox
                           id="uploadToTrainingConnect"
                           name="uploadToTrainingConnect"
                           checked={uploadToTrainingConnectCheckbox}
                           onCheckedChange={(checked: boolean) =>
                              setUploadToTrainingConnectChecbox(checked)
                           }
                           className="h-7 w-7 flex-shrink-0 flex-grow-0"
                           checkClassName="w-5 h-5"
                        />
                        <label
                           htmlFor="uploadToTrainingConnect"
                           className="ml-1 text-zinc-600 font-medium tracking-tight"
                        >
                           Upload to training connect
                        </label>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default StudentCreation;
