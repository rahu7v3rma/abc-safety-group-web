import { TAdminTableTransactionData, TTransaction } from '@/lib/types';
import fetchData from '../fetch';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';

async function getTransactionsList(page?: number) {
   type AdminTransactionsData = { transactions: TAdminTableTransactionData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<AdminTransactionsData, true>('transactions/list' + queries);
}

async function getTransactionData(transactionId: string) {
   type AdminTransactionData = { transaction: TTransaction };

   return fetchData<AdminTransactionData, true>(
      `transactions/load/${transactionId}`
   );
}

export { getTransactionsList, getTransactionData };
