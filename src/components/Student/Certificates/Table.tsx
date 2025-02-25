'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';

import ViewCertificateDialog from '@/components/PreviewCertificate/Dialog';
import { useUser } from '@/contexts/user';
import useFilter from '@/hooks/useFilter';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { formatting } from '@/lib/helpers';
import {
   APIResponsePagination,
   TStudentTableCertificateData,
   TUserContextForce,
   TVisualizationTableRootSchema,
} from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { format } from 'date-fns';
import { FC, useMemo } from 'react';
import { toast } from 'sonner';

interface StudentCertificatesTableProps {
   data: TStudentTableCertificateData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const StudentCertificatesTable: FC<StudentCertificatesTableProps> = ({
   data,
   pagination,
   error,
   page,
}) => {
   const { user } = useUser<TUserContextForce>();

   const certificates =
      useUpdateHookstate<TStudentTableCertificateData[]>(data);
   const certificatesPagination = useUpdateHookstate<
      APIResponsePagination | false
   >(pagination);

   const filters = useHookstate<string[]>([]);
   const [filteredData, filter, filteredPagination] = useFilter<
      TStudentTableCertificateData[]
   >('users/my-certificates', 'certificates', filters, page);

   const schema: TVisualizationTableRootSchema<TStudentTableCertificateData> = {
      __root: {
         render: (children, values) => {
            return (
               <ViewCertificateDialog
                  firstName={user.firstName}
                  lastName={user.lastName}
                  {...values}
               >
                  {children}
               </ViewCertificateDialog>
            );
         },
      },
      userId: {
         hidden: true,
      },
      student: {
         hidden: true,
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
   };

   function FilterNewest(active: boolean) {
      if (active) {
         toast.promise(
            filter({
               newest: true,
            }),
            {
               loading: 'Filtering...',
               success: 'Filtered!',
               error: (e) => {
                  return e.message;
               },
            }
         );
      } else {
         filter({
            newest: false,
         });
      }
   }

   const tableData = useMemo(() => {
      if (filteredData.value) {
         return filteredData;
      } else {
         return certificates;
      }
   }, [filteredData, certificates]);

   const tablePagination = useMemo(() => {
      if (filteredPagination.value) {
         return filteredPagination;
      } else {
         return certificatesPagination;
      }
   }, [filteredPagination, certificatesPagination]);

   return (
      <VisualizationTable
         name="My certificates"
         data={tableData}
         pagination={tablePagination}
         schema={schema}
         error={error}
         filters={filters}
         filter={{
            newest: FilterNewest,
         }}
         buttons={['filter']}
      />
   );
};

export default StudentCertificatesTable;
