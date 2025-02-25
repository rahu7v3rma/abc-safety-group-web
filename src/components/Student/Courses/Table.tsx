'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';

import useFilter from '@/hooks/useFilter';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { APIResponsePagination, TStudentTableCourseData } from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { FC, useMemo } from 'react';
import { toast } from 'sonner';
import schema from './Schema';

interface StudentCoursesTableProps {
   data: TStudentTableCourseData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const StudentCoursesTable: FC<StudentCoursesTableProps> = ({
   data,
   pagination,
   error,
   page,
}) => {
   const courses = useUpdateHookstate<TStudentTableCourseData[]>(data);
   const coursesPagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );

   const filters = useHookstate<string[]>([]);
   const [filteredData, filter, filteredPagination] = useFilter<
      TStudentTableCourseData[]
   >('users/my-courses', 'courses', filters, page);

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
      if (filteredData.value) {
         return filteredData;
      } else {
         return courses;
      }
   }, [filteredData, courses]);

   const tablePagination = useMemo(() => {
      if (filteredPagination.value) {
         return filteredPagination;
      } else {
         return coursesPagination;
      }
   }, [filteredPagination, coursesPagination]);

   return (
      <VisualizationTable
         name="My courses"
         data={tableData}
         pagination={tablePagination}
         filters={filters}
         filter={{
            completed: FilterCompleted,
         }}
         buttons={['filter']}
         schema={schema}
         error={error}
      />
   );
};

export default StudentCoursesTable;
