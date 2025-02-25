import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import {
   TInstructorStudentsData,
   TInstructorTableScheduleData,
} from '@/lib/types';
import fetchData from '../fetch';

async function getMySchedule(page?: number) {
   type InstructorScheduleData = { schedule: TInstructorTableScheduleData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<InstructorScheduleData, true>(
      'users/my-schedule' + queries,
   );
}

async function getStudents(
   courseId: string,
   seriesNumber: string,
   page?: number,
) {
   type InstructorStudentsData = { students: TInstructorStudentsData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<InstructorStudentsData, true>(
      `instructor/students/${courseId}/${seriesNumber}` + queries,
   );
}

export { getMySchedule, getStudents };
