import { format, intervalToDuration } from 'date-fns';
import Link from 'next/link';

import { filterZeroProperties, formatting } from '@/lib/helpers';

import Join from '@/components/ui/VisualizationTable/Buttons/Join';
import {
   TStudentTableScheduleData,
   TVisualizationTableRootSchema,
} from '@/lib/types';
import clsx from 'clsx';

export const StudentScheduleTableSchema: TVisualizationTableRootSchema<TStudentTableScheduleData> =
   {
      __root: {
         columnsOrder: [
            'courseName',
            'startTime',
            'endTime',
            'duration',
            'inProgress',
            'complete',
            'address',
            'remoteLink',
         ],
         render: (children, values) => {
            return (
               <Link
                  href={`/student/my-courses/course/${values.courseId}/schedule/${values.seriesNumber}`}
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
      seriesNumber: {
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
