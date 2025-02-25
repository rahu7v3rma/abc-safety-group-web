'use client';

import { FC, useMemo } from 'react';

import VisualizationTable from '@/components/ui/VisualizationTable';
import useSearch from '@/hooks/VisualizationTable/useSearch';
import { StudentCatalogBundlesTableSchema } from './BundlesSchema';

import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import {
   APIResponsePagination,
   TStudentTableBundleData,
   TVisualizationTableSearch,
} from '@/lib/types';

interface StudentCatalogBundlesTableProps {
   data: TStudentTableBundleData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const StudentCatalogBundlesTable: FC<StudentCatalogBundlesTableProps> = ({
   data,
   pagination,
   error,
   page,
}) => {
   const bundles = useUpdateHookstate<TStudentTableBundleData[]>(data);
   const bundlesPagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );

   const [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] = useSearch<
      TStudentTableBundleData,
      { bundleName: string },
      {
         bundles: TStudentTableBundleData[];
         pagination: APIResponsePagination;
      }
   >('courses', ['search', 'catalog'], page, (payload) => {
      searchEmpty.set(false);
      if (!payload.bundles.length) {
         searchEmpty.set('No bundles found matching your search query');
      } else {
         search.set(payload.bundles);
      }
   });

   const BundlesSearch: TVisualizationTableSearch = (value) => {
      searchPost({
         bundleName: value,
      });
   };

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else {
         return bundles;
      }
   }, [search, bundles]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else {
         return bundlesPagination;
      }
   }, [searchPagination, bundlesPagination]);

   return (
      <VisualizationTable
         name="Bundles"
         search={true}
         data={tableData}
         pagination={tablePagination}
         schema={StudentCatalogBundlesTableSchema}
         error={error}
         empty={searchEmpty.value}
         tables={['Courses', 'Bundles']}
         currentTable="Bundles"
         functions={{
            search: BundlesSearch,
         }}
         loading={{
            search: !!searchLoading,
         }}
         reset={reset}
      />
   );
};

export default StudentCatalogBundlesTable;
