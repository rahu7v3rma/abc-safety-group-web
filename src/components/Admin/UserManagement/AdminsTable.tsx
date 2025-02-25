'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { FC, useMemo } from 'react';

import DefaultUserSchema from '@/components/DefaultSchemas/UserSchema';
import useSearch from '@/hooks/VisualizationTable/useSearch';
import usePost from '@/hooks/usePost';
import useSelectable from '@/hooks/useSelectable';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import { downloadCSV } from '@/lib/helpers';
import {
   APIResponsePagination,
   TAdminTableUserManagementData,
   TVisualizationTableRootSchema,
   TVisualizationTableSearch,
} from '@/lib/types';
import Link from 'next/link';
import { toast } from 'sonner';
import DeleteUsers from './Buttons/DeleteUsers';

interface AdminAdminManagementTableProps {
   data: TAdminTableUserManagementData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const AdminAdminManagementTable: FC<AdminAdminManagementTableProps> = ({
   data,
   pagination,
   error = false,
   page,
}) => {
   const admins = useUpdateHookstate<TAdminTableUserManagementData[]>(data);
   const adminsPagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );

   const schema: TVisualizationTableRootSchema<TAdminTableUserManagementData> =
      {
         __root: {
            render: (children, values) => {
               return (
                  <Link
                     href={'/admin/users/' + values.userId}
                     className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
                  >
                     {children}
                  </Link>
               );
            },
         },
         dob: {
            render: (value) => {
               return <span className="text-sm text-zinc-500">{value}</span>;
            },
         },
         ...DefaultUserSchema,
      };

   const selectable = useSelectable<TAdminTableUserManagementData>(admins);

   const [exportPost, exportLoading] = usePost<{ userIds: string[] }, any>(
      'data',
      ['export', 'admin'],
      {
         success: (payload) => {
            const [selected] = selectable;
            if (payload.trim().length) {
               toast.success(
                  `Exported ${selected.length} admin${
                     selected.length > 1 ? 's' : ''
                  }`
               );
               downloadCSV('admins', payload);
            } else {
               toast.error('Failed exporting');
            }
         },
      }
   );

   const AdminsExport = () => {
      const [selected] = selectable;
      exportPost({
         userIds: selected.value.map((admin) => admin.userId),
      });
   };

   const [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] = useSearch<
      TAdminTableUserManagementData,
      | { firstName: string; lastName: string }
      | { phoneNumber: string }
      | { email: string },
      {
         users: TAdminTableUserManagementData[];
         pagination: APIResponsePagination;
      }
   >('users', ['search', 'admin'], page, (payload) => {
      const [_, { removeSelectAll }] = selectable;
      removeSelectAll();
      searchEmpty.set(false);
      if (!payload.users.length) {
         searchEmpty.set('No admins found matching your search query');
      } else {
         search.set(payload.users);
      }
   });

   const searchOptions = [
      'First, Last',
      'Last, First',
      'Phone number',
      'Email',
   ] as const;

   const AdminsSearch: TVisualizationTableSearch<
      (typeof searchOptions)[number]
   > = (value, option) => {
      if (option === 'First, Last') {
         const valueSplit = value.split(/,? /gi);
         searchPost({
            firstName: valueSplit[0],
            lastName: valueSplit[1],
         });
      } else if (option === 'Last, First') {
         const valueSplit = value.split(/,? /gi);
         searchPost({
            firstName: valueSplit[1],
            lastName: valueSplit[0],
         });
      } else if (option === 'Phone number') {
         searchPost({
            phoneNumber: value,
         });
      } else if (option === 'Email') {
         searchPost({
            email: value,
         });
      }
   };

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else {
         return admins;
      }
   }, [search, admins]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else {
         return adminsPagination;
      }
   }, [searchPagination, adminsPagination]);

   return (
      <VisualizationTable
         name="Admins"
         tables={['All', 'Students', 'Instructors', 'Admins']}
         currentTable={'Admins'}
         data={tableData}
         pagination={tablePagination}
         schema={schema}
         selectable={selectable}
         empty={searchEmpty.value}
         error={error}
         search={true}
         searchOptions={searchOptions}
         buttons={[
            <DeleteUsers
               key="adminsDelete"
               users={admins}
               selectable={selectable}
            />,
            'export',
            'filter',
            'create',
         ]}
         create={{
            Student: '/admin/users/create/student',
            Instructor: '/admin/users/create/instructor',
            Admin: '/admin/users/create/admin',
         }}
         functions={{
            export: AdminsExport,
            search: AdminsSearch,
         }}
         loading={{
            export: exportLoading,
            search: searchLoading,
         }}
         disabled={{
            export: !selectable[0].value.length,
         }}
         reset={reset}
      />
   );
};

export default AdminAdminManagementTable;
