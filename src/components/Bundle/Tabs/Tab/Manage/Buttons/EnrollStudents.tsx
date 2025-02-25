import { FC, useEffect, useMemo, useState } from 'react';

import DefaultUserSchema from '@/components/DefaultSchemas/UserSchema';
import Dialog from '@/components/ui/Dialog';
import Spinner from '@/components/ui/Spinner';
import VisualizationTable from '@/components/ui/VisualizationTable';
import fetchData from '@/data/fetch';
import useSearch from '@/hooks/VisualizationTable/useSearch';
import usePost from '@/hooks/usePost';
import useSelectable from '@/hooks/useSelectable';
import useUpdateSearchParams from '@/hooks/useUpdateSearchParams';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import {
   APIResponsePagination,
   TAdminBundleDetailsManageStudent,
   TAdminTableUserManagementData,
   TBundleDetailsData,
   TVisualizationTableRootSchema,
   TVisualizationTableSearch,
} from '@/lib/types';
import { State, useHookstate } from '@hookstate/core';
import { UserPlus } from 'iconoir-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface EnrollStudentsProps {
   bundle: TBundleDetailsData;
   students: State<TAdminBundleDetailsManageStudent[], {}>;
   page: number;
}

const EnrollStudents: FC<EnrollStudentsProps> = ({
   bundle,
   students,
   page,
}) => {
   const updateSearchParams = useUpdateSearchParams();
   const [enrollStudentsOpen, setEnrollStudentsOpen] = useState<boolean>(false);

   const [EnrollStudentsPost, EnrollStudentsLoading] = usePost<
      {
         students: {
            userId: string;
            registrationStatus: string;
         }[];
      },
      any
   >('courses', ['bundle', 'enroll', 'student', bundle.bundleId]);

   const allStudents = useHookstate<TAdminTableUserManagementData[]>([]);
   const allStudentsPagination = useHookstate<APIResponsePagination | false>(
      false
   );
   const [allStudentsLoading, setAllStudentsLoading] = useState<boolean>(true);
   const [allStudentsError, setAllStudentsError] = useState<false | string>(
      false
   );

   const schema: TVisualizationTableRootSchema<TAdminTableUserManagementData> =
      {
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

   const selectable = useSelectable(allStudents);

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
      | { email: string },
      {
         users: TAdminTableUserManagementData[];
         pagination: APIResponsePagination;
      }
   >('users', ['search', 'student'], page, (payload) => {
      searchEmpty.set(false);
      if (!payload.users.length) {
         searchEmpty.set('No students found matching your search query');
      } else {
         search.set(payload.users);
      }
   });

   const searchOptions = [
      'First, Last',
      'Last, First',
      'SSTID',
      'Phone number',
      'Email',
   ] as const;

   const StudentsSearch: TVisualizationTableSearch<
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
      } else if (option === 'SSTID') {
         searchPost({
            _id: value,
         });
      }
   };

   async function getAllStudents() {
      setAllStudentsLoading(true);

      const queries = filterObjectToQueries({
         page: page || 1,
         pageSize,
      });

      const data = await fetchData<
         {
            users: TAdminTableUserManagementData[];
            pagination: APIResponsePagination;
         },
         any
      >('users/student' + queries);

      if (data.success) {
         const existingStudentIDs = students
            .get({ noproxy: true })
            .map((u) => u.userId);

         const all = data.payload.users.filter(
            (user) => !existingStudentIDs.includes(user.userId)
         );
         allStudents.set(all);
         if (data.payload.pagination) {
            data.payload.pagination.pageSize = all.length;
         }
         allStudentsPagination.set(data.payload.pagination || false);
      } else {
         setAllStudentsError(data.message ?? '');
      }

      setAllStudentsLoading(false);
   }

   useEffect(() => {
      getAllStudents();
   }, [page]);

   function enrollStudents() {
      const [selected] = selectable;

      const enrollingStudents = selected.get({ noproxy: true });

      toast.promise(
         EnrollStudentsPost(
            {
               students: [
                  ...enrollingStudents.map((s) => ({
                     userId: s.userId,
                     registrationStatus: 'enrolled',
                  })),
               ],
            },
            {
               success: () => {
                  updateSearchParams('page', '1');
                  Close();
               },
            },
            { throw: true }
         ),
         {
            loading: `Enrolling ${selected.length} students`,
            success: `Enrolled ${selected.length} students`,
            error: (e) => {
               return e.message;
            },
         }
      );
   }

   function Close() {
      const [_, { removeSelectAll }] = selectable;
      removeSelectAll();
      setEnrollStudentsOpen(false);
   }

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else {
         return allStudents;
      }
   }, [search, allStudents]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else {
         return allStudentsPagination;
      }
   }, [searchPagination, allStudentsPagination]);

   return (
      <>
         <button
            onClick={() => setEnrollStudentsOpen(true)}
            className="px-5 w-44 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue gap-2"
         >
            Enroll Students
            <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
               <UserPlus className="h-4 w-4" strokeWidth={2} />
            </span>
         </button>
         <Dialog
            contentClassName="max-w-[1000px]"
            open={enrollStudentsOpen}
            onOpenChange={(value) => {
               if (!value) {
                  Close();
               }
               setEnrollStudentsOpen(value);
            }}
         >
            {allStudentsLoading ? (
               <div className="w-full flex flex-col items-center justify-center">
                  <p className="text-lg font-medium tracking-tight text-blue-500">
                     Getting all students...
                  </p>
                  <Spinner className="mt-10 h-12 w-12 text-blue-500" />
               </div>
            ) : (
               <VisualizationTable
                  name="Students"
                  data={tableData}
                  pagination={tablePagination}
                  selectable={selectable}
                  schema={schema}
                  empty={searchEmpty.value}
                  error={allStudentsError}
                  search={true}
                  searchOptions={searchOptions}
                  functions={{
                     search: StudentsSearch,
                  }}
                  loading={{
                     search: searchLoading,
                  }}
                  buttons={[
                     <button
                        key="enroll"
                        disabled={!selectable[0].length}
                        onClick={enrollStudents}
                        className="px-5 w-44 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue gap-2"
                     >
                        Enroll Students
                        <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                           {EnrollStudentsLoading ? (
                              <Spinner className="h-4 w-4" />
                           ) : (
                              <UserPlus className="h-4 w-4" strokeWidth={2} />
                           )}
                        </span>
                     </button>,
                  ]}
                  reset={reset}
                  maxHeight="max-h-[40rem]  min-h-[20rem]"
                  autoHeight
               />
            )}
         </Dialog>
      </>
   );
};

export default EnrollStudents;
