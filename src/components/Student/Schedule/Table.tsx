'use client';

import { FC } from 'react';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { StudentScheduleTableSchema } from './Schema';

import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { APIResponsePagination, TStudentTableScheduleData } from '@/lib/types';
import { Federant } from 'next/font/google';

interface StudentClassScheduleTableProps {
   data: TStudentTableScheduleData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const StudentClassScheduleTable: FC<StudentClassScheduleTableProps> = ({
   data,
   pagination,
   error,
   page,
}) => {
   const schedule = useUpdateHookstate<TStudentTableScheduleData[]>(data);
   const schedulePagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination,
   );

   return (
      <VisualizationTable
         name="Class schedule"
         data={schedule}
         pagination={schedulePagination}
         schema={StudentScheduleTableSchema}
         error={error}
      />
   );
};

export default StudentClassScheduleTable;
