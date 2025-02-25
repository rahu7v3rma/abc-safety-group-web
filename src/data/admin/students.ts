import { TAdminTableUserManagementData } from '@/lib/types';
import fetchData from '../fetch';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';

async function getStudentsList(page?: number) {
   type StudentsData = { users: TAdminTableUserManagementData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<StudentsData, true>('users/student' + queries);
}

export { getStudentsList };
