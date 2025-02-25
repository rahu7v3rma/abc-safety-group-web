'use client';

import { State } from '@hookstate/core';
import { WarningCircle, Xmark } from 'iconoir-react';
import { FC } from 'react';

import { TAdminTableCourseData } from '@/lib/types';
import { BundleCreationCoursesData } from './Creation';

interface CourseAddedProps {
   bundleCourse: State<BundleCreationCoursesData, {}>;
   bundleCourses: State<BundleCreationCoursesData[], {}>;
   coursesError: State<false | { courses: TAdminTableCourseData[] }, {}>;
}

const CourseAdded: FC<CourseAddedProps> = ({
   bundleCourse,
   bundleCourses,
   coursesError,
}) => {
   function removeCourse() {
      if (coursesError.value) {
         const currentCourse = bundleCourse.get({ noproxy: true });
         const find = coursesError.value.courses.find(
            (c) => c.courseId === currentCourse.courseId
         );
         if (find) {
            const filter = coursesError.value.courses.filter(
               (c) => c.courseId !== currentCourse.courseId
            );
            if (filter.length <= 1) {
               coursesError.set(false);
            }
         }
      }
      bundleCourses.set((courses) =>
         courses.filter(
            (course) =>
               JSON.stringify(course) !== JSON.stringify(bundleCourse.value)
         )
      );
   }

   function hasError() {
      if (coursesError.value) {
         const currentCourse = bundleCourse.get({ noproxy: true });
         const find = coursesError.value.courses.find(
            (c) => c.courseId === currentCourse.courseId
         );
         return !!find;
      }
      return false;
   }

   return (
      <div className="w-full flex justify-between items-center bg-white shadow border border-zinc-200 rounded-3xl py-4 px-5">
         <div className="flex gap-5 items-start">
            <div className="h-14 w-14 flex flex-shrink-0 flex-grow-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-300 via-blue-500 to-blue-600 text-white font-semibold">
               <p className="text-lg">
                  {bundleCourse.courseName.value[0].toUpperCase()}
               </p>
            </div>
            <div>
               <p className="text-blue-500 font-medium pr-5 tracking-tight">
                  {bundleCourse.courseName.value}
               </p>
               <p className="text-sm text-zinc-500 mt-1">
                  {bundleCourse.startDate.value}
               </p>
               {hasError() && (
                  <div className="mt-1 text-sm text-red-500 inline-flex items-center font-medium tracking-tight">
                     <WarningCircle className="h-4 w-4 mr-1" strokeWidth={2} />
                     Course schedules overlap with eachother
                  </div>
               )}
            </div>
         </div>
         <button
            onClick={removeCourse}
            className="bg-red-500 p-2.5 rounded-xl text-white"
         >
            <Xmark className="h-5 w-5" strokeWidth={2} />
         </button>
      </div>
   );
};

export default CourseAdded;
