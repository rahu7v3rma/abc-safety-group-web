import * as adminAdminsData from '@/data/admin/admins';
import * as adminInstructorsData from '@/data/admin/instructors';
import * as adminStudentsData from '@/data/admin/students';
import * as adminUsersData from '@/data/admin/users';

import AdminAdminManagementTable from '@/components/Admin/UserManagement/AdminsTable';
import AdminUserManagementAllUsersTable from '@/components/Admin/UserManagement/AllUsersTable';
import AdminInstructorManagementTable from '@/components/Admin/UserManagement/InstructorsTable';
import AdminStudentManagementTable from '@/components/Admin/UserManagement/StudentsTable';

export default async function AdminUserManagement({
   searchParams,
}: {
   searchParams: { [key: string]: string | string[] | undefined };
}) {
   const page = parseInt(searchParams.page as string) || 1;

   if (!searchParams.table || searchParams.table === 'All') {
      const all = await adminUsersData.getAllUsers(page);

      return (
         <AdminUserManagementAllUsersTable
            data={all.success ? all.payload.users : []}
            pagination={all.success ? all.payload.pagination : false}
            error={!all.success ? all.message : false}
            page={page}
         />
      );
   } else if (searchParams.table === 'Students') {
      const students = await adminStudentsData.getStudentsList(page);

      return (
         <AdminStudentManagementTable
            data={students.success ? students.payload.users : []}
            pagination={students.success ? students.payload.pagination : false}
            error={!students.success ? students.message : false}
            page={page}
         />
      );
   } else if (searchParams.table === 'Instructors') {
      const instructors = await adminInstructorsData.getInstructorsList(page);

      return (
         <AdminInstructorManagementTable
            data={instructors.success ? instructors.payload.users : []}
            pagination={
               instructors.success ? instructors.payload.pagination : false
            }
            error={!instructors.success ? instructors.message : false}
            page={page}
         />
      );
   } else if (searchParams.table === 'Admins') {
      const admins = await adminAdminsData.getAdminsList(page);

      return (
         <AdminAdminManagementTable
            data={admins.success ? admins.payload.users : []}
            pagination={admins.success ? admins.payload.pagination : false}
            error={!admins.success ? admins.message : false}
            page={page}
         />
      );
   }
}
