'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { FC, useMemo } from 'react';

import useSearch from '@/hooks/VisualizationTable/useSearch';
import useFilter from '@/hooks/useFilter';
import useSelectable from '@/hooks/useSelectable';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { formatting } from '@/lib/helpers';
import { getImageURL } from '@/lib/image';
import {
   APIResponsePagination,
   TAdminTableCourseData,
   TVisualizationTableRootSchema,
   TVisualizationTableSearch,
} from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import DeleteCourses from './Buttons/DeleteCourses';

interface AdminCourseManagementProps {
   page: number;
   data: TAdminTableCourseData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
}

const AdminCourseManagementCoursesTable: FC<AdminCourseManagementProps> = ({
   page,
   data,
   pagination,
   error = false,
}) => {
   const courses = useUpdateHookstate<TAdminTableCourseData[]>(data);
   const coursesPagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );
   const filters = useHookstate<string[]>([]);
   const [filteredData, filter, filteredPagination] = useFilter<
      TAdminTableCourseData[]
   >('courses/list', 'courses', filters, page);

   const selectable = useSelectable(courses);

   const schema: TVisualizationTableRootSchema<TAdminTableCourseData> = {
      __root: {
         render: (children, values) => {
            return (
               <Link
                  href={`/admin/courses/${values.courseType.toLowerCase()}/${
                     values.courseId
                  }`}
                  className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
               >
                  {children}
               </Link>
            );
         },
      },
      courseId: {
         hidden: true,
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
      briefDescription: {
         render: (value) => {
            if (!value) return <span className="font-medium italic">None</span>;
            return <span className="font-medium text-zinc-500">{value}</span>;
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

   const [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] = useSearch<
      TAdminTableCourseData,
      { courseName: string },
      {
         courses: TAdminTableCourseData[];
         pagination: APIResponsePagination;
      }
   >('courses', 'search', page, (payload) => {
      const [_, { removeSelectAll }] = selectable;
      removeSelectAll();
      searchEmpty.set(false);
      if (!payload.courses.length) {
         searchEmpty.set('No courses found matching your search query');
      } else {
         search.set(payload.courses);
      }
   });

   const CoursesSearch: TVisualizationTableSearch = (value) => {
      searchPost({
         courseName: value,
      });
   };

   function FilterCompleted(active: boolean) {
      if (active) {
         toast.promise(
            filter({
               complete: true,
            }),
            {
               loading: 'Filtering...',
               success: 'Filtered!',
               error: (e) => {
                  return e.message;
               },
            }
         );
      } else {
         filter({
            complete: false,
         });
      }
   }

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else if (filteredData.value) {
         return filteredData;
      } else {
         return courses;
      }
   }, [search, filteredData, courses]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else if (filteredPagination.value) {
         return filteredPagination;
      } else {
         return coursesPagination;
      }
   }, [searchPagination, filteredPagination, coursesPagination]);

   return (
      <VisualizationTable
         name={'Courses'}
         search={true}
         data={tableData}
         pagination={tablePagination}
         schema={schema}
         tables={['All', 'Courses', 'Bundles']}
         currentTable={'Courses'}
         empty={searchEmpty.value}
         error={error}
         selectable={selectable}
         filters={filters}
         buttons={[
            <DeleteCourses
               key="deleteCourses"
               courses={courses}
               selectable={selectable}
            />,
            'filter',
         ]}
         filter={{
            completed: FilterCompleted,
         }}
         loading={{
            search: searchLoading,
         }}
         disabled={{
            filter: !!search.length || !!searchEmpty.value,
         }}
         functions={{
            search: CoursesSearch,
         }}
         reset={reset}
      />
   );
};

export default AdminCourseManagementCoursesTable;
