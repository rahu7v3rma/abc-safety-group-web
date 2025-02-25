import * as adminCoursesData from '@/data/admin/courses';

import AdminCourseManagementAllTable from '@/components/Admin/CourseManagement/AllTable';
import AdminCourseManagementBundlesTable from '@/components/Admin/CourseManagement/BundlesTable';
import AdminCourseManagementCoursesTable from '@/components/Admin/CourseManagement/CoursesTable';

export default async function AdminCoursesManagement({
   searchParams,
}: {
   searchParams: { [key: string]: string | string[] | undefined };
}) {
   const page = parseInt(searchParams.page as string) || 1;

   if (!searchParams.table || searchParams.table === 'All') {
      const coursesAndBundlesData =
         await adminCoursesData.getCoursesAndBundlesList(false, page);

      return (
         <AdminCourseManagementAllTable
            page={page}
            data={
               coursesAndBundlesData.success
                  ? coursesAndBundlesData.payload.found
                  : []
            }
            pagination={
               coursesAndBundlesData.success
                  ? coursesAndBundlesData.payload.pagination
                  : false
            }
            error={
               !coursesAndBundlesData.success
                  ? coursesAndBundlesData.message
                  : false
            }
         />
      );
   } else if (searchParams.table === 'Bundles') {
      const bundlesData = await adminCoursesData.getBundlesList(false, page);

      return (
         <AdminCourseManagementBundlesTable
            page={page}
            data={bundlesData.success ? bundlesData.payload.bundles : []}
            pagination={
               bundlesData.success ? bundlesData.payload.pagination : false
            }
            error={!bundlesData.success ? bundlesData.message : false}
         />
      );
   } else if (searchParams.table === 'Courses') {
      const coursesData = await adminCoursesData.getCoursesList(false, page);

      return (
         <AdminCourseManagementCoursesTable
            page={page}
            data={coursesData.success ? coursesData.payload.courses : []}
            pagination={
               coursesData.success ? coursesData.payload.pagination : false
            }
            error={!coursesData.success ? coursesData.message : false}
         />
      );
   }
}
