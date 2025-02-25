'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { FC, useCallback, useMemo } from 'react';

import { AdminTableTransactionsSchema } from './Schema';

import useSearch from '@/hooks/VisualizationTable/useSearch';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import {
   APIResponsePagination,
   TAdminTableTransactionData,
   TVisualizationTableSearch,
} from '@/lib/types';
import { GenerateButton } from './Components';

interface AdminTransactionsTableProps {
   data: TAdminTableTransactionData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const searchOptions = [
   'First, Last',
   'Last, First',
   'Phone number',
   'Email',
   'Course name',
   'Bundle name',
] as const;

const AdminTransactionsTable: FC<AdminTransactionsTableProps> = ({
   data,
   pagination,
   error,
   page,
}) => {
   const transactions = useUpdateHookstate<TAdminTableTransactionData[]>(data);
   const transactionsPagination = useUpdateHookstate<
      APIResponsePagination | false
   >(pagination);

   const [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] = useSearch<
      TAdminTableTransactionData,
      | { firstName: string; lastName: string }
      | { phoneNumber: string }
      | { email: string }
      | { courseName: string }
      | { bundleName: string },
      {
         transactions: TAdminTableTransactionData[];
         pagination: APIResponsePagination;
      }
   >('transactions', ['search'], page, (payload) => {
      searchEmpty.set(false);
      if (!payload.transactions.length) {
         searchEmpty.set('No transactions found matching your search query');
      } else {
         search.set(payload.transactions);
      }
   });

   const searchTransactions: TVisualizationTableSearch<
      (typeof searchOptions)[number]
   > = useCallback(
      (value, option) => {
         let firstName, lastName, phoneNumber, email, courseName, bundleName;
         phoneNumber = email = courseName = bundleName = value;
         switch (option) {
            case 'First, Last':
               [firstName, lastName] = value.split(/,? /gi);
               searchPost({ firstName, lastName });
               break;
            case 'Last, First':
               [lastName, firstName] = value.split(/,? /gi);
               searchPost({ firstName, lastName });
               break;
            case 'Phone number':
               searchPost({ phoneNumber });
               break;
            case 'Email':
               searchPost({ email });
               break;
            case 'Course name':
               searchPost({ courseName });
               break;
            case 'Bundle name':
               searchPost({ bundleName });
               break;
         }
      },
      [searchPost]
   );

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else {
         return transactions;
      }
   }, [search, transactions]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else {
         return transactionsPagination;
      }
   }, [searchPagination, transactionsPagination]);

   return (
      <VisualizationTable
         name={'Transactions'}
         data={tableData}
         pagination={tablePagination}
         schema={AdminTableTransactionsSchema}
         error={error}
         search={true}
         searchOptions={searchOptions}
         empty={searchEmpty.value}
         functions={{
            search: searchTransactions,
         }}
         loading={{
            search: !!searchLoading,
         }}
         reset={reset}
         buttons={[<GenerateButton key="generateButton" />]}
      />
   );
};

export default AdminTransactionsTable;
