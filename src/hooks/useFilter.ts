import fetchData from '@/data/fetch';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import { APIResponsePagination } from '@/lib/types';
import { State, useHookstate } from '@hookstate/core';
import { useEffect } from 'react';
import useUpdateSearchParams from './useUpdateSearchParams';

// TODO: implement pagination
export default function useFilter<T>(
   route: string,
   key: string,
   filters: State<string[], {}>,
   page: number
) {
   const updateSearchParams = useUpdateSearchParams();

   const filteredData = useHookstate<T | false>(false);
   const filteredPagination = useHookstate<APIResponsePagination | false>(
      false
   );
   const currentFilters = useHookstate<Record<string, any>>({});

   const initialPage = useHookstate<false | number>(false);
   const currentPage = useHookstate<false | number>(false);

   async function filter(filterObj: Record<string, any>) {
      try {
         if (!initialPage.get()) {
            initialPage.set(page);
         }

         const queryFilters: Record<string, any> = currentFilters.get({
            noproxy: true,
         });

         Object.entries(filterObj).forEach(([key, value]) => {
            if (queryFilters.hasOwnProperty(key)) {
               if (value === false) {
                  delete queryFilters[key];
               } else {
                  queryFilters[key] = value;
               }
            } else {
               queryFilters[key] = value;
            }
         });

         currentFilters.set(queryFilters);

         if (Object.keys(queryFilters).length) {
            const queries = filterObjectToQueries({
               ...(queryFilters ? queryFilters : {}),
               page: currentPage.get() ? currentPage.get() : 1,
               pageSize,
            });

            const url = `${route}${queries}`;

            const data = await fetchData<any, true>(url);

            if (data.success) {
               filteredData.set(data.payload[key]);
               if (data.payload.pagination) {
                  filteredPagination.set(data.payload.pagination);
                  updateSearchParams(
                     'page',
                     data.payload.pagination.curPage.toString()
                  );
                  currentPage.set(data.payload.pagination.curPage);
               }
            } else {
               filters.set([]);
               filteredData.set(false);
               filteredPagination.set(false);
               updateSearchParams('page', initialPage.get().toString() || '1');
               initialPage.set(false);
               currentPage.set(false);
               throw new Error('Failed filtering');
            }
         } else {
            filters.set([]);
            filteredData.set(false);
            filteredPagination.set(false);
            updateSearchParams('page', initialPage.get().toString() || '1');
            initialPage.set(false);
            currentPage.set(false);
         }
      } catch (err) {
         throw new Error('Failed filtering');
      }
   }

   useEffect(() => {
      if (filteredData.get() && filteredPagination.get()) {
         if (page !== currentPage.get()) {
            currentPage.set(page);
            filter(currentFilters.get());
         }
      }
   }, [page]);

   return [filteredData, filter, filteredPagination] as [
      State<T, {}>,
      typeof filter,
      State<false | APIResponsePagination, {}>
   ];
}
