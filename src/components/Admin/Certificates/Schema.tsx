'use client';

import DefaultUserSchema from '@/components/DefaultSchemas/UserSchema';
import ViewCertificateDialog from '@/components/PreviewCertificate/Dialog';
import { formatting } from '@/lib/helpers';
import {
   TVisualizationTableRootSchema,
   TAdminTableCertficateData,
} from '@/lib/types';
import { format } from 'date-fns';

export const AdminCertificatesTableSchema: TVisualizationTableRootSchema<TAdminTableCertficateData> =
   {
      __root: {
         render: (children, values) => {
            return (
               <ViewCertificateDialog {...values}>
                  {children}
               </ViewCertificateDialog>
            );
         },
      },
      completionDate: {
         render: (value, values) => {
            return (
               <span className="text-sm text-zinc-500">
                  {format(new Date(value), formatting)}
               </span>
            );
         },
      },
      expirationDate: {
         render: (value, values) => {
            if (!value)
               return (
                  <span className="text-sm text-zinc-500 italic">Never</span>
               );
            return (
               <span className="text-sm text-zinc-500">
                  {format(new Date(value), formatting)}
               </span>
            );
         },
      },
      ...DefaultUserSchema,
   };
