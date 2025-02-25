import BundleUpdate from '@/components/Admin/Courses/Update/Bundle/Update';
import * as adminCoursesData from '@/data/admin/courses';

const AdminCoursesUpdateBundle = async ({
   params,
}: {
   params: { id: string };
}) => {
   const details = await adminCoursesData.getBundleData(params.id);

   if (details.payload) {
      return <BundleUpdate bundle={details.payload.bundle} />;
   }

   return 'Failed to load bundle update';
};

export default AdminCoursesUpdateBundle;
