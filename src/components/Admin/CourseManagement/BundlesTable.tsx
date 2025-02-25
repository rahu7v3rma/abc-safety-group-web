'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { FC, useMemo } from 'react';

import useSearch from '@/hooks/VisualizationTable/useSearch';
import useFilter from '@/hooks/useFilter';
import useSelectable from '@/hooks/useSelectable';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { formatting } from '@/lib/helpers';
import {
   APIResponsePagination,
   TAdminTableBundleData,
   TVisualizationTableRootSchema,
   TVisualizationTableSearch,
} from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';
import DeleteBundles from './Buttons/DeleteBundles';

interface AdminCourseManagementBundlesProps {
   data: TAdminTableBundleData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const AdminCourseManagementBundlesTable: FC<
   AdminCourseManagementBundlesProps
> = ({ data, pagination, error = false, page }) => {
   const bundles = useUpdateHookstate<TAdminTableBundleData[]>(data);
   const bundlesPagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );
   const filters = useHookstate<string[]>([]);
   const [filteredData, filter, filteredPagination] = useFilter<
      TAdminTableBundleData[]
   >('courses/bundle/list', 'bundles', filters, page);

   const selectable = useSelectable(bundles);

   const schema: TVisualizationTableRootSchema<TAdminTableBundleData> = {
      __root: {
         render: (children, values) => {
            return (
               <Link
                  href={`/admin/courses/${values.courseType.toLowerCase()}/${
                     values.bundleId
                  }`}
                  className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
               >
                  {children}
               </Link>
            );
         },
      },
      bundleId: {
         hidden: true,
      },
      bundlePicture: {
         hidden: true,
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

   const [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] = useSearch<
      TAdminTableBundleData,
      { courseBundle: string },
      {
         bundles: TAdminTableBundleData[];
         pagination: APIResponsePagination;
      }
   >('courses', 'search', page, (payload) => {
      const [_, { removeSelectAll }] = selectable;
      removeSelectAll();
      searchEmpty.set(false);
      if (!payload.bundles.length) {
         searchEmpty.set('No bundles found matching your search query');
      } else {
         search.set(payload.bundles);
      }
   });

   const BundlesSearch: TVisualizationTableSearch = (value) => {
      searchPost({
         courseBundle: value,
      });
   };

   function FilterCompleted(active: boolean) {
      if (active) {
         toast.promise(
            filter({
               complete: true,
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
            complete: false,
         });
      }
   }

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else if (filteredData.value) {
         return filteredData;
      } else {
         return bundles;
      }
   }, [search, filteredData, bundles]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else if (filteredPagination.value) {
         return filteredPagination;
      } else {
         return bundlesPagination;
      }
   }, [searchPagination, filteredPagination, bundlesPagination]);

   return (
      <VisualizationTable
         name="Bundles"
         data={tableData}
         pagination={tablePagination}
         schema={schema}
         selectable={selectable}
         tables={['All', 'Courses', 'Bundles']}
         currentTable={'Bundles'}
         empty={searchEmpty.value}
         error={error}
         filters={filters}
         search={true}
         buttons={[
            <DeleteBundles
               key="deleteBundles"
               bundles={bundles}
               selectable={selectable}
            />,
            'filter',
         ]}
         filter={{
            completed: FilterCompleted,
         }}
         loading={{
            search: searchLoading,
         }}
         disabled={{
            filter: !!search.length || !!searchEmpty.value,
         }}
         functions={{
            search: BundlesSearch,
         }}
         reset={reset}
      />
   );
};

export default AdminCourseManagementBundlesTable;
