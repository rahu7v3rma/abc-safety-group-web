import { TAdminTableUserManagementData } from '@/lib/types';
import fetchData from '../fetch';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';

async function getInstructorsList(page?: number) {
   type InstructorsData = { users: TAdminTableUserManagementData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<InstructorsData, true>('users/instructor' + queries);
}

export { getInstructorsList };
