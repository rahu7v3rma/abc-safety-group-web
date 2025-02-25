import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import {
   TCourseContentData,
   TCourseDetailsData,
   TInstructorStudentsData,
   TInstructorTableCourseData,
   TInstructorTableScheduleData,
} from '@/lib/types';
import fetchData from '../fetch';

async function getMyCourses(page?: number) {
   type InstructorCoursesData = { courses: TInstructorTableCourseData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<InstructorCoursesData, true>('users/my-courses' + queries);
}

async function getCourseData(id: string) {
   type InstructorCourseData = {
      course: TCourseDetailsData;
      schedule: TInstructorTableScheduleData[];
      enrolled: boolean;
   };

   return fetchData<InstructorCourseData, true>(`courses/load/${id}`);
}

async function getCourseContents(id: string) {
   type InstructorCourseContentsData = { content: TCourseContentData[] };

   return fetchData<InstructorCourseContentsData, true>(
      `courses/content/list/${id}?published=true`,
   );
}

export { getMyCourses, getCourseData, getCourseContents };
