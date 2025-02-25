'use client';

import { FC, useMemo } from 'react';

import { AdminFormsTableSchema } from '../Schema';

import VisualizationTable from '@/components/ui/VisualizationTable';
import useSearch from '@/hooks/VisualizationTable/useSearch';

import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import {
   APIResponsePagination,
   TAdminTableFormData,
   TVisualizationTableSearch,
} from '@/lib/types';

interface AdminFormsManagementProps {
   data: TAdminTableFormData[];
   pagination: APIResponsePagination | false;
   error?: false | string;
   page: number;
}

const AdminAllFormsManagementTable: FC<AdminFormsManagementProps> = ({
   data,
   pagination,
   error = false,
   page,
}) => {
   const forms = useUpdateHookstate<TAdminTableFormData[]>(data);
   const formsPagination = useUpdateHookstate<APIResponsePagination | false>(
      pagination
   );

   const [
      search,
      searchPagination,
      searchEmpty,
      searchPost,
      searchLoading,
      reset,
   ] = useSearch<
      TAdminTableFormData,
      { formName: string },
      {
         forms: TAdminTableFormData[];
         pagination: APIResponsePagination;
      }
   >('forms', 'search', page, (payload) => {
      searchEmpty.set(false);
      if (!payload.forms.length) {
         searchEmpty.set('No forms found matching your search query');
      } else {
         search.set(payload.forms);
      }
   });

   const FormsSearch: TVisualizationTableSearch = (value) => {
      searchPost({
         formName: value,
      });
   };

   const tableData = useMemo(() => {
      if (search.length) {
         return search;
      } else {
         return forms;
      }
   }, [search, forms]);

   const tablePagination = useMemo(() => {
      if (searchPagination.value) {
         return searchPagination;
      } else {
         return formsPagination;
      }
   }, [searchPagination, formsPagination]);

   return (
      <VisualizationTable
         name="All"
         tables={['All', 'Quizzes', 'Surveys']}
         currentTable={'All'}
         data={tableData}
         pagination={tablePagination}
         schema={AdminFormsTableSchema}
         error={error}
         search={true}
         empty={searchEmpty.value}
         buttons={['create']}
         create={{
            'Quiz/Survey': '/admin/forms/create/quizsurvey',
         }}
         functions={{
            search: FormsSearch,
         }}
         loading={{
            search: !!searchLoading,
         }}
         reset={reset}
      />
   );
};

export default AdminAllFormsManagementTable;
