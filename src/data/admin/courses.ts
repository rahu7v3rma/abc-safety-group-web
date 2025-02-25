import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import {
   TAdminBundleDetailsManageStudent,
   TAdminCourseDetailsManageStudent,
   TAdminTableBundleData,
   TAdminTableClassScheduleData,
   TAdminTableCourseAndBundleData,
   TAdminTableCourseData,
   TBundleDetailsData,
   TBundleUpdateDetailsData,
   TCourseContentData,
   TCourseDetailsData,
   TCourseUpdateDetailsData,
} from '@/lib/types';
import fetchData from '../fetch';

async function getCoursesAndBundlesList(
   filterObj?: Record<string, any> | false,
   page?: number
) {
   type AdminCoursesAndBundlesData = {
      found: TAdminTableCourseAndBundleData[];
   };

   const queries = filterObjectToQueries({
      ...(filterObj ? filterObj : {}),
      ...{
         page: page || 1,
         pageSize,
      },
   });

   return fetchData<AdminCoursesAndBundlesData, true>(
      'courses/list/all' + queries
   );
}

async function getCoursesList(
   filterObj?: Record<string, any> | false,
   page?: number
) {
   type AdminCoursesData = { courses: TAdminTableCourseData[] };

   const queries = filterObjectToQueries({
      ...(filterObj ? filterObj : {}),
      ...{
         page: page || 1,
         pageSize,
      },
   });

   return fetchData<AdminCoursesData, true>('courses/list' + queries);
}

async function getBundlesList(
   filterObj?: Record<string, any> | false,
   page?: number
) {
   type AdminBundlesData = { bundles: TAdminTableBundleData[] };

   const queries = filterObjectToQueries({
      ...(filterObj ? filterObj : {}),
      ...{
         page: page || 1,
         pageSize,
      },
   });

   return fetchData<AdminBundlesData, true>('courses/bundle/list' + queries);
}

async function getCourseData(id: string) {
   type AdminCourseData = {
      course: TCourseDetailsData;
      schedule: TAdminTableClassScheduleData[];
      enrolled: boolean;
   };

   return fetchData<AdminCourseData, true>(`courses/load/${id}`);
}

async function getBundleData(id: string) {
   type AdminBundleData = {
      bundle: TBundleDetailsData;
      schedule: TAdminTableClassScheduleData[];
      enrolled: boolean;
   };

   return fetchData<AdminBundleData, true>(`courses/bundle/load/${id}`);
}

async function getCourseFullDetails(id: string) {
   type AdminCourseFullDetailsData = { course: TCourseUpdateDetailsData };

   return fetchData<AdminCourseFullDetailsData, true>(`courses/details/${id}`);
}

async function getBundleFullDetails(id: string) {
   type AdminBundleFullDetailsData = { bundle: TBundleUpdateDetailsData };

   return fetchData<AdminBundleFullDetailsData, true>(
      `courses/bundle/details/${id}`
   );
}

async function getCourseContents(id: string) {
   type AdminCourseContentsData = { content: TCourseContentData[] };

   return fetchData<AdminCourseContentsData, true>(
      `courses/content/list/${id}`
   );
}

async function getCourseStudents(id: string, page?: number) {
   type AdminCourseStudentsData = {
      students: TAdminCourseDetailsManageStudent[];
   };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<AdminCourseStudentsData, true>(
      `courses/load/${id}/students` + queries
   );
}

async function getBundleStudents(id: string, page?: number) {
   type AdminBundleStudentsData = {
      students: TAdminBundleDetailsManageStudent[];
   };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<AdminBundleStudentsData, true>(
      `courses/bundle/load/${id}/students` + queries
   );
}

export {
   getBundleData,
   getBundleFullDetails,
   getBundleStudents,
   getBundlesList,
   getCourseContents,
   getCourseData,
   getCourseFullDetails,
   getCourseStudents,
   getCoursesAndBundlesList,
   getCoursesList,
};
