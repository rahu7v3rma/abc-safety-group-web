'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { useHookstate } from '@hookstate/core';
import { FC, useMemo } from 'react';
import { toast } from 'sonner';

import { AdminCertificatesTableSchema } from './Schema';

import useSearch from '@/hooks/VisualizationTable/useSearch';
import useFilter from '@/hooks/useFilter';
import useSelectable from '@/hooks/useSelectable';
import DeleteButton from './Buttons/Delete';
import GenerateButton from './Buttons/Generate';

import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import {
   APIResponsePagination,
   TAdminTableCertficateData,
   TVisualizationTableSearch,
} from '@/lib/types';

interface AdminCertificatesTableProps {
   data: TAdminTableCertficateData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const AdminCertificatesTable: FC<AdminCertificatesTableProps> = ({
   data,
   pagination,
   error,
   page,
}) => {
   const certificates = useUpdateHookstate<TAdminTableCertficateData[]>(data);
   const certificatesPagination = useUpdateHookstate<
      APIResponsePagination | false
   >(pagination);
   const filters = useHookstate<string[]>([]);
   const [filteredData, filter, filteredPagination] = useFilter<
      TAdminTableCertficateData[]
   >('users/certificates/list', 'certificates', filters, page);

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

   const selectable = useSelectable(certificates);

   const [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] = useSearch<
      TAdminTableCertficateData,
      | { firstName: string; lastName: string }
      | { phoneNumber: string }
      | { email: string }
      | { certificateNumber: string },
      {
         certificates: TAdminTableCertficateData[];
         pagination: APIResponsePagination;
      }
   >('users', ['certificates', 'search'], page, (payload) => {
      searchEmpty.set(false);
      if (!payload.certificates.length) {
         searchEmpty.set('No certificates found matching your search query');
      } else {
         search.set(payload.certificates);
      }
   });

   const searchOptions = [
      'First, Last',
      'Last, First',
      'Phone number',
      'Email',
      'Certificate number',
   ] as const;

   const CertificatesSearch: TVisualizationTableSearch<
      (typeof searchOptions)[number]
   > = (value, option) => {
      if (option === 'First, Last') {
         const valueSplit = value.split(/,? /gi);
         searchPost({
            firstName: valueSplit[0],
            lastName: valueSplit[1],
         });
      } else if (option === 'Last, First') {
         const valueSplit = value.split(/,? /gi);
         searchPost({
            firstName: valueSplit[1],
            lastName: valueSplit[0],
         });
      } else if (option === 'Phone number') {
         searchPost({
            phoneNumber: value,
         });
      } else if (option === 'Email') {
         searchPost({
            email: value,
         });
      } else if (option === 'Certificate number') {
         searchPost({
            certificateNumber: value,
         });
      }
   };

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else if (filteredData.value) {
         return filteredData;
      } else {
         return certificates;
      }
   }, [search, filteredData, certificates]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else if (filteredPagination.value) {
         return filteredPagination;
      } else {
         return certificatesPagination;
      }
   }, [searchPagination, filteredPagination, certificatesPagination]);

   return (
      <VisualizationTable
         name={'Certificates'}
         data={tableData}
         pagination={tablePagination}
         schema={AdminCertificatesTableSchema}
         error={error}
         search={true}
         searchOptions={searchOptions}
         empty={searchEmpty.value}
         filters={filters}
         filter={{
            newest: FilterNewest,
         }}
         buttons={[
            <DeleteButton
               key="deleteButton"
               certificates={certificates}
               selectable={selectable}
            />,
            <GenerateButton key="generateButton" />,
            'filter',
         ]}
         selectable={selectable}
         functions={{
            search: CertificatesSearch,
         }}
         loading={{
            search: !!searchLoading,
         }}
         disabled={{
            filter: !!search.length || !!searchEmpty.value,
         }}
         reset={reset}
      />
   );
};

export default AdminCertificatesTable;
