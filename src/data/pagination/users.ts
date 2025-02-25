import { DropdownPaginatedFetchReturn } from '@/components/ui/DropdownListPaginated';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import { TAdminTableUserManagementData, TUsers } from '@/lib/types';
import { getAdminsList } from '../admin/admins';
import { getInstructorsList } from '../admin/instructors';
import { getStudentsList } from '../admin/students';
import postData from '../post';

export const fetchUsers = async (
   page: number,
   type: TUsers
): Promise<DropdownPaginatedFetchReturn<TAdminTableUserManagementData>> => {
   let data;

   if (type === 'admin') {
      data = await getAdminsList(page);
   } else if (type === 'instructor') {
      data = await getInstructorsList(page);
   } else {
      data = await getStudentsList(page);
   }

   if (data.success) {
      return {
         options: data.payload.users.map((user) => ({
            text: `${user.firstName} ${user.lastName}`,
            value: user.userId,
         })),
         pagination: data.payload.pagination,
         data: data.payload.users,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};

export const searchFetchUsers = async (
   query: string,
   page: number,
   type: TUsers
): Promise<DropdownPaginatedFetchReturn<TAdminTableUserManagementData>> => {
   const queries = filterObjectToQueries({
      page,
      pageSize,
   });

   const querySplit = query.split(' ');

   const firstName = querySplit[0];
   const lastName = querySplit[1];

   const data = await postData<
      { firstName: string },
      { users: TAdminTableUserManagementData[] },
      true
   >('users/search/' + type + queries, {
      firstName: firstName,
      ...(lastName ? { lastName } : {}),
   });

   if (data.success) {
      return {
         options: data.payload.users.map((user) => ({
            text: `${user.firstName} ${user.lastName}`,
            value: user.userId,
         })),
         pagination: data.payload.pagination,
         data: data.payload.users,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};
