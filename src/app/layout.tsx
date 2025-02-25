import 'react-datepicker/dist/react-datepicker.css';
import './globals.css';

import { Inter } from 'next/font/google';

import SWRProvider from '@/components/SWRProvider';
import ToasterProvider from '@/components/ToasterProvider';
import config from '@/config';
import { PanelsProvider } from '@/contexts/panels';
import { PermissionsProvider } from '@/contexts/permissions';
import { RolesProvider } from '@/contexts/roles';
import { UserProvider } from '@/contexts/user';
import { AvailablePanels } from '@/lib/constants';
import { isEnvFalse } from '@/lib/environment';
import type {
   APIResponseSuccess,
   TPermissions,
   TRoles,
   TUser,
   TUserData,
} from '@/lib/types';
import axios from 'axios';
import clsx from 'clsx';
import { cookies } from 'next/dist/client/components/headers';

const inter = Inter({ subsets: ['latin'] });

async function getUserData(): Promise<{
   user: TUser;
   roles: TRoles;
   permissions: TPermissions;
}> {
   const cookieStore = cookies();
   const auth = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME as string);

   if (auth?.value) {
      return axios
         .get<
            APIResponseSuccess<{
               user: TUserData;
               roles: TRoles;
               permissions: TPermissions;
            }>
         >(config.api + 'users/me', {
            headers: {
               Authorization: `Bearer ${auth.value}`,
            },
         })
         .then((res) => res.data)
         .then((data) => {
            return data.payload;
         })
         .catch((err) => {
            return {
               user: false,
               roles: false,
               permissions: [],
            };
         });
   }

   return {
      user: false,
      roles: false,
      permissions: [],
   };
}

const getPanels = () => {
   let panels = [...AvailablePanels];
   if (isEnvFalse(process.env.ALLOW_STUDENT_PANEL)) {
      panels = panels.filter((panel) => panel !== 'student');
   }
   if (isEnvFalse(process.env.ALLOW_INSTRUCTOR_PANEL)) {
      panels = panels.filter((panel) => panel !== 'instructor');
   }
   return panels;
};

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, roles, permissions } = await getUserData();
   const panels = getPanels();

   return (
      <html lang="en">
         <body
            className={clsx(
               'flex min-h-screen w-full flex-col bg-zinc-100 antialiased',
               inter.className
            )}
         >
            <SWRProvider>
               <UserProvider user={user}>
                  <RolesProvider roles={roles}>
                     <PermissionsProvider permissions={permissions}>
                        <PanelsProvider panels={panels}>
                           {children}
                        </PanelsProvider>
                     </PermissionsProvider>
                  </RolesProvider>
               </UserProvider>
            </SWRProvider>
            <ToasterProvider />
         </body>
      </html>
   );
}
