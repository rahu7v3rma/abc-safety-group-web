'use client';

import VisualizationTableButtonUpdate from '@/components/ui/VisualizationTable/Buttons/Update';
import { CertificateData } from '@/data/admin/users';
import { TRoleData, TUserData, TWithPagination } from '@/lib/types';
import { User } from 'iconoir-react';
import { FC } from 'react';
import UserButtonActivation from './Buttons/Activation';
import UserButtonDelete from './Buttons/Delete';
import TrainingConnectButton from './Buttons/TrainingConnect';
import UserData from './Data/Data';
import UserDetails from './Details';
import UserHeader from './Header';
import UserPhotos from './Photos';

export type UserProfileProps = {
   user: TUserData;
   page: number;
   trainingConnect?: boolean;
   update?: boolean;
   activateDeactivate?: boolean;
   deleteButton?: boolean;
   tables?: string[];
   roleManagement?: boolean;
   roles?: TRoleData[];
   allRoles?: TRoleData[];
   error?: false | string;
} & {
   data: 'certificates';
   certificates?: TWithPagination<CertificateData>;
   courses?: never;
   schedule?: never;
   transactions?: never;
   bundles?: never;
};

const UserProfile: FC<UserProfileProps> = ({
   user,
   roles,
   allRoles,
   data,
   certificates,
   page,
   trainingConnect,
   update,
   activateDeactivate,
   deleteButton,
   roleManagement,
   tables,
   error,
}) => {
   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="font-semibold text-xl inline-flex tracking-tight items-center">
               <User className="mr-4 h-8 w-8 text-blue-500" strokeWidth={2} />
               User profile
            </div>
            <div className="flex items-center gap-2.5">
               {trainingConnect && <TrainingConnectButton user={user} />}
               {update && <VisualizationTableButtonUpdate />}
            </div>
         </div>
         <div className="mt-5 h-[1px] gap-5 bg-zinc-50 rounded-2xl border border-zinc-200 p-10 flex flex-col flex-grow overflow-auto">
            <div className="max-w-5xl mx-auto w-full">
               <div className="flex justify-between items-center">
                  <UserHeader
                     user={user}
                     roles={roles}
                     allRoles={allRoles}
                     roleManagement={roleManagement}
                  />
                  {(activateDeactivate || deleteButton) && (
                     <div className="flex flex-col gap-3">
                        {activateDeactivate && (
                           <UserButtonActivation user={user} />
                        )}
                        {deleteButton && <UserButtonDelete user={user} />}
                     </div>
                  )}
               </div>
               <UserPhotos user={user} />
               <UserDetails user={user} />
               <UserData
                  user={user}
                  data={data}
                  certificates={certificates}
                  page={page}
                  tables={tables}
                  error={error}
               />
            </div>
         </div>
      </div>
   );
};

export default UserProfile;
