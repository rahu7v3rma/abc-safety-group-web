import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import { TStudentTableScheduleData } from '@/lib/types';
import fetchData from '../fetch';

async function getMySchedule(page?: number) {
   type StudentScheduleData = { schedule: TStudentTableScheduleData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<StudentScheduleData, true>('users/my-schedule' + queries);
}

export { getMySchedule };
