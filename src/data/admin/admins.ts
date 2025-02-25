import { TAdminTableUserManagementData } from '@/lib/types';
import fetchData from '../fetch';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';

async function getAdminsList(page?: number) {
   type AdminsData = { users: TAdminTableUserManagementData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<AdminsData, true>('users/admin' + queries);
}

export { getAdminsList };
