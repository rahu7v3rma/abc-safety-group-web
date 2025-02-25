'use client';

import { FC, useMemo } from 'react';

import VisualizationTable from '@/components/ui/VisualizationTable';
import useSearch from '@/hooks/VisualizationTable/useSearch';
import { StudentCatalogCoursesTableSchema } from './CoursesSchema';

import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import {
   APIResponsePagination,
   TStudentTableCourseData,
   TVisualizationTableSearch,
} from '@/lib/types';

interface StudentCatalogCoursesTableProps {
   data: TStudentTableCourseData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const StudentCatalogCoursesTable: FC<StudentCatalogCoursesTableProps> = ({
   data,
   pagination,
   error,
   page,
}) => {
   const courses = useUpdateHookstate<TStudentTableCourseData[]>(data);
   const coursesPagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );

   const [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] = useSearch<
      TStudentTableCourseData,
      { courseName: string },
      {
         courses: TStudentTableCourseData[];
         pagination: APIResponsePagination;
      }
   >('courses', ['search', 'catalog'], page, (payload) => {
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

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else {
         return courses;
      }
   }, [search, courses]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else {
         return coursesPagination;
      }
   }, [searchPagination, coursesPagination]);

   return (
      <VisualizationTable
         name="Courses"
         search={true}
         data={tableData}
         pagination={tablePagination}
         schema={StudentCatalogCoursesTableSchema}
         error={error}
         empty={searchEmpty.value}
         tables={['Courses', 'Bundles']}
         currentTable="Courses"
         functions={{
            search: CoursesSearch,
         }}
         loading={{
            search: !!searchLoading,
         }}
         reset={reset}
      />
   );
};

export default StudentCatalogCoursesTable;
