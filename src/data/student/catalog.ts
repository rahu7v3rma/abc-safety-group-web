import { TStudentTableCourseData, TStudentTableBundleData } from '@/lib/types';
import fetchData from '../fetch';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';

async function getCourses(page?: number) {
   type StudentCoursesData = { courses: TStudentTableCourseData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<StudentCoursesData, true>('courses/catalog' + queries);
}

async function getBundles(page?: number) {
   type StudentBundlesData = { bundles: TStudentTableBundleData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<StudentBundlesData, true>(
      'courses/bundle/catalog' + queries
   );
}

export { getCourses, getBundles };
