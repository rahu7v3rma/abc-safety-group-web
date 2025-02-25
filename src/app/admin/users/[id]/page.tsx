import ErrorPage from '@/components/ErrorPage';
import UserProfile, {
   UserProfileProps,
} from '@/components/Users/Profile/Profile';
import * as adminUsersData from '@/data/admin/users';
import { isEnvTrue } from '@/lib/environment';
import { notFound } from 'next/navigation';

export default async function AdminUserProfile({
   params,
   searchParams,
}: {
   params: { id: string };
   searchParams: { [key: string]: string | string[] | undefined };
}) {
   const page = parseInt(searchParams?.page as string) || 1;

   const user = await adminUsersData.getUser(params.id);
   const allRoles = await adminUsersData.getAllRoles();

   if (user.success && user.payload) {
      let props: Omit<
         UserProfileProps,
         | 'data'
         | 'courses'
         | 'schedule'
         | 'transactions'
         | 'bundles'
         | 'certificates'
      > = {
         trainingConnect: isEnvTrue(
            process.env.ALLOW_TRAINING_CONNECT_UPLOAD_USER
         ),
         update: true,
         activateDeactivate: true,
         deleteButton: true,
         tables: ['Certificates'],
         page,
         user: user.payload.user,
      };
      if (allRoles.success) {
         props = {
            ...props,
            roleManagement: true,
            roles: user.payload.roles,
            allRoles: allRoles.payload.roles,
         };

         const certificates = await adminUsersData.getUserCertificates(
            params.id,
            page
         );

         return (
            <UserProfile
               data="certificates"
               certificates={certificates.payload}
               error={!certificates.success ? certificates.message : false}
               {...props}
            />
         );
      }
   } else if (user.message && user.message.includes('permissions')) {
      return <ErrorPage icon="User" title="User" message={user.message} />;
   }

   notFound();
}
