import {
   TBundleDetailsData,
   TCourseContentData,
   TCourseDetailsData,
   TStudentTableCourseData,
   TStudentTableScheduleData,
} from '@/lib/types';
import fetchData from '../fetch';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';

async function getMyCourses(page?: number) {
   type StudentCoursesData = { courses: TStudentTableCourseData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<StudentCoursesData, true>('users/my-courses' + queries);
}

async function getCourseData(id: string) {
   type StudentCourseData = {
      course: TCourseDetailsData;
      schedule: TStudentTableScheduleData[];
      enrolled: boolean;
   };

   return fetchData<StudentCourseData, true>(`courses/load/${id}`);
}

async function getBundleData(id: string) {
   type StudentBundleData = {
      bundle: TBundleDetailsData;
      schedule: TStudentTableScheduleData[];
      enrolled: boolean;
   };

   return fetchData<StudentBundleData, true>(`courses/bundle/load/${id}`);
}

async function getCourseContents(id: string) {
   type AdminCourseContentsData = { content: TCourseContentData[] };

   return fetchData<AdminCourseContentsData, true>(
      `courses/content/list/${id}?published=true`
   );
}

export { getMyCourses, getCourseData, getBundleData, getCourseContents };
