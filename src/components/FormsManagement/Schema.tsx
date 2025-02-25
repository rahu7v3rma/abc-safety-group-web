'use client';

import Link from 'next/link';

import {
   TAdminTableFormData,
   TVisualizationTableRootSchema,
} from '@/lib/types';

export const AdminFormsTableSchema: TVisualizationTableRootSchema<TAdminTableFormData> =
   {
      __root: {
         render: (children, values) => {
            return (
               <Link
                  href={'/admin/forms/' + values.formType + '/' + values.formId}
                  className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
               >
                  {children}
               </Link>
            );
         },
      },
      formId: {
         hidden: true,
      },
   };
