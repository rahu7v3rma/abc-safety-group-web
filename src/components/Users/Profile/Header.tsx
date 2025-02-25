import { getImageURL } from '@/lib/image';
import { TRoleData, TUserData } from '@/lib/types';
import clsx from 'clsx';
import { Mail, Phone } from 'iconoir-react';
import Image from 'next/image';
import { FC } from 'react';
import RoleManagement from './Buttons/RoleManagement';

interface UserHeaderProps {
   user: TUserData;
   roles?: TRoleData[];
   allRoles?: TRoleData[] | false;
   roleManagement?: boolean;
}

const UserHeader: FC<UserHeaderProps> = ({
   user,
   roles,
   allRoles,
   roleManagement,
}) => {
   return (
      <div className="flex items-start gap-x-10">
         <div className="mt-2.5 flex-grow-0 flex-shrink-0">
            <Image
               alt="Headshot"
               placeholder="blur"
               blurDataURL={`/_next/image?url=${getImageURL(
                  'users',
                  user.headShot,
                  16
               )}&w=16&q=1`}
               width={300}
               height={300}
               src={getImageURL('users', user.headShot, 300)}
               className="!w-32 !h-32 animate-fadeIn z-30 border border-zinc-200 !flex-grow-0 !flex-shrink-0 rounded-full object-cover"
            />
         </div>
         <div>
            <p className="text-2xl flex items-center font-semibold tracking-tight">
               {user.firstName} {user.middleName} {user.lastName} {user.suffix}{' '}
               <span
                  className={clsx(
                     'text-sm ml-2.5 font-medium py-0.5 px-2 rounded-lg',
                     user.active
                        ? 'text-green-500 bg-green-500/10'
                        : 'text-red-500 bg-red-500/10'
                  )}
               >
                  {user.active ? 'active' : 'deactivated'}
               </span>
            </p>
            {(!!user.email || !!user.phoneNumber) && (
               <div className="mt-4 flex flex-col gap-y-2">
                  {!!user.email && (
                     <p className="inline-flex items-center text-zinc-500 font-medium">
                        <span className="text-zinc-400">
                           <Mail className="h-5 w-5 mr-2" strokeWidth={2} />
                        </span>
                        {user.email}
                     </p>
                  )}
                  {!!user.phoneNumber && (
                     <p className="flex items-center text-zinc-500 font-medium">
                        <span className="text-zinc-400">
                           <Phone className="h-5 w-5 mr-2" strokeWidth={2} />
                        </span>
                        {user.phoneNumber}
                     </p>
                  )}
               </div>
            )}
            {roleManagement && (
               <RoleManagement user={user} roles={roles} allRoles={allRoles} />
            )}
         </div>
      </div>
   );
};

export default UserHeader;
