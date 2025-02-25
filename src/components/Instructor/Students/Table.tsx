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
   TInstructorTableStudentManagementData,
   TVisualizationTableRootSchema,
   TVisualizationTableSearch,
} from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { Calendar } from 'iconoir-react';
import Link from 'next/link';
import { toast } from 'sonner';

const schema: TVisualizationTableRootSchema<TInstructorTableStudentManagementData> =
   {
      __root: {
         render: (children, values) => {
            return (
               <Link
                  href={'/instructor/students/student/' + values.userId}
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
   'Instructor First, Last',
   'Instructor Last, First',
   'Start time',
   'Course name',
] as const;

interface InstructorStudentManagementTableProps {
   data: TInstructorTableStudentManagementData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const InstructorStudentManagementTable: FC<
   InstructorStudentManagementTableProps
> = ({ data, pagination, error = false, page }) => {
   const students =
      useUpdateHookstate<TInstructorTableStudentManagementData[]>(data);
   const studentsPagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );

   const selectable =
      useSelectable<TInstructorTableStudentManagementData>(students);

   const [exportPost, exportLoading] = usePost<{ userIds: string[] }, any>(
      'data',
      ['export', 'student']
   );

   const StudentsExport = useCallback(() => {
      const [selected] = selectable;

      const studentsCount = `${selected.length} student${
         selected.length > 1 ? 's' : ''
      }`;
      toast.promise(
         exportPost({
            userIds: selected.value.map((student) => student.userId),
         }),
         {
            loading: `Exporting ${studentsCount}`,
            success: (payload: any) => {
               if (payload.trim().length) {
                  downloadCSV('students', payload);
               }
               return `Exported ${studentsCount}`;
            },
            error: `Failed exporting ${studentsCount}`,
         }
      );
   }, [selectable, exportPost]);

   const [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] = useSearch<
      TInstructorTableStudentManagementData,
      | { firstName: string; lastName: string }
      | { _id: string }
      | { phoneNumber: string }
      | { email: string }
      | { instructorFirstName: string; instructorLastName: string }
      | { startTime: string }
      | { courseName: string },
      {
         users: TInstructorTableStudentManagementData[];
         pagination: APIResponsePagination;
      }
   >('users', ['search', 'student'], page, (payload) => {
      const [_, { removeSelectAll }] = selectable;
      removeSelectAll();
      searchEmpty.set(false);
      if (!payload.users.length) {
         searchEmpty.set('No students found matching your search query');
      } else {
         search.set(payload.users);
      }
   });

   const [showStartTimeSearch, setShowStartTimeSearch] = useState(false);

   const searchState = useHookstate<SearchState>({
      searchValue: false,
      searchIcon: false,
   });

   const SearchStartTime = useCallback(
      (startTime: string) => {
         searchState.searchValue.set(startTime);
         toast.promise(searchPost({ startTime }), {
            loading: 'Searching...',
            success: 'Searched!',
            error: (e) => e.message,
         });
         setShowStartTimeSearch(false);
      },
      [searchState, searchPost]
   );

   const StudentsSearch: TVisualizationTableSearch<
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

   const tableData = useMemo(
      () => (search.length ? search : students),
      [search, students]
   );

   const tablePagination = useMemo(
      () => (searchPagination.value ? searchPagination : studentsPagination),
      [searchPagination, studentsPagination]
   );

   return (
      <>
         <VisualizationTable
            name="Students"
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
            buttons={['export', 'filter']}
            functions={{
               export: StudentsExport,
               search: StudentsSearch,
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

export default InstructorStudentManagementTable;
