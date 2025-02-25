'use client';
import usePost from '@/hooks/usePost';
import { getDropdownObjectValue } from '@/lib/helpers';
import { TCourseDetailsData } from '@/lib/types';
import { ImmutableObject } from '@hookstate/core';
import { Check, PageEdit } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import CourseGeneralInformation, {
   generalInformationSchema,
   generalInformationSchemaType,
   useGeneralInformation,
} from '../../Create/Course/Tabs/Tab/GeneralInformation';

interface CourseUpdateProps {
   course: TCourseDetailsData;
}

const CourseUpdate: FC<CourseUpdateProps> = ({ course }) => {
   const router = useRouter();

   const generalInformation = useGeneralInformation((state) => state.data);
   const resetGeneralInformation = useGeneralInformation(
      (state) => state.reset
   );

   useEffect(() => {
      resetGeneralInformation();
   }, []);

   const canUpdate = useMemo(() => {
      const generalInformationCheck =
         generalInformationSchema.safeParse(generalInformation);
      return !!generalInformationCheck.success;
   }, [generalInformation]);

   const getDefaultValues = (): Omit<
      generalInformationSchemaType,
      'coursePicture'
   > => {
      return {
         ...course,
         instructors: course.instructors.map((instructor) => ({
            text: `${instructor.firstName} ${instructor.lastName}`,
            value: instructor.userId,
         })),
         prerequisites: course.prerequisites.map((prerequisite) => ({
            text: prerequisite.courseName,
            value: prerequisite.courseId,
         })),
      };
   };

   function cancel() {
      router.push('/admin/courses/course/' + course.courseId);
   }

   const [updateCourse, loading, error] = usePost<
      ImmutableObject<generalInformationSchemaType> & {
         active: boolean;
      },
      any
   >('courses', 'update');

   function Update(active: boolean) {
      if (canUpdate) {
         const { duration, coursePicture, ...data } = generalInformation;

         toast.promise(
            updateCourse(
               {
                  ...data,
                  instructors: getDropdownObjectValue(
                     generalInformation.instructors
                  ),
                  prerequisites: getDropdownObjectValue(
                     generalInformation.prerequisites
                  ),
                  active,
               },
               {
                  success: () => {
                     router.push('/admin/courses/course/' + course.courseId);
                     router.refresh();
                  },
               },
               { throw: true }
            ),
            {
               loading: 'Updating course...',
               success: 'Course updated',
               error: 'Failed updating course',
            }
         );
      }
   }

   const defaultValues = getDefaultValues();

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <PageEdit
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Course update
            </div>
            <div className="flex items-center gap-2.5">
               <button
                  onClick={() => Update(course.active)}
                  disabled={!canUpdate}
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
         <div className="flex-grow mt-5 h-[1px] p-10 overflow-auto relative rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="max-w-2xl mx-auto w-full">
               <CourseGeneralInformation
                  disabled={['duration', 'coursePicture']}
                  defaultValues={defaultValues}
               />
            </div>
         </div>
      </div>
   );
};

export default CourseUpdate;
