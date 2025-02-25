'use client';

import { FC } from 'react';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { InstructorScheduleTableSchema } from './Schema';

import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import {
   APIResponsePagination,
   TInstructorTableScheduleData,
} from '@/lib/types';

interface InstructorClassScheduleTableProps {
   data: TInstructorTableScheduleData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const InstructorClassScheduleTable: FC<InstructorClassScheduleTableProps> = ({
   data,
   pagination,
   error,
   page,
}) => {
   const schedule = useUpdateHookstate<TInstructorTableScheduleData[]>(data);
   const schedulePagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );

   return (
      <VisualizationTable
         name="My schedule"
         data={schedule}
         pagination={schedulePagination}
         schema={InstructorScheduleTableSchema}
         error={error}
      />
   );
};

export default InstructorClassScheduleTable;
