'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Note from '@/components/ui/Note';
import usePost from '@/hooks/usePost';
import { dateFormat, getTimezone, removeNullProperties } from '@/lib/helpers';

import SaveButton from '@/components/ui/Buttons/Save';
import Checkbox from '@/components/ui/Checkbox';
import { TImportStudent, TUserData } from '@/lib/types';
import { format } from 'date-fns';
import { FC, useCallback, useState } from 'react';
import MyProfileUpdateDetails from './Form/Details';
import MyProfileUpdatePhotos from './Form/Photos';
import {
   AdminUserUpdateSchema,
   AdminUserUpdateSchemaType,
   adminUserUpdateDefaultValues,
} from './Form/Schema';

type AdminUserUpdateRequestBody = Omit<
   AdminUserUpdateSchemaType,
   'expirationDate'
> & {
   timeZone: string;
   expirationDate?: string | null;
};

interface AdminUserUpdateProps {
   user: TUserData;
   uploadToTrainingConnect: boolean;
}

const AdminUserUpdate: FC<AdminUserUpdateProps> = ({
   user,
   uploadToTrainingConnect,
}) => {
   const router = useRouter();

   const form = useForm<AdminUserUpdateSchemaType>({
      resolver: zodResolver(AdminUserUpdateSchema),
      values: {
         ...adminUserUpdateDefaultValues,
         ...removeNullProperties(user as any),
         expirationDate: user.expirationDate
            ? new Date(user.expirationDate)
            : undefined,
      },
   });

   const [userUpdatePost, userUpdateLoading] = usePost<
      AdminUserUpdateRequestBody,
      { user: TUserData }
   >('admin', ['users', 'update', user.userId]);

   const [uploadContentsPost, uploadContentsLoading] = usePost<
      FormData,
      {
         headShot: string;
         otherIdPhoto: string;
         photoIdPhoto: string;
      }
   >('users', ['upload', 'content', user.userId]);

   const [uploadToTrainingConnectCheckbox, setUploadToTrainingConnectCheckbox] =
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
            userId: user.userId,
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
                     router.push('/admin/users/' + user.userId);
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
      [form, user, uploadToTrainingConnectPost, router]
   );

   const UploadContents = useCallback(() => {
      const { headShot, photoIdPhoto, otherIdPhoto } = form.getValues();

      const formData = new FormData();

      if (headShot && typeof headShot !== 'string') {
         formData.append('headShot', headShot);
      }
      if (photoIdPhoto && typeof photoIdPhoto !== 'string') {
         formData.append('photoIdPhoto', photoIdPhoto);
      }
      if (otherIdPhoto && typeof otherIdPhoto !== 'string') {
         formData.append('otherIdPhoto', otherIdPhoto);
      }

      toast.promise(
         uploadContentsPost(
            formData,
            {
               success: () => {
                  if (uploadToTrainingConnectCheckbox) {
                     UploadToTrainingConnect();
                  } else {
                     router.push('/admin/users/' + user.userId);
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
            loading: 'Updating photos...',
            success: 'Photos updated',
            error: 'Failed updating photos',
         }
      );
   }, [
      form,
      uploadContentsPost,
      router,
      user,
      uploadToTrainingConnectCheckbox,
      UploadToTrainingConnect,
   ]);

   const Save = useCallback(() => {
      const {
         headShot,
         photoIdPhoto,
         otherIdPhoto,
         expirationDate,
         ...values
      } = form.getValues();

      const requestBody: AdminUserUpdateRequestBody = {
         ...values,
         headShot: typeof headShot !== 'string' ? '' : headShot,
         photoIdPhoto: typeof photoIdPhoto !== 'string' ? '' : photoIdPhoto,
         otherIdPhoto: typeof otherIdPhoto !== 'string' ? '' : otherIdPhoto,
         timeZone: getTimezone(),
         expirationDate: expirationDate
            ? format(expirationDate, dateFormat)
            : expirationDate,
      };

      toast.promise(
         userUpdatePost(
            requestBody,
            {
               success: () => {
                  if (
                     headShot instanceof File ||
                     photoIdPhoto instanceof File ||
                     otherIdPhoto instanceof File
                  ) {
                     UploadContents();
                  } else if (uploadToTrainingConnectCheckbox) {
                     UploadToTrainingConnect();
                  } else {
                     router.push('/admin/users/' + user.userId);
                     router.refresh();
                  }
               },
            },
            { throw: true }
         ),
         {
            loading: 'Updating profile...',
            success: 'Profile updated',
            error: 'Failed updating profile',
         }
      );
   }, [
      form,
      userUpdatePost,
      user,
      router,
      UploadContents,
      uploadToTrainingConnectCheckbox,
      UploadToTrainingConnect,
   ]);

   const Cancel = useCallback(() => {
      router.push('/admin/users/' + user.userId);
   }, [router, user]);

   return (
      <div className="relative flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <User className="mr-4 h-8 w-8 text-blue-500" strokeWidth={2} />
               User update
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={
                     !!Object.keys(form.formState.errors).length ||
                     userUpdateLoading ||
                     uploadContentsLoading ||
                     trainingConnectLoading
                  }
                  onClick={form.handleSubmit(Save)}
                  loading={
                     userUpdateLoading ||
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
               <div className="max-w-lg w-full flex flex-col gap-10 mx-auto">
                  <Note text="Your timezone is automatically updated upon saving." />
                  <div className="w-full">
                     <form className={'flex flex-col gap-y-5'}>
                        <MyProfileUpdatePhotos form={form} />
                        <MyProfileUpdateDetails form={form} />
                        {uploadToTrainingConnect && (
                           <div className="flex gap-2 items-center">
                              <Checkbox
                                 id="uploadToTrainingConnect"
                                 name="uploadToTrainingConnect"
                                 checked={uploadToTrainingConnectCheckbox}
                                 onCheckedChange={(checked: boolean) =>
                                    setUploadToTrainingConnectCheckbox(checked)
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
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminUserUpdate;
