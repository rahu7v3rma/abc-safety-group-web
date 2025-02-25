'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import useFilter from '@/hooks/useFilter';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { APIResponsePagination, TInstructorTableCourseData } from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { FC, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import schema from './Schema';

interface InstructorCoursesTableProps {
   data: TInstructorTableCourseData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const InstructorCoursesTable: FC<InstructorCoursesTableProps> = ({
   data,
   pagination,
   error,
   page,
}) => {
   const courses = useUpdateHookstate<TInstructorTableCourseData[]>(data);
   const coursesPagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );

   const filters = useHookstate<string[]>([]);
   const [filteredData, filter, filteredPagination] = useFilter<
      TInstructorTableCourseData[]
   >('users/my-courses', 'courses', filters, page);

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
      () => (filteredData.value ? filteredData : courses),
      [filteredData, courses]
   );

   const tablePagination = useMemo(
      () => (filteredPagination.value ? filteredPagination : coursesPagination),
      [filteredPagination, coursesPagination]
   );

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

export default InstructorCoursesTable;
