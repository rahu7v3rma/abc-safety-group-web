'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { CourseData } from '@/data/admin/users';
import useFilter from '@/hooks/useFilter';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { formatting } from '@/lib/helpers';
import { getImageURL } from '@/lib/image';
import {
   APIResponsePagination,
   TStudentTableCourseData,
   TUserData,
   TVisualizationTableRootSchema,
   TWithPagination,
} from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { format } from 'date-fns';
import Image from 'next/image';
import NextLink from 'next/link';
import { FC, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

const schema: TVisualizationTableRootSchema<TStudentTableCourseData> = {
   __root: {
      render: (children, values) => {
         return (
            <NextLink
               href={`/admin/courses/course/${values.courseId}`}
               className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
            >
               {children}
            </NextLink>
         );
      },
   },
   courseId: {
      hidden: true,
   },
   courseName: {
      render: (value, values) => {
         return <span className="text-black">{value}</span>;
      },
   },
   coursePicture: {
      inline: 150,
      allowNull: true,
      render: (value, values) => {
         return (
            <Image
               alt={values.courseName + "'s picture"}
               src={getImageURL('courses', value, 300)}
               placeholder="blur"
               blurDataURL={`/_next/image?url=${getImageURL(
                  'courses',
                  value,
                  16
               )}&w=16&q=1`}
               width={300}
               height={300}
               className="w-14 h-14 animate-fadeIn object-cover mx-auto rounded-lg"
            />
         );
      },
   },
   startDate: {
      render: (value) => {
         return (
            <span className="text-sm text-zinc-500">
               {format(new Date(value), formatting)}
            </span>
         );
      },
   },
};

interface UserDataCoursesProps {
   user: TUserData;
   courses: TWithPagination<CourseData>;
   page: number;
   tables?: string[];
   error?: false | string;
}

const UserDataCourses: FC<UserDataCoursesProps> = ({
   user,
   courses,
   page,
   tables,
   error,
}) => {
   const coursesData = useUpdateHookstate<TStudentTableCourseData[]>(
      courses.courses
   );
   const coursesPagination = useUpdateHookstate<APIResponsePagination | false>(
      courses.pagination ?? false
   );

   const filters = useHookstate<string[]>([]);
   const [filteredData, filter, filteredPagination] = useFilter<
      TStudentTableCourseData[]
   >(`users/courses/${user.userId}`, 'courses', filters, page);

   const FilterCompleted = useCallback(
      (complete: boolean) => {
         toast.promise(filter({ complete }), {
            loading: 'Filtering...',
            success: 'Filtered!',
            error: (e) => e.message,
         });
      },
      [filter]
   );

   const tableData = useMemo(
      () => (filteredData.value ? filteredData : coursesData),
      [filteredData, coursesData]
   );

   const tablePagination = useMemo(
      () => (filteredPagination.value ? filteredPagination : coursesPagination),
      [filteredPagination, coursesPagination]
   );

   return (
      <VisualizationTable
         name="Courses"
         data={tableData}
         pagination={tablePagination}
         schema={schema}
         error={error}
         tables={tables}
         currentTable="Courses"
         maxHeight="h-auto min-h-[20rem] max-h-[60rem]"
         buttons={['filter']}
         filters={filters}
         filter={{
            completed: FilterCompleted,
         }}
      />
   );
};

export default UserDataCourses;
