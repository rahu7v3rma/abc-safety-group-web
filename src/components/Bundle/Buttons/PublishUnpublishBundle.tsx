'use client';

import usePost from '@/hooks/usePost';
import { TBundleDetailsData } from '@/lib/types';
import clsx from 'clsx';
import { EyeClosed, Upload } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { toast } from 'sonner';

interface PublishUnpublishBundleButtonProps {
   bundle: TBundleDetailsData;
}

const PublishUnpublishBundleButton: FC<PublishUnpublishBundleButtonProps> = ({
   bundle,
}) => {
   const router = useRouter();

   const [publishUnpublishBundlePost, publishUnpublishBundlePostLoading] =
      usePost<
         Omit<TBundleDetailsData, 'courses'> & {
            courseIds: string[];
         },
         any
      >('courses', ['bundle', 'update']);

   function PublishUnpublishBundle() {
      const { courses, active, ...requestPayload } = bundle;
      toast.promise(
         publishUnpublishBundlePost(
            {
               ...requestPayload,
               courseIds: courses.map((course) => course.courseId),
               active: !active,
            },
            {
               success: router.refresh,
            },
            { throw: true }
         ),
         {
            loading: `${
               bundle.active ? 'Unpublishing' : 'Publishing'
            } bundle...`,
            success: `${bundle.active ? 'Unpublished' : 'Published'} bundle`,
            error: `Failed ${
               bundle.active ? 'unpublishing' : 'publishing'
            } bundle`,
         }
      );
   }

   return (
      <button
         onClick={PublishUnpublishBundle}
         disabled={publishUnpublishBundlePostLoading}
         className={clsx(
            'shadow-inner-indigo inline-flex w-32 items-center justify-between rounded-2xl border border-indigo-800 bg-gradient-to-b from-indigo-400 to-indigo-500 px-5 py-2 text-sm font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear disabled:cursor-not-allowed disabled:opacity-75',
            bundle.active ? 'w-36' : 'w-32'
         )}
      >
         {bundle.active ? 'Unpublish' : 'Publish'}
         <span className="-mr-2 flex h-8 w-8 items-center justify-center rounded-[0.6rem] bg-indigo-600">
            {bundle.active ? (
               <EyeClosed className="h-4 w-4" strokeWidth={2} />
            ) : (
               <Upload className="h-4 w-4" strokeWidth={2} />
            )}
         </span>
      </button>
   );
};

export default PublishUnpublishBundleButton;
