import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import {
   TInstructorTableStudentManagementData,
   TStudentTableCourseData,
   TStudentTableScheduleData,
   TUserData,
} from '@/lib/types';
import fetchData from '../fetch';

export async function getStudentsList(page?: number) {
   type StudentsData = { users: TInstructorTableStudentManagementData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<StudentsData, true>('users/student' + queries);
}

export async function getStudent(id: string) {
   type UserData = { user: TUserData };

   return fetchData<UserData, true>(`users/profile/${id}`);
}

export type CourseData = { courses: TStudentTableCourseData[] };

export async function getStudentCourses(id: string, page?: number) {
   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<CourseData, true>(`users/courses/${id}` + queries);
}

export type ScheduleData = { schedule: TStudentTableScheduleData[] };

export async function getStudentSchedule(id: string, page?: number) {
   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<ScheduleData, true>(`users/schedule/${id}` + queries);
}
