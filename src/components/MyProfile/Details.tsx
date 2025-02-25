'use client';

import VisualizationTableButtonUpdate from '@/components/ui/VisualizationTable/Buttons/Update';
import { useUser } from '@/contexts/user';
import { getImageURL } from '@/lib/image';
import { TUserContextForce } from '@/lib/types';
import { ProfileCircle } from 'iconoir-react';
import Image from 'next/image';
import { FC } from 'react';

const AdminMyProfile: FC = () => {
   const { user } = useUser<TUserContextForce>();

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="font-semibold text-xl inline-flex tracking-tight items-center">
               <ProfileCircle
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               My profile
            </div>
            <VisualizationTableButtonUpdate />
         </div>
         <div className="mt-5 h-[1px] gap-5 bg-zinc-50 rounded-2xl border border-zinc-200 p-10 flex flex-col flex-grow overflow-auto">
            <div className="max-w-xl mx-auto w-full">
               <div>
                  <p className="text-2xl font-semibold tracking-tight">
                     Photos
                  </p>
                  <hr className="mt-4 mb-8 border-t border-zinc-200" />
                  <div className="grid grid-cols-2 gap-8">
                     <div className="w-full">
                        <div className="flex items-center justify-between">
                           <p className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                              Headshot
                           </p>
                        </div>
                        <Image
                           alt="Headshot"
                           src={getImageURL('users', user.headShot, 600)}
                           placeholder="blur"
                           blurDataURL={`/_next/image?url=${getImageURL(
                              'users',
                              user.headShot,
                              16
                           )}&w=16&q=1`}
                           width={600}
                           height={600}
                           className="w-full mt-2.5 h-64 animate-fadeIn !flex-grow-0 !flex-shrink-0 rounded-3xl object-cover"
                        />
                     </div>
                     <div></div>
                  </div>
                  <div className="mt-10 gap-8 grid grid-cols-2">
                     <div className="w-full">
                        <div className="flex items-center justify-between">
                           <p className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                              Government ID
                           </p>
                           <p className="font-medium tracking-tight text-sm py-1 px-2 rounded-lg bg-zinc-600/5 text-zinc-600">
                              000 000 000
                           </p>
                        </div>
                        <Image
                           alt="Government ID"
                           src={getImageURL('users', user.photoIdPhoto, 600)}
                           placeholder="blur"
                           blurDataURL={`/_next/image?url=${getImageURL(
                              'users',
                              user.photoIdPhoto,
                              16
                           )}&w=16&q=1`}
                           width={600}
                           height={600}
                           className="w-full animate-fadeIn mt-2.5 h-64 flex-grow-0 flex-shrink-0 rounded-3xl object-cover"
                        />
                     </div>
                     <div className="w-full">
                        <div className="flex items-center justify-between">
                           <p className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                              SST Card
                           </p>
                           <p className="font-medium tracking-tight text-sm py-1 px-2 rounded-lg bg-zinc-600/5 text-zinc-600">
                              00000000000
                           </p>
                        </div>
                        <Image
                           alt="SST Card"
                           src={getImageURL('users', user.otherIdPhoto, 600)}
                           placeholder="blur"
                           blurDataURL={`/_next/image?url=${getImageURL(
                              'users',
                              user.otherIdPhoto,
                              16
                           )}&w=16&q=1`}
                           width={600}
                           height={600}
                           className="w-full mt-2.5 h-64 animate-fadeIn !flex-grow-0 !flex-shrink-0 rounded-3xl object-cover"
                        />
                     </div>
                  </div>
                  <p className="mt-14 text-2xl font-semibold tracking-tight">
                     Personal details
                  </p>
                  <hr className="mt-4 mb-8 border-t border-zinc-200" />
                  <div className="grid grid-cols-2 gap-8">
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           Full name
                        </span>
                        <p className="mt-2.5 font-medium">
                           {user.firstName} {user.middleName} {user.lastName}{' '}
                           {user.suffix}
                        </p>
                     </div>
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           Email
                        </span>
                        <p className="mt-2.5 font-medium">{user.email}</p>
                     </div>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-8">
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           Phone number
                        </span>
                        <p className="mt-2.5 font-medium">{user.phoneNumber}</p>
                     </div>
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           Date of birth
                        </span>
                        <p className="mt-2.5 font-medium">{user.dob}</p>
                     </div>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-8">
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           State
                        </span>
                        <p className="mt-2.5 font-medium">{user.state}</p>
                     </div>
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           City
                        </span>
                        <p className="mt-2.5 font-medium">{user.city}</p>
                     </div>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-8">
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           Address
                        </span>
                        <p className="mt-2.5 font-medium">{user.address}</p>
                     </div>
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           Timezone
                        </span>
                        <p className="mt-2.5 font-medium">{user.timeZone}</p>
                     </div>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-8">
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           Gender
                        </span>
                        <p className="mt-2.5 font-medium">{user.gender}</p>
                     </div>
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           Eye color
                        </span>
                        <p className="mt-2.5 font-medium">{user.eyeColor}</p>
                     </div>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-8">
                     <div>
                        <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                           Height
                        </span>
                        <p className="mt-2.5 font-medium">
                           {user.height && user.height.feet}&apos;
                           {user.height && user.height.inches}&quot;
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminMyProfile;
