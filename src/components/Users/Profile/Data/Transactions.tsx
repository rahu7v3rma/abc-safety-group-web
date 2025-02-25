'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { TransactionData } from '@/data/admin/users';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { formatting } from '@/lib/helpers';
import {
   APIResponsePagination,
   TStudentTableTransactionData,
   TVisualizationTableRootSchema,
   TWithPagination,
} from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { FC } from 'react';

const schema: TVisualizationTableRootSchema<TStudentTableTransactionData> = {
   __root: {
      render: (children, values) => {
         return (
            <Link
               href={`/admin/transactions/transaction/${values.transactionId}`}
               className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
            >
               {children}
            </Link>
         );
      },
   },
   userId: {
      hidden: true,
   },
   transactionId: {
      hidden: true,
   },
   transactionDate: {
      render: (value) => {
         return (
            <span className="text-sm text-zinc-500">
               {format(new Date(value), formatting)}
            </span>
         );
      },
   },
   amount: {
      render: (value) => {
         return <>${value}</>;
      },
   },
};

interface UserDataTransactionsProps {
   transactions: TWithPagination<TransactionData>;
   page: number;
   tables?: string[];
   error?: false | string;
}

const UserDataTransactions: FC<UserDataTransactionsProps> = ({
   transactions,
   tables,
   error,
}) => {
   const transactionData = useUpdateHookstate<TStudentTableTransactionData[]>(
      transactions.transactions
   );
   const transactionPagination = useUpdateHookstate<
      APIResponsePagination | false
   >(transactions.pagination);

   return (
      <VisualizationTable
         name="Transactions"
         data={transactionData}
         pagination={transactionPagination}
         error={error}
         schema={schema}
         tables={tables}
         currentTable="Transactions"
         maxHeight="h-auto min-h-[20rem] max-h-[60rem]"
      />
   );
};

export default UserDataTransactions;
