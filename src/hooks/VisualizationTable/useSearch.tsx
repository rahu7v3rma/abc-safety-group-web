import { pageSize } from '@/lib/pagination';
import {
   APIResponsePagination,
   ActionsSuccess,
   TAPIRouters,
} from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { useEffect } from 'react';
import usePost from '../usePost';
import useUpdateSearchParams from '../useUpdateSearchParams';

export default function useSearch<DD, D, P>(
   router: TAPIRouters,
   resource: string | string[],
   page: number,
   success: ActionsSuccess<P>
) {
   const search = useHookstate<DD[]>([]);
   const searchPagination = useHookstate<APIResponsePagination | false>(false);
   const searchEmpty = useHookstate<false | string>(false);

   const updateSearchParams = useUpdateSearchParams();

   const initialPage = useHookstate<false | number>(false);
   const currentPage = useHookstate<false | number>(false);
   const currentParams = useHookstate<any>({});

   const [post, searchLoading] = usePost<D, P>(
      router,
      resource,
      {
         success: (data: any) => {
            updateSearchParams('page', data.pagination.curPage);
            currentPage.set(data.pagination.curPage);
            searchPagination.set(data.pagination);
            success(data);
         },
         fail: () => {
            reset();
         },
      },
      {
         page: currentPage.get() ? currentPage : 1,
         pageSize: pageSize,
      }
   );

   async function searchPost(params: D) {
      if (!initialPage.get()) {
         initialPage.set(page);
      }
      currentParams.set(params);
      await post(params);
   }

   function reset() {
      currentParams.set({});
      search.set([]);
      searchPagination.set(false);
      searchEmpty.set(false);
      updateSearchParams(
         'page',
         initialPage.get() ? initialPage.get().toString() : '1'
      );
      currentPage.set(false);
      initialPage.set(false);
   }

   useEffect(() => {
      if (search.get() && searchPagination.get()) {
         if (page !== currentPage.get()) {
            currentPage.set(page);
            searchPost(JSON.parse(JSON.stringify(currentParams.get())));
         }
      }
   }, [page]);

   return [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] as const;
}
