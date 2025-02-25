import { format, intervalToDuration } from 'date-fns';
import Link from 'next/link';

import { filterZeroProperties, formatting } from '@/lib/helpers';

import {
   TAdminTableClassScheduleData,
   TVisualizationTableRootSchema,
} from '@/lib/types';

export const AdminScheduleTableSchema: TVisualizationTableRootSchema<TAdminTableClassScheduleData> =
   {
      __root: {
         columnsOrder: [
            'courseName',
            'startTime',
            'duration',
            'inProgress',
            'complete',
            'address',
            'remoteLink',
            'instructors',
            'languages',
         ],
         render: (children, values) => {
            return (
               <Link
                  href={`/admin/courses/course/${values.courseId}/schedule/${values.seriesNumber}`}
                  className=" hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
               >
                  {children}
               </Link>
            );
         },
      },
      courseId: {
         hidden: true,
      },
      seriesNumber: {
         hidden: true,
      },
      courseName: {
         render: (value, values) => {
            return <span className="text-black">{value}</span>;
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
         render: (value, values) => {
            return (
               <span className="text-sm text-zinc-500">
                  {format(new Date(value), formatting)}
               </span>
            );
         },
      },
      endTime: {
         render: (value, values) => {
            return (
               <span className="text-sm text-zinc-500">
                  {format(new Date(value), formatting)}
               </span>
            );
         },
      },
   };
