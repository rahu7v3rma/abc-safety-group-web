import BundleDetails from '@/components/Bundle/Details';
import { CoursesBundleDetailsTabs } from '@/components/Bundle/Schema';
import ErrorPage from '@/components/ErrorPage';
import * as adminCoursesData from '@/data/admin/courses';
import { notFound } from 'next/navigation';

export default async function AdminCoursesBundleDetails({
   params,
   searchParams,
}: {
   params: { id: string };
   searchParams: { [key: string]: string | string[] | undefined };
}) {
   const page = parseInt(searchParams.page as string) || 1;

   const bundle = await adminCoursesData.getBundleData(params.id);
   const students = await adminCoursesData.getBundleStudents(params.id, page);

   let currentTab = (searchParams.tab as string) || CoursesBundleDetailsTabs[0];
   if (!CoursesBundleDetailsTabs.includes(currentTab)) {
      currentTab = CoursesBundleDetailsTabs[0];
   }

   if (bundle.payload && bundle.payload.bundle) {
      return (
         <BundleDetails
            tab={currentTab}
            bundle={bundle.payload.bundle}
            schedule={bundle.payload.schedule}
            students={students.payload ? students.payload : false}
            deleteButton={true}
            publishUnpublish={false}
            registration={false}
            enrolled={bundle.payload.enrolled}
            complete={true}
            page={page}
         />
      );
   } else if (bundle.message && bundle.message.includes('permissions')) {
      return (
         <ErrorPage icon="Folder" title="Bundle" message={bundle.message} />
      );
   }

   notFound();
}
