import Link from 'next/link';

import { formatting } from '@/lib/helpers';
import { getImageURL } from '@/lib/image';
import {
   TStudentTableCourseData,
   TVisualizationTableRootSchema,
} from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';

export const StudentCatalogCoursesTableSchema: TVisualizationTableRootSchema<TStudentTableCourseData> =
   {
      __root: {
         render: (children, values) => {
            return (
               <Link
                  href={`/student/catalog/course/${values.courseId}`}
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
      courseName: {
         render: (value, values) => {
            return <span className="text-blue-500">{value}</span>;
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
