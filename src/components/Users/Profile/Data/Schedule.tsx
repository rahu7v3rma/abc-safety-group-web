'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import Join from '@/components/ui/VisualizationTable/Buttons/Join';
import { ScheduleData } from '@/data/admin/users';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { filterZeroProperties, formatting } from '@/lib/helpers';
import {
   APIResponsePagination,
   TStudentTableScheduleData,
   TVisualizationTableRootSchema,
   TWithPagination,
} from '@/lib/types';
import clsx from 'clsx';
import { format, intervalToDuration } from 'date-fns';
import Link from 'next/link';
import { FC } from 'react';

const schema: TVisualizationTableRootSchema<TStudentTableScheduleData> = {
   __root: {
      render: (children, values) => {
         return (
            <Link
               href={`/admin/courses/course/${values.courseId}/schedule/${values.seriesNumber}`}
               className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
            >
               {children}
            </Link>
         );
      },
      customActions: [
         (values) => {
            if (
               values.inProgress &&
               values.remoteLink &&
               values.remoteLink.trim().length
            ) {
               return <Join href={values.remoteLink} />;
            }
            return null;
         },
      ],
   },
   courseId: {
      hidden: true,
   },
   courseName: {
      render: (value, values) => {
         return (
            <span
               className={clsx(
                  values.inProgress ? 'text-blue-500' : 'text-black'
               )}
            >
               {value}
            </span>
         );
      },
   },
   duration: {
      render: (value) => {
         const duration = intervalToDuration({
            start: 0,
            end: value * 60 * 1000,
         });
         const formatted = Object.entries(filterZeroProperties(duration))
            .map(([key, value]) => `${value}${key[0]}`)
            .join(' ');
         return <span>{formatted}</span>;
      },
   },
   startTime: {
      render: (value) => {
         return (
            <span className="text-sm text-zinc-500">
               {format(new Date(value), formatting)}
            </span>
         );
      },
   },
   endTime: {
      render: (value) => {
         return (
            <span className="text-sm text-zinc-500">
               {format(new Date(value), formatting)}
            </span>
         );
      },
   },
};

interface UserDataScheduleProps {
   schedule: TWithPagination<ScheduleData>;
   page: number;
   tables?: string[];
   error?: false | string;
}

const UserDataSchedule: FC<UserDataScheduleProps> = ({
   schedule,
   page,
   tables,
   error,
}) => {
   const scheduleData = useUpdateHookstate<TStudentTableScheduleData[]>(
      schedule.schedule
   );
   const schedulePagination = useUpdateHookstate<APIResponsePagination | false>(
      schedule.pagination ?? false
   );

   return (
      <VisualizationTable
         name="Schedule"
         data={scheduleData}
         pagination={schedulePagination}
         schema={schema}
         error={error}
         tables={tables}
         currentTable="Schedule"
         maxHeight="h-auto min-h-[20rem] max-h-[60rem]"
      />
   );
};

export default UserDataSchedule;
