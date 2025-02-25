'use client';

import { State } from '@hookstate/core';
import { FC, useCallback } from 'react';
import { toast } from 'sonner';

import DropdownListPaginated, {
   DropdownPaginatedFetchReturn,
} from '@/components/ui/DropdownListPaginated';
import { getCoursesList } from '@/data/admin/courses';
import { searchFetchCourses } from '@/data/pagination/courses';
import usePost from '@/hooks/usePost';
import { BundleCreationCoursesData } from './Creation';

import { TAdminTableCourseData } from '@/lib/types';

interface SelectCourseProps {
   bundleCourses: State<BundleCreationCoursesData[], {}>;
   coursesError: State<false | { courses: TAdminTableCourseData[] }, {}>;
}

const SelectCourse: FC<SelectCourseProps> = ({
   bundleCourses,
   coursesError,
}) => {
   const fetchCourses = useCallback(
      async (
         page: number
      ): Promise<DropdownPaginatedFetchReturn<TAdminTableCourseData>> => {
         const data = await getCoursesList(
            {
               ignoreBundle: true,
               inactive: true,
               complete: false,
            },
            page
         );

         if (data.success) {
            return {
               options: data.payload.courses.map((course) => ({
                  text: course.courseName,
                  value: course.courseId,
                  subtext: course.startDate,
               })),
               pagination: data.payload.pagination,
               data: data.payload.courses,
            };
         }

         return {
            options: false,
            pagination: false,
            data: false,
         };
      },
      []
   );

   const [verifySchedule, verifyLoading, error] = usePost<
      { courseIds: string[] },
      any
   >('courses', ['schedule', 'verify']);

   async function validateSchedule(course: BundleCreationCoursesData) {
      const verify: any = await verifySchedule({
         courseIds: [
            ...bundleCourses.get().map((c) => c.courseId!),
            course.courseId,
         ],
      });
      if (verify.success) {
         coursesError.set(false);
      } else if (!verify.success) {
         if (!verify.payload || !verify.payload.courses) {
            throw new Error('Failed verifying schedules');
         } else {
            coursesError.set({
               courses: verify.payload.courses,
            });
         }
      }
      bundleCourses.set((prevCourses) => [course, ...prevCourses]);
   }

   return (
      <DropdownListPaginated
         label="Courses"
         onChange={async (newCourses: any) => {
            const course = {
               courseId: newCourses[0].value,
               courseName: newCourses[0].text,
               startDate: newCourses[0].subtext,
            };

            const find = bundleCourses
               .get()
               .find((c) => c.courseId === course.courseId);

            if (!find) {
               toast.promise(validateSchedule(course), {
                  loading: 'Verifying schedules',
                  success: 'Schedules verified',
                  error: (e) => {
                     return e.message;
                  },
               });
            }
         }}
         fetch={fetchCourses}
         searchFetch={searchFetchCourses}
         dropdownTriggerClassname="flex-grow"
         placeholder="Select course..."
      />
   );
};

export default SelectCourse;
