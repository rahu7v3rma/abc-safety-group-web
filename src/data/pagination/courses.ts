import { filterObjectToQueries } from '@/lib/helpers';
import { getBundlesList, getCoursesList } from '../admin/courses';

import { DropdownPaginatedFetchReturn } from '@/components/ui/DropdownListPaginated';
import { pageSize } from '@/lib/pagination';
import {
   TAdminTableBundleData,
   TAdminTableCourseData,
   TInstructorStudentsData,
} from '@/lib/types';
import postData from '../post';
import { getStudents } from '../instructor/schedule';

export const fetchCourses = async (
   page: number,
   filterObj: Record<string, any> | false = false,
): Promise<DropdownPaginatedFetchReturn<TAdminTableCourseData>> => {
   const data = await getCoursesList(filterObj, page);

   if (data.success) {
      return {
         options: data.payload.courses.map((course) => ({
            text: course.courseName,
            value: course.courseId,
            subtext: course.startDate,
         })),
         pagination: data.payload.pagination,
         data: data.payload.courses,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};

export const searchFetchCourses = async (
   query: string,
   page: number,
   filterObj: Record<string, any> | false = false,
): Promise<DropdownPaginatedFetchReturn<TAdminTableCourseData>> => {
   const queries = filterObjectToQueries({
      ...(filterObj ? filterObj : {}),
      ...{
         page: page || 1,
         pageSize,
      },
   });

   const data = await postData<
      { courseName: string },
      { courses: TAdminTableCourseData[] },
      true
   >('courses/search' + queries, { courseName: query });

   if (data.success) {
      return {
         options: data.payload.courses.map((course) => ({
            text: course.courseName,
            value: course.courseId,
            subtext: course.startDate,
         })),
         pagination: data.payload.pagination,
         data: data.payload.courses,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};

export const fetchBundles = async (
   page: number,
   filterObj: Record<string, any> | false = false,
): Promise<DropdownPaginatedFetchReturn<TAdminTableBundleData>> => {
   const data = await getBundlesList(filterObj, page);

   if (data.success) {
      return {
         options: data.payload.bundles.map((bundle) => ({
            text: bundle.bundleId,
            value: bundle.bundleName,
            subtext: bundle.startDate,
         })),
         pagination: data.payload.pagination,
         data: data.payload.bundles,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};

export const searchFetchBundles = async (
   query: string,
   page: number,
   filterObj: Record<string, any> | false = false,
): Promise<DropdownPaginatedFetchReturn<TAdminTableBundleData>> => {
   const queries = filterObjectToQueries({
      ...(filterObj ? filterObj : {}),
      ...{
         page: page || 1,
         pageSize,
      },
   });

   const data = await postData<
      { courseBundle: string },
      { bundles: TAdminTableBundleData[] },
      true
   >('courses/search' + queries, { courseBundle: query });

   if (data.success) {
      return {
         options: data.payload.bundles.map((bundle) => ({
            text: bundle.bundleName,
            value: bundle.bundleId,
            subtext: bundle.startDate,
         })),
         pagination: data.payload.pagination,
         data: data.payload.bundles,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};

export const fetchStudents = async (
   courseId: string,
   seriesNumber: string,
   page: number,
): Promise<DropdownPaginatedFetchReturn<TInstructorStudentsData>> => {
   const data = await getStudents(courseId, seriesNumber, page);

   if (data.success) {
      return {
         options: data.payload.students.map((student) => ({
            text: `${student.firstName} ${student.lastName}`,
            value: student.userId,
         })),
         pagination: data.payload.pagination,
         data: data.payload.students,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};
