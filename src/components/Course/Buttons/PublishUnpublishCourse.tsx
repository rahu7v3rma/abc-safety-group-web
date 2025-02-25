'use client';
import usePost from '@/hooks/usePost';
import { TCourseDetailsData } from '@/lib/types';
import clsx from 'clsx';
import { EyeClosed, Upload } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { toast } from 'sonner';

interface PublishUnpublishCourseButtonProps {
   course: TCourseDetailsData;
}

const PublishUnpublishCourseButton: FC<PublishUnpublishCourseButtonProps> = ({
   course,
}) => {
   const router = useRouter();

   const [publishUnpublishCoursePost, publishUnpublishCoursePostLoading] =
      usePost<
         Omit<TCourseDetailsData, 'instructors'> & {
            instructors: string[];
         },
         any
      >('courses', 'update');

   function PublishUnpublishCourse() {
      const { instructors, active, ...requestPayload } = course;
      toast.promise(
         publishUnpublishCoursePost(
            {
               ...requestPayload,
               instructors: instructors.map((instructor) => instructor.userId),
               active: !active,
            },
            {
               success: router.refresh,
            },
            { throw: true }
         ),
         {
            loading: `${
               course.active ? 'Unpublishing' : 'Publishing'
            } course...`,
            success: `${course.active ? 'Unpublished' : 'Published'} course`,
            error: `Failed ${
               course.active ? 'unpublishing' : 'publishing'
            } course`,
         }
      );
   }

   return (
      <button
         onClick={PublishUnpublishCourse}
         disabled={publishUnpublishCoursePostLoading}
         className={clsx(
            'px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-indigo-800 font-semibold text-sm py-2 bg-gradient-to-b from-indigo-400 to-indigo-500 rounded-2xl shadow-inner-indigo',
            course.active ? 'w-36' : 'w-32'
         )}
      >
         {course.active ? 'Unpublish' : 'Publish'}
         <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-indigo-600 rounded-[0.6rem]">
            {course.active ? (
               <EyeClosed className="h-4 w-4" strokeWidth={2} />
            ) : (
               <Upload className="h-4 w-4" strokeWidth={2} />
            )}
         </span>
      </button>
   );
};

export default PublishUnpublishCourseButton;
