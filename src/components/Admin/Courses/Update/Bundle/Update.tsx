'use client';

import { useHookstate } from '@hookstate/core';
import { Check, FolderSettings } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { FC, useMemo } from 'react';
import { toast } from 'sonner';

import usePost from '@/hooks/usePost';
import BundleEditor from '../../../Courses/Create/Bundle/Editor';

import {
   TAdminTableCourseData,
   TBundleCreationData,
   TBundleDetailsData,
} from '@/lib/types';
import { BundleCreationCoursesData } from '../../Create/Bundle/Creation';

interface BundleUpdateProps {
   bundle: TBundleDetailsData;
}

const BundleUpdate: FC<BundleUpdateProps> = ({ bundle }) => {
   const router = useRouter();

   const bundleCourses = useHookstate<BundleCreationCoursesData[]>(
      (bundle.courses as BundleCreationCoursesData[]) ?? []
   );
   const bundleName = useHookstate<string>(bundle.bundleName ?? '');
   const allowCash = useHookstate<boolean>(bundle.allowCash ?? false);
   const bundlePrice = useHookstate<number>(bundle.price ?? 0);
   const allowWaitlist = useHookstate<boolean>(bundle.waitlist ?? false);

   const coursesError = useHookstate<
      false | { courses: TAdminTableCourseData[] }
   >(false);

   const disabledUpdate = useMemo(() => {
      return (
         !!coursesError.value ||
         !bundleName.value.trim().length ||
         !bundleCourses.length
      );
   }, [coursesError, bundleName, bundleCourses]);

   const [bundleUpdate, loading, error] = usePost<
      TBundleCreationData,
      { bundle: any }
   >('courses', ['bundle', 'update']);

   function cancel() {
      router.push('/admin/courses/bundle/' + bundle.bundleId);
   }

   function save(active: boolean) {
      toast.promise(
         bundleUpdate(
            {
               bundleId: bundle.bundleId,
               active,
               bundleName: bundleName.get(),
               allowCash: allowCash.get(),
               price: bundlePrice.get(),
               courseIds: bundleCourses.get().map((course) => course.courseId!),
               waitlist: allowWaitlist.get(),
               maxStudents: 20,
            },
            {
               success: () => {
                  router.push('/admin/courses/bundle/' + bundle.bundleId);
                  router.refresh();
               },
            },
            { throw: true }
         ),
         {
            loading: 'Updating bundle...',
            success: 'Bundle updated',
            error: 'Failed updating bundle',
         }
      );
   }

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <FolderSettings
                  className="mr-4 8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Bundle update
            </div>
            <div className="flex items-center gap-2.5">
               <button
                  onClick={() => save(bundle.active)}
                  disabled={disabledUpdate}
                  className="px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
               >
                  Update
                  <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                     <Check className="h-4 w-4" strokeWidth={2} />
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

export default BundleUpdate;
