'use client';

import Link from 'next/link';

import {
   TAdminCourseDetailsManageStudentTable,
   TVisualizationTableRootSchema,
} from '@/lib/types';
import DefaultUserSchema from '@/components/DefaultSchemas/UserSchema';

export const CourseManageStudentsTableSchema: TVisualizationTableRootSchema<TAdminCourseDetailsManageStudentTable> =
   {
      __root: {
         columnsOrder: [
            'headShot',
            'firstName',
            'lastName',
            'phoneNumber',
            'registrationStatus',
            'paid',
            'usingCash',
            'signInSheet',
            'quizzes',
            'surveys',
            'certificate',
            'transaction',
            'notes',
         ],
         render: (children, values) => {
            return (
               <Link
                  href={'/admin/users/' + values.userId}
                  className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
               >
                  {children}
               </Link>
            );
         },
      },
      transaction: {
         inline: 125,
         render: (value, values) => {
            if (value) {
               return 'asd';
            }
         },
      },
      dob: {
         hidden: true,
      },
      email: {
         hidden: true,
      },
      ...DefaultUserSchema,
   };
