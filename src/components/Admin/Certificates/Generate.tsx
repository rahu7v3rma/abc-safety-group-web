'use client';

import SaveButton from '@/components/ui/Buttons/Save';
import Checkbox from '@/components/ui/Checkbox';
import DropdownListPaginated from '@/components/ui/DropdownListPaginated';
import DropdownPaginated from '@/components/ui/DropdownPaginated';
import { fetchCourses, searchFetchCourses } from '@/data/pagination/courses';
import { fetchUsers, searchFetchUsers } from '@/data/pagination/users';
import usePost from '@/hooks/usePost';
import { getDropdownObjectValue } from '@/lib/helpers';
import { TAdminCertificatesGeneratePostPayload } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { PagePlus } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const FormSchema = z.object({
   users: z
      .array(
         z.object({
            text: z.string(),
            value: z.string(),
         })
      )
      .min(1, {
         message: 'Users must have at least 1',
      }),
   course: z
      .object({
         text: z.string(),
         value: z.string(),
      })
      .optional()
      .refine((v) => !!v, { message: 'Course is required' }),
   notifyUsers: z.boolean(),
   uploadCertificates: z.boolean().optional(),
});

type GenerateProps = {
   uploadToTrainingConnect?: boolean;
};

const Generate: FC<GenerateProps> = ({ uploadToTrainingConnect }) => {
   const router = useRouter();

   const {
      handleSubmit,
      formState: { errors },
      control,
      trigger,
      reset,
      getValues,
   } = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         users: [],
         notifyUsers: true,
         uploadCertificates: false,
      },
   });

   const {
      field: { value: usersValue, onChange: usersOnChange },
   } = useController({ name: 'users', control });
   const {
      field: { value: courseValue, onChange: courseOnChange },
   } = useController({ name: 'course', control });
   const {
      field: { value: notifyUsersValue, onChange: notifyUsersOnChange },
   } = useController({ name: 'notifyUsers', control });
   const {
      field: {
         value: uploadCertificatesValue,
         onChange: uploadCertificatesOnChange,
      },
   } = useController({ name: 'uploadCertificates', control });

   const [generatePost, generatePostLoading] = usePost<
      TAdminCertificatesGeneratePostPayload,
      any
   >('admin', ['users', 'certificates', 'generate']);

   const Continue = useCallback(() => {
      trigger();
      const formValues = getValues();
      if (FormSchema.safeParse(formValues).success) {
         const { users, course, notifyUsers, uploadCertificates } = formValues;
         const payload: TAdminCertificatesGeneratePostPayload = {
            userIds: getDropdownObjectValue(users),
            courseId: course!.value,
            notifyUsers,
         };
         if (uploadToTrainingConnect) {
            payload.uploadCertificates = uploadCertificates;
         }
         toast.promise(
            generatePost(
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
               success: 'Generated certificate!',
               error: (error) => error.message,
            }
         );
      }
   }, [
      trigger,
      getValues,
      generatePost,
      reset,
      router,
      uploadToTrainingConnect,
   ]);

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
                  disabled={generatePostLoading}
                  onClick={Continue}
                  loading={generatePostLoading}
               />
               <button
                  className="px-5 py-3.5 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm bg-gradient-to-b from-red-500 to-red-600 rounded-2xl shadow-inner-red"
                  onClick={() => {
                     reset();
                     router.back();
                  }}
               >
                  Cancel
               </button>
            </div>
         </div>
         <div className="flex-grow mt-5 h-[1px] p-10 overflow-auto relative rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="max-w-xl mx-auto w-full">
               <form
                  onSubmit={handleSubmit(Continue)}
                  className="flex flex-col gap-7"
               >
                  <DropdownListPaginated
                     trigger={trigger}
                     label="Users"
                     values={usersValue || []}
                     onChange={usersOnChange}
                     fetch={(page) => fetchUsers(page, 'student')}
                     searchFetch={(query, page) =>
                        searchFetchUsers(query, page, 'student')
                     }
                     placeholder="Select user..."
                     dropdownTriggerClassname="w-56"
                     error={errors.users}
                  />
                  <DropdownPaginated
                     trigger={trigger}
                     label="Course"
                     value={courseValue}
                     onChange={courseOnChange}
                     fetch={fetchCourses}
                     searchFetch={searchFetchCourses}
                     placeholder="Select course..."
                     dropdownTriggerClassname="w-full"
                     error={errors.course}
                  />
                  <div className="mt-5 grid grid-cols-2">
                     {uploadToTrainingConnect && (
                        <div className="flex gap-3 items-center">
                           <Checkbox
                              id="uploadToTrainingConnect"
                              name="uploadToTrainingConnect"
                              checked={uploadCertificatesValue}
                              onCheckedChange={(checked: boolean) => {
                                 uploadCertificatesOnChange(checked);
                                 trigger();
                              }}
                              className="h-8 w-8 flex-shrink-0 flex-grow-0"
                              checkClassName="w-5 h-5"
                           />
                           <label
                              htmlFor="uploadToTrainingConnect"
                              className="mr-10 text-black font-medium tracking-tight"
                           >
                              Upload to training connect
                           </label>
                        </div>
                     )}
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default Generate;
