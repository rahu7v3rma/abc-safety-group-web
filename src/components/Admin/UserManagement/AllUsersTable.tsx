'use client';

import VisualizationTable from '@/components/ui/VisualizationTable';
import { FC, useCallback, useMemo, useState } from 'react';

import DefaultUserSchema from '@/components/DefaultSchemas/UserSchema';
import DateTimeSearch from '@/components/ui/Search/StartTime';
import { SearchState } from '@/components/ui/VisualizationTable/Search';
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
import { useHookstate } from '@hookstate/core';
import { Calendar } from 'iconoir-react';
import Link from 'next/link';
import { toast } from 'sonner';
import DeleteUsers from './Buttons/DeleteUsers';

const schema: TVisualizationTableRootSchema<TAdminTableUserManagementData> = {
   __root: {
      render: (children, values) => {
         return (
            <Link
               href={'/admin/users/' + values.userId}
               className="hover:bg-zinc-100 group flex-grow transition duration-200 ease-linear"
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

const searchOptions = [
   'First, Last',
   'Last, First',
   'SSTID',
   'Phone number',
   'Email',
] as const;

interface AdminUserManagementAllUsersTableProps {
   data: TAdminTableUserManagementData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const AdminUserManagementAllUsersTable: FC<
   AdminUserManagementAllUsersTableProps
> = ({ data, pagination, error = false, page }) => {
   const users = useUpdateHookstate<TAdminTableUserManagementData[]>(data);
   const usersPagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );

   const selectable = useSelectable<TAdminTableUserManagementData>(users);

   const [exportPost, exportLoading] = usePost<{ userIds: string[] }, any>(
      'data',
      ['export', 'all'],
      {
         success: (payload) => {
            const [selected] = selectable;
            if (payload.trim().length) {
               toast.success(
                  `Exported ${selected.length} user${
                     selected.length > 1 ? 's' : ''
                  }`
               );
               downloadCSV('users', payload);
            } else {
               toast.error('Failed exporting');
            }
         },
      }
   );

   const UsersExport = useCallback(() => {
      const [selected] = selectable;

      exportPost({
         userIds: selected.value.map((user) => user.userId),
      });
   }, [selectable, exportPost]);

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
      | { _id: string }
      | { phoneNumber: string }
      | { email: string }
      | { instructorFirstName: string; instructorLastName: string }
      | { startTime: string }
      | { courseName: string },
      {
         users: TAdminTableUserManagementData[];
         pagination: APIResponsePagination;
      }
   >('users', ['search', 'all'], page, (payload) => {
      const [_, { removeSelectAll }] = selectable;
      removeSelectAll();
      searchEmpty.set(false);
      if (!payload.users.length) {
         searchEmpty.set('No users found matching your search query');
      } else {
         search.set(payload.users);
      }
   });

   const [showStartTimeSearch, setShowStartTimeSearch] =
      useState<boolean>(false);

   const searchState = useHookstate<SearchState>({
      searchValue: false,
      searchIcon: false,
   });

   function SearchStartTime(startTime: string) {
      searchState.searchValue.set(startTime);
      toast.promise(
         searchPost({
            startTime,
         }),
         {
            loading: 'Searching...',
            success: 'Searched!',
            error: (e) => {
               return e.message;
            },
         }
      );
      setShowStartTimeSearch(false);
   }

   const UsersSearch: TVisualizationTableSearch<
      (typeof searchOptions)[number]
   > = useCallback(
      (value, option) => {
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
         } else if (option === 'SSTID') {
            searchPost({
               _id: value,
            });
         } else if (option === 'Instructor First, Last') {
            const valueSplit = value.split(/,? /gi);
            searchPost({
               instructorFirstName: valueSplit[0],
               instructorLastName: valueSplit[1],
            });
         } else if (option === 'Instructor Last, First') {
            const valueSplit = value.split(/,? /gi);
            searchPost({
               instructorFirstName: valueSplit[1],
               instructorLastName: valueSplit[0],
            });
         } else if (option === 'Course name') {
            searchPost({
               courseName: value,
            });
         }
      },
      [searchPost]
   );

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else {
         return users;
      }
   }, [search, users]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else {
         return usersPagination;
      }
   }, [searchPagination, usersPagination]);

   return (
      <>
         <VisualizationTable
            name="All"
            tables={['All', 'Students', 'Instructors', 'Admins']}
            currentTable={'All'}
            data={tableData}
            pagination={tablePagination}
            schema={schema}
            selectable={selectable}
            empty={searchEmpty.value}
            error={error}
            search={{
               'Start time': () => {
                  setShowStartTimeSearch(true);
                  searchState.searchIcon.set(Calendar);
               },
            }}
            searchOptions={searchOptions}
            searchState={searchState}
            buttons={[
               <DeleteUsers
                  key="usersDelete"
                  users={users}
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
               export: UsersExport,
               search: UsersSearch,
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
         <DateTimeSearch
            showSearch={showStartTimeSearch}
            setShowSearch={setShowStartTimeSearch}
            action={SearchStartTime}
            cancel={() => {
               searchState.searchValue.set(false);
               reset();
            }}
         />
      </>
   );
};

export default AdminUserManagementAllUsersTable;
