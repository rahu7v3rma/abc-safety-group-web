'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { BundleData } from '@/data/admin/users';
import useFilter from '@/hooks/useFilter';
import {
   APIResponsePagination,
   TStudentTableBundleData,
   TUserData,
   TVisualizationTableRootSchema,
   TWithPagination,
} from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import NextLink from 'next/link';
import { FC, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

const schema: TVisualizationTableRootSchema<TStudentTableBundleData> = {
   __root: {
      render: (children, values) => {
         return (
            <NextLink
               href={`/admin/courses/bundle/${values.bundleId}`}
               className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
            >
               {children}
            </NextLink>
         );
      },
   },
   bundleId: {
      hidden: true,
   },
   bundlePicture: {
      hidden: true,
   },
   bundleName: {
      render: (value) => {
         return <span className="text-black">{value}</span>;
      },
   },
};

interface UserDataBundlesProps {
   user: TUserData;
   bundles: TWithPagination<BundleData>;
   page: number;
   tables?: string[];
   error?: false | string;
}

const UserDataBundles: FC<UserDataBundlesProps> = ({
   user,
   bundles,
   page,
   tables,
   error,
}) => {
   const bundlesData = useHookstate<TStudentTableBundleData[]>(bundles.bundles);
   const bundlesPagination = useHookstate<APIResponsePagination | false>(
      bundles.pagination ?? false
   );

   const filters = useHookstate<string[]>([]);
   const [filteredData, filter, filteredPagination] = useFilter<
      TStudentTableBundleData[]
   >(`users/bundles/${user.userId}`, 'bundles', filters, page);
   const filterCompleted = useCallback(
      (complete: boolean) => {
         toast.promise(filter({ complete }), {
            loading: 'Filtering...',
            success: 'Filtered!',
            error: (e) => e.message,
         });
      },
      [filter]
   );

   const tableData = useMemo(
      () => (filteredData.value ? filteredData : bundlesData),
      [filteredData, bundlesData]
   );

   const tablePagination = useMemo(
      () => (filteredPagination.value ? filteredPagination : bundlesPagination),
      [filteredPagination, bundlesPagination]
   );

   return (
      <VisualizationTable
         name="Bundles"
         data={tableData}
         pagination={tablePagination}
         schema={schema}
         error={error}
         tables={tables}
         currentTable="Bundles"
         maxHeight="min-h-[20rem] max-h-[60rem]"
         buttons={['filter']}
         filters={filters}
         filter={{
            completed: filterCompleted,
         }}
         autoHeight
      />
   );
};

export default UserDataBundles;
