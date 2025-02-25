import AdminUserUpdateComponent from '@/components/Admin/Users/Update';
import ErrorPage from '@/components/ErrorPage';
import * as adminUsersData from '@/data/admin/users';
import { isEnvTrue } from '@/lib/environment';
import { notFound } from 'next/navigation';

export default async function AdminUserUpdate({
   params,
}: {
   params: { id: string };
}) {
   const user = await adminUsersData.getUser(params.id);

   if (user.success && user.payload) {
      const isUserStudent = !!user.payload.roles.find(
         (role) => role.roleName === 'student'
      );

      return (
         <AdminUserUpdateComponent
            user={user.payload.user}
            uploadToTrainingConnect={
               isEnvTrue(process.env.ALLOW_TRAINING_CONNECT_UPDATE_USER) &&
               isUserStudent
            }
         />
      );
   } else if (user.message && user.message.includes('permissions')) {
      return <ErrorPage icon="User" title="User" message={user.message} />;
   }

   notFound();
}
