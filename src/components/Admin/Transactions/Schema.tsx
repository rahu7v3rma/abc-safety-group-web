'use client';

import DefaultUserSchema from '@/components/DefaultSchemas/UserSchema';
import { DropdownOption } from '@/components/ui/DropdownHook';
import { formatting } from '@/lib/helpers';
import {
   TAdminTableTransactionData,
   TVisualizationTableRootSchema,
} from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import z from 'zod';

export const AdminTableTransactionsSchema: TVisualizationTableRootSchema<TAdminTableTransactionData> =
   {
      __root: {
         render: (children, values) => {
            return (
               <Link
                  href={`transactions/transaction/${values.transactionId}`}
                  className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
               >
                  {children}
               </Link>
            );
         },
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
      transactionId: {
         hidden: true,
      },
      amount: {
         render: (value) => {
            return <>${value}</>;
         },
      },
      ...DefaultUserSchema,
   };

export const TransactionsGenerateSchema = z.object({
   userId: z
      .custom<DropdownOption>()
      .optional()
      .refine((u) => u !== undefined, { message: 'User is required' }),
   price: z
      .number()
      .optional()
      .refine((u) => u !== undefined, { message: 'Price is required' }),
   transactionTypeId: z.custom<DropdownOption>().optional(),
   notes: z.string().optional(),
});

export type TTransactionsGenerateSchema = z.infer<
   typeof TransactionsGenerateSchema
>;

export const transactionsGenerateStateDefault: Partial<TTransactionsGenerateSchema> =
   {
      notes: '',
      price: undefined,
      transactionTypeId: undefined,
      userId: undefined,
   };

export type TransactionsGenerateRequestBody = {
   userId: string;
   price: number;
   amount: number;
   description: 'Generated transaction record in LMS';
   courseId?: string;
   bundleId?: string;
   notes?: string;
};

export const TransactionsUpdateSchema = z.object({
   price: z.coerce
      .number()
      .optional()
      .refine((p) => !!p, { message: 'Price is required' }),
   notes: z.string().optional(),
   description: z.string().optional(),
});

export type TTransactionsUpdateSchema = z.infer<
   typeof TransactionsUpdateSchema
>;
