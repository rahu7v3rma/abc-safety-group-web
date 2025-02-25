'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Settings } from 'iconoir-react';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Note from '@/components/ui/Note';
import { useUser } from '@/contexts/user';
import usePost from '@/hooks/usePost';
import {
   getTimezone,
   removeNullProperties,
   safePanelHref,
} from '@/lib/helpers';

import SaveButton from '@/components/ui/Buttons/Save';
import { TUserContextForce, TUserData } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import MyProfileUpdateDetails from './Form/Details';
import MyProfileUpdatePhotos from './Form/Photos';
import {
   AdminMyProfileUpdateSchema,
   AdminMyProfileUpdateSchemaType,
   adminMyProfileUpdateDefaultValues,
} from './Form/Schema';

const AdminMyProfileUpdate = () => {
   const router = useRouter();
   const pathname = usePathname();
   const { user, updateUser } = useUser<TUserContextForce>();

   const [adminMyProfileUpdateValues, setMyProfileUpdateValues] = useState({
      ...adminMyProfileUpdateDefaultValues,
      ...removeNullProperties(user as any),
   });

   const form = useForm<AdminMyProfileUpdateSchemaType>({
      resolver: zodResolver(AdminMyProfileUpdateSchema),
      values: adminMyProfileUpdateValues,
   });

   const {
      formState: { errors },
      handleSubmit,
      watch,
   } = form;

   useEffect(() => {
      const subscription = watch((value) => {
         setMyProfileUpdateValues(value as AdminMyProfileUpdateSchemaType);
      });
      return () => subscription.unsubscribe();
   }, [watch]);

   const [adminMyProfileUpdatePost, myProfileUpdateLoading] = usePost<
      AdminMyProfileUpdateSchemaType & {
         timeZone: string;
      },
      { user: TUserData }
   >('users', ['update', 'me']);

   const [adminMyProfileUpdateUploadUserContentPost, uploadContentsLoading] =
      usePost<
         FormData,
         {
            headShot: string;
            otherIdPhoto: string;
            photoIdPhoto: string;
         }
      >('users', ['upload', 'content', user.userId]);

   const AdminMyProfileUpdateUploadUserContents = useCallback(
      (
         newUser: TUserData,
         headShot?: File | string,
         photoIdPhoto?: File | string,
         otherIdPhoto?: File | string
      ) => {
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
            adminMyProfileUpdateUploadUserContentPost(
               formData,
               {
                  success: (photos) => {
                     updateUser({
                        ...newUser,
                        ...photos,
                     });
                     router.push(safePanelHref('/profile', pathname));
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
      },
      [adminMyProfileUpdateUploadUserContentPost, updateUser, router, pathname]
   );

   const AdminMyProfileUpdateSave = useCallback(() => {
      const { headShot, photoIdPhoto, otherIdPhoto, ...values } =
         adminMyProfileUpdateValues;
      toast.promise(
         adminMyProfileUpdatePost(
            {
               ...values,
               headShot: typeof headShot !== 'string' ? '' : headShot,
               photoIdPhoto:
                  typeof photoIdPhoto !== 'string' ? '' : photoIdPhoto,
               otherIdPhoto:
                  typeof otherIdPhoto !== 'string' ? '' : otherIdPhoto,
               timeZone: getTimezone(),
            },
            {
               success: ({ user: newUser }) => {
                  if (
                     (headShot && typeof headShot !== 'string') ||
                     (photoIdPhoto && typeof photoIdPhoto !== 'string') ||
                     (otherIdPhoto && typeof otherIdPhoto !== 'string')
                  ) {
                     AdminMyProfileUpdateUploadUserContents(
                        newUser,
                        headShot,
                        photoIdPhoto,
                        otherIdPhoto
                     );
                  } else {
                     updateUser(newUser);
                     router.push(safePanelHref('/profile', pathname));
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
      adminMyProfileUpdateValues,
      adminMyProfileUpdatePost,
      AdminMyProfileUpdateUploadUserContents,
      updateUser,
      router,
      pathname,
   ]);

   const AdminMyProfileUpdateCancel = useCallback(() => {
      router.push('/admin/profile');
   }, [router]);

   return (
      <div className="relative flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <Settings
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               My profile update
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={
                     !!Object.keys(errors).length ||
                     myProfileUpdateLoading ||
                     uploadContentsLoading
                  }
                  onClick={handleSubmit(AdminMyProfileUpdateSave)}
                  loading={myProfileUpdateLoading || uploadContentsLoading}
               />
               <button
                  onClick={AdminMyProfileUpdateCancel}
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
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminMyProfileUpdate;
