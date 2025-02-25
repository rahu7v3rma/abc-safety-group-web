'use client';

import { FolderPlus, Upload } from 'iconoir-react';
import { FC, useMemo } from 'react';

import SaveButton from '@/components/ui/Buttons/Save';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { TAdminTableCourseData, TBundleCreationData } from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BundleEditor from './Editor';

export type BundleCreationCoursesData = {
   courseId: string;
   courseName: string;
   startDate: string;
};

interface BundleCreationProps {}

// TODO: look at why dropdown isnt search supported
const BundleCreation: FC<BundleCreationProps> = () => {
   const router = useRouter();

   const bundleCourses = useHookstate<BundleCreationCoursesData[]>([]);
   const bundleName = useHookstate<string>('');
   const allowCash = useHookstate<boolean>(false);
   const bundlePrice = useHookstate<number>(0);
   const allowWaitlist = useHookstate<boolean>(false);

   const coursesError = useHookstate<
      false | { courses: TAdminTableCourseData[] }
   >(false);

   const disabledSave = useMemo(() => {
      return (
         !!coursesError.value ||
         !bundleName.value.trim().length ||
         !bundleCourses.length
      );
   }, [coursesError, bundleName, bundleCourses]);

   const [bundleCreatePost, loading, error] = usePost<
      TBundleCreationData,
      { bundle: any }
   >('courses', ['bundle', 'create']);

   function cancel() {
      router.push('/admin/courses');
   }

   function save(active: boolean = false) {
      toast.promise(
         bundleCreatePost(
            {
               active,
               bundleName: bundleName.get(),
               allowCash: allowCash.get(),
               price: bundlePrice.get(),
               courseIds: bundleCourses.get().map((course) => course.courseId!),
               waitlist: allowWaitlist.get(),
            },
            {
               success: () => {
                  router.push('/admin/courses?table=Bundles');
                  router.refresh();
               },
            },
            { throw: true }
         ),
         {
            loading: 'Creating bundle...',
            success: 'Bundle created',
            error: 'Failed creating bundle',
         }
      );
   }

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <FolderPlus
                  className="mr-4 8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Bundle creation
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={disabledSave || loading}
                  onClick={() => save()}
                  loading={loading}
               />
               <button
                  onClick={() => save(true)}
                  disabled={disabledSave}
                  className="px-5 w-48 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
               >
                  Save and Publish
                  <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                     {loading ? (
                        <Spinner className="h-4 w-4" />
                     ) : (
                        <Upload className="h-4 w-4" strokeWidth={2} />
                     )}
                  </span>
               </button>
               <button
                  onClick={cancel}
                  className="px-5 py-3.5 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm bg-gradient-to-b from-red-500 to-red-600 rounded-2xl shadow-inner-red"
               >
                  Cancel
               </button>
            </div>
         </div>
         <div className="mt-5 p-10 h-[1px] overflow-auto rounded-2xl bg-zinc-50 border border-zinc-200 flex-grow flex flex-col">
            <div className="flex max-w-lg w-full flex-col mx-auto">
               <BundleEditor
                  bundleCourses={bundleCourses}
                  bundleName={bundleName}
                  allowCash={allowCash}
                  bundlePrice={bundlePrice}
                  allowWaitlist={allowWaitlist}
                  coursesError={coursesError}
               />
            </div>
         </div>
      </div>
   );
};

export default BundleCreation;
