import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import {
   TAdminTableUserManagementData,
   TRoleData,
   TStudentTableBundleData,
   TStudentTableCertificateData,
   TStudentTableCourseData,
   TStudentTableScheduleData,
   TStudentTableTransactionData,
   TUserData,
} from '@/lib/types';
import fetchData from '../fetch';

async function getAllUsers(page?: number) {
   type UserData = { users: TAdminTableUserManagementData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<UserData, true>(`users/all` + queries);
}

async function getUser(id: string) {
   type UserData = { user: TUserData; roles: TRoleData[] };

   return fetchData<UserData, true>(`users/profile/${id}`);
}

export type CertificateData = { certificates: TStudentTableCertificateData[] };

async function getUserCertificates(id: string, page?: number) {
   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<CertificateData, true>(
      `users/certificates/${id}` + queries
   );
}

export type CourseData = { courses: TStudentTableCourseData[] };

async function getUserCourses(id: string, page?: number) {
   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<CourseData, true>(`users/courses/${id}` + queries);
}

export type ScheduleData = { schedule: TStudentTableScheduleData[] };

async function getUserSchedule(id: string, page?: number) {
   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<ScheduleData, true>(`users/schedule/${id}` + queries);
}

export type TransactionData = { transactions: TStudentTableTransactionData[] };

async function getUserTransactions(id: string, page?: number) {
   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<TransactionData, true>(`transactions/list/${id}` + queries);
}

export type BundleData = { bundles: TStudentTableBundleData[] };

async function getUserBundles(id: string, page?: number) {
   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<BundleData, true>(`users/bundles/${id}` + queries);
}

export type RoleData = { roles: TRoleData[] };

async function getAllRoles() {
   return fetchData<RoleData, true>(`admin/roles/list`);
}

export {
   getAllRoles,
   getAllUsers,
   getUser,
   getUserBundles,
   getUserCertificates,
   getUserCourses,
   getUserSchedule,
   getUserTransactions,
};
