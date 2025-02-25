'use client';

import { State } from '@hookstate/core';
import { FC, useCallback, useMemo } from 'react';

import useUpdateSearchParams from '@/hooks/useUpdateSearchParams';
import { pageSize } from '@/lib/pagination';
import { APIResponsePagination } from '@/lib/types';
import { NavArrowLeft, NavArrowRight } from 'iconoir-react';

interface VisualizationTablePaginationProps {
   name: string;
   pagination?: State<APIResponsePagination | false, {}>;
   tableLoading: State<boolean, {}>;
}

const VisualizationTablePagination: FC<VisualizationTablePaginationProps> = ({
   name,
   pagination,
   tableLoading,
}) => {
   const updateSearchParams = useUpdateSearchParams();

   const prevDisabled = useMemo(() => {
      if (pagination && pagination.value) {
         return pagination.value.curPage <= 1;
      }
      return true;
   }, [pagination]);

   const nextDisabled = useMemo(() => {
      if (pagination && pagination.value) {
         return pagination.value.curPage === pagination.value.totalPages;
      }
      return true;
   }, [pagination]);

   const NextPage = useCallback(() => {
      if (pagination && pagination.value) {
         tableLoading.set(true);
         updateSearchParams('page', (pagination.value.curPage + 1).toString());
      }
   }, [pagination]);

   const PreviousPage = useCallback(() => {
      if (pagination && pagination.value) {
         tableLoading.set(true);
         updateSearchParams('page', (pagination.value.curPage - 1).toString());
      }
   }, [pagination]);

   const { startIndex, endIndex } = useMemo(() => {
      if (pagination && pagination.value) {
         const startIndex = (pagination.value.curPage - 1) * pageSize + 1;
         let endIndex = pagination.value.curPage * pageSize;
         if (endIndex > pagination.value.totalCount) {
            endIndex = pagination.value.totalCount;
         }

         return { startIndex, endIndex };
      }

      return { startIndex: 0, endIndex: 0 };
   }, [pagination]);

   if (!pagination || !pagination.value) return null;

   if (!pagination.value.totalCount) return null;

   return (
      <div className="mt-4 -mb-4 flex items-center justify-between">
         <p className="text-zinc-500 text-sm">
            Showing{' '}
            <span className="text-zinc-600 font-medium">{startIndex}</span> —{' '}
            <span className="text-zinc-600 font-medium">{endIndex}</span> of{' '}
            <span className="font-medium">{pagination.value.totalCount}</span>{' '}
            {name}
         </p>
         <div className="flex items-center gap-8">
            <p className="text-sm text-zinc-500">
               <span className="text-zinc-600 font-medium">
                  {pagination.value.curPage}
               </span>{' '}
               of{' '}
               <span className="text-zinc-600 font-medium">
                  {pagination.value.totalPages}
               </span>{' '}
               pages
            </p>
            <div className="flex items-center gap-2.5">
               <button
                  disabled={prevDisabled || tableLoading.value}
                  onClick={PreviousPage}
                  className="font-medium disabled:opacity-75 disabled:cursor-not-allowed flex items-center bg-gradient-to-b from-blue-400 to-blue-500 border border-blue-600 shadow-inner-blue text-white py-2.5 text-sm pl-2.5 pr-5 rounded-xl tracking-tight"
               >
                  <NavArrowLeft className="mr-1 h-5 w-5" strokeWidth={2} />
                  Prev
               </button>
               <button
                  disabled={nextDisabled || tableLoading.value}
                  onClick={NextPage}
                  className="font-medium disabled:opacity-75 disabled:cursor-not-allowed flex items-center bg-gradient-to-b from-blue-400 to-blue-500 border border-blue-600 shadow-inner-blue text-white py-2.5 text-sm pr-2.5 pl-5 rounded-xl tracking-tight"
               >
                  Next
                  <NavArrowRight className="ml-1 h-5 w-5" strokeWidth={2} />
               </button>
            </div>
         </div>
      </div>
   );
};

export default VisualizationTablePagination;
