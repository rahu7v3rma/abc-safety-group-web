import { TAdminTableClassScheduleData } from '@/lib/types';
import fetchData from '../fetch';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';

async function getSchedule(page?: number) {
   type AdminScheduleData = { schedule: TAdminTableClassScheduleData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<AdminScheduleData, true>('courses/schedule' + queries);
}

export { getSchedule };
