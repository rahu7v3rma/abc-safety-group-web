import * as adminCoursesData from '@/data/admin/courses';

import CourseUpdate from '@/components/Admin/Courses/Update/Course/Update';

const AdminCoursesUpdateCourse = async ({
   params,
}: {
   params: { id: string };
}) => {
   const details = await adminCoursesData.getCourseData(params.id);

   if (details.payload) {
      return <CourseUpdate course={details.payload.course} />;
   }

   return 'Failed to load course details';
};

export default AdminCoursesUpdateCourse;
