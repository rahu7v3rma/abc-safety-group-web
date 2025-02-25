'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { FC, useMemo } from 'react';

import useSearch from '@/hooks/VisualizationTable/useSearch';
import useFilter from '@/hooks/useFilter';
import useSelectable from '@/hooks/useSelectable';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { formatting } from '@/lib/helpers';
import { getImageURL } from '@/lib/image';
import {
   APIResponsePagination,
   TAdminTableCourseAndBundleData,
   TVisualizationTableRootSchema,
   TVisualizationTableSearch,
} from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface AdminCourseManagementProps {
   page: number;
   data: TAdminTableCourseAndBundleData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
}

const AdminCourseManagementAllTable: FC<AdminCourseManagementProps> = ({
   page,
   data,
   pagination,
   error = false,
}) => {
   const coursesAndBundles =
      useUpdateHookstate<TAdminTableCourseAndBundleData[]>(data);
   const coursesAndBundlesPagination = useUpdateHookstate<
      APIResponsePagination | false
   >(pagination);
   const filters = useHookstate<string[]>([]);
   const [filteredData, filter, filteredPagination] = useFilter<
      TAdminTableCourseAndBundleData[]
   >('courses/list/all', 'found', filters, page);

   const selectable = useSelectable(coursesAndBundles);

   const schema: TVisualizationTableRootSchema<TAdminTableCourseAndBundleData> =
      {
         __root: {
            render: (children, values) => {
               return (
                  <Link
                     href={`/admin/courses/${values.type.toLowerCase()}/${
                        values.id
                     }`}
                     className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
                  >
                     {children}
                  </Link>
               );
            },
         },
         id: {
            hidden: true,
         },
         picture: {
            inline: 125,
            allowNull: true,
            render: (value, values) => {
               return (
                  <Image
                     alt={values.name + "'s picture"}
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
               if (!value)
                  return <span className="font-medium italic">None</span>;
               return (
                  <span className="font-medium text-zinc-500">{value}</span>
               );
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
      TAdminTableCourseAndBundleData,
      { name: string },
      {
         found: TAdminTableCourseAndBundleData[];
         pagination: APIResponsePagination;
      }
   >('courses', 'search', page, (payload) => {
      const [_, { removeSelectAll }] = selectable;
      removeSelectAll();
      searchEmpty.set(false);
      if (!payload.found.length) {
         searchEmpty.set(
            'No courses or bundles found matching your search query'
         );
      } else {
         search.set(payload.found);
      }
   });

   const CoursesAndBundles: TVisualizationTableSearch = (value) => {
      searchPost({
         name: value,
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
         return coursesAndBundles;
      }
   }, [search, filteredData, coursesAndBundles]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else if (filteredPagination.value) {
         return filteredPagination;
      } else {
         return coursesAndBundlesPagination;
      }
   }, [searchPagination, filteredPagination, coursesAndBundlesPagination]);

   return (
      <VisualizationTable
         name={'All'}
         search={true}
         data={tableData}
         pagination={tablePagination}
         schema={schema}
         tables={['All', 'Courses', 'Bundles']}
         currentTable={'All'}
         empty={searchEmpty.value}
         error={error}
         selectable={selectable}
         filters={filters}
         buttons={['filter']}
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
            search: CoursesAndBundles,
         }}
         reset={reset}
      />
   );
};

export default AdminCourseManagementAllTable;
