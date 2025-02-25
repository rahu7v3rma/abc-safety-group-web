'use client';

import { useHookstate } from '@hookstate/core';
import { format } from 'date-fns';
import { FC, useMemo, useState } from 'react';
import { toast } from 'sonner';

import DateRangeFilter from '@/components/ui/Filters/DateRange';
import VisualizationTable from '@/components/ui/VisualizationTable';
import useSearch from '@/hooks/VisualizationTable/useSearch';
import useFilter from '@/hooks/useFilter';
import { AdminScheduleTableSchema } from './Schema';

import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import {
   APIResponsePagination,
   TAdminTableClassScheduleData,
   TVisualizationTableSearch,
} from '@/lib/types';

interface AdminClassScheduleTableProps {
   data: TAdminTableClassScheduleData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const AdminClassScheduleTable: FC<AdminClassScheduleTableProps> = ({
   data,
   pagination,
   error,
   page,
}) => {
   const schedule = useUpdateHookstate<TAdminTableClassScheduleData[]>(data);
   const schedulePagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );

   const filters = useHookstate<string[]>([]);
   const [filteredData, filter, filteredPagination] = useFilter<
      TAdminTableClassScheduleData[]
   >('courses/schedule', 'schedule', filters, page);

   const [showDateRangeFilter, setShowDateRangeFilter] =
      useState<boolean>(false);

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

   function ToggleFilterDateRange(active: boolean) {
      if (active) {
         setShowDateRangeFilter(true);
      } else {
         setShowDateRangeFilter(false);
         filter({
            startDate: false,
            endDate: false,
         });
      }
   }

   function FilterDateRange(startDate: Date, endDate: Date) {
      toast.promise(
         filter({
            startDate: `${format(startDate, 'MM/dd/yyyy')}`,
            endDate: format(endDate, 'MM/dd/yyyy'),
         }),
         {
            loading: 'Filtering...',
            success: 'Filtered!',
            error: (e) => {
               return e.message;
            },
         }
      );
   }

   function CancelFilterDateRange() {
      filters.set((activeFilters) =>
         activeFilters.filter((f) => f !== 'dateRange')
      );
   }

   const [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] = useSearch<
      TAdminTableClassScheduleData,
      { courseName: string } | { bundleName: string },
      {
         schedule: TAdminTableClassScheduleData[];
         pagination: APIResponsePagination;
      }
   >('courses', ['schedule', 'search'], page, (payload) => {
      searchEmpty.set(false);
      if (!payload.schedule.length) {
         searchEmpty.set(
            'No courses schedule found matching your search query'
         );
      } else {
         search.set(payload.schedule);
      }
   });

   const searchOptions = ['Course', 'Bundle'] as const;

   const ScheduleSearch: TVisualizationTableSearch<
      (typeof searchOptions)[number]
   > = (value, option) => {
      if (option === 'Course') {
         searchPost({
            courseName: value,
         });
      } else if (option === 'Bundle') {
         searchPost({
            bundleName: value,
         });
      }
   };

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else if (filteredData.value) {
         return filteredData;
      } else {
         return schedule;
      }
   }, [search, filteredData, schedule]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else if (filteredPagination.value) {
         return filteredPagination;
      } else {
         return schedulePagination;
      }
   }, [searchPagination, filteredPagination, schedulePagination]);

   return (
      <>
         <VisualizationTable
            name="Class schedule"
            search={true}
            data={tableData}
            pagination={tablePagination}
            schema={AdminScheduleTableSchema}
            error={error}
            empty={searchEmpty.value}
            buttons={['filter']}
            filters={filters}
            filter={{
               completed: FilterCompleted,
               dateRange: ToggleFilterDateRange,
            }}
            searchOptions={searchOptions}
            functions={{
               search: ScheduleSearch,
            }}
            loading={{
               search: !!searchLoading,
            }}
            disabled={{
               filter: !!search.length || !!searchEmpty.value,
            }}
            reset={reset}
            actionsClassName="bg-white group-hover:bg-zinc-100 hover:!bg-white"
         />
         <DateRangeFilter
            showFilter={showDateRangeFilter}
            setShowFilter={setShowDateRangeFilter}
            action={FilterDateRange}
            cancel={CancelFilterDateRange}
         />
      </>
   );
};

export default AdminClassScheduleTable;
