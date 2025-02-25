import CourseDetails from '@/components/Course/Details';
import { CoursesCourseDetailsTabs } from '@/components/Course/Schema';
import ErrorPage from '@/components/ErrorPage';
import * as adminCoursesData from '@/data/admin/courses';
import { notFound } from 'next/navigation';

export default async function AdminCoursesCourseDetails({
   params,
   searchParams,
}: {
   params: { id: string };
   searchParams: { [key: string]: string | string[] | undefined };
}) {
   const page = parseInt(searchParams.page as string) || 1;

   const course = await adminCoursesData.getCourseData(params.id);

   let currentTab = (searchParams.tab as string) || CoursesCourseDetailsTabs[0];
   if (!CoursesCourseDetailsTabs.includes(currentTab)) {
      currentTab = CoursesCourseDetailsTabs[0];
   }

   if (course.success && course.payload.course) {
      const props = {
         enrolled: true,
         deleteButton: true,
         complete: true,
         publishUnpublish: false,
         modify: true,
         update: true,
         course: course.payload.course,
         schedule: course.payload.schedule,
         page,
         tab: currentTab,
      };

      return <CourseDetails {...props} />;
   } else if (course.message && course.message.includes('permissions')) {
      return <ErrorPage icon="Page" title="Course" message={course.message} />;
   }

   notFound();
}
