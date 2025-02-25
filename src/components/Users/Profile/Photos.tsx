import { getImageURL } from '@/lib/image';
import { TUserData } from '@/lib/types';
import Image from 'next/image';
import { FC } from 'react';

interface UserPhotosProps {
   user: TUserData;
}

const UserPhotos: FC<UserPhotosProps> = ({ user }) => {
   return (
      <>
         <div className="mt-14 mb-8 flex items-center gap-5">
            <p className="text-sm font-medium text-zinc-400">USER PHOTOS</p>
            <div className="flex-1 border-t border-zinc-200"></div>
         </div>
         <div className="grid grid-cols-3 gap-5">
            <div>
               <div className="flex items-center justify-between">
                  <p className="font-medium tracking-tight text-zinc-500">
                     Headshot
                  </p>
                  <p className="font-medium tracking-tight text-sm py-1 px-2">
                     &nbsp;
                  </p>
               </div>
               <Image
                  alt="Headshot"
                  placeholder="blur"
                  blurDataURL={`/_next/image?url=${getImageURL(
                     'users',
                     user.headShot,
                     16
                  )}&w=16&q=1`}
                  width={600}
                  height={600}
                  src={getImageURL('users', user.headShot, 600)}
                  className="w-full mt-2.5 h-64 z-30 animate-fadeIn border border-zinc-200 !flex-grow-0 !flex-shrink-0 rounded-3xl object-cover"
               />
            </div>
            <div>
               <div className="flex items-center justify-between">
                  <p className="font-medium tracking-tight text-zinc-500">
                     Government ID
                  </p>
                  <p className="font-medium tracking-tight text-sm py-1 px-2 rounded-lg bg-zinc-600/5 text-zinc-600">
                     000 000 000
                  </p>
               </div>
               <Image
                  alt="Government ID"
                  placeholder="blur"
                  blurDataURL={`/_next/image?url=${getImageURL(
                     'users',
                     user.photoIdPhoto,
                     16
                  )}&w=16&q=1`}
                  width={600}
                  height={600}
                  src={getImageURL('users', user.photoIdPhoto, 600)}
                  className="w-full mt-2.5 h-64 animate-fadeIn z-30 border border-zinc-200 !flex-grow-0 !flex-shrink-0 rounded-3xl object-cover"
               />
            </div>
            <div>
               <div className="flex items-center justify-between">
                  <p className="font-medium tracking-tight text-zinc-500">
                     SST Card
                  </p>
                  <p className="font-medium tracking-tight text-sm py-1 px-2 rounded-lg bg-zinc-600/5 text-zinc-600">
                     00000000000
                  </p>
               </div>
               <Image
                  alt="SST Card"
                  placeholder="blur"
                  blurDataURL={`/_next/image?url=${getImageURL(
                     'users',
                     user.otherIdPhoto,
                     16
                  )}&w=16&q=1`}
                  width={600}
                  height={600}
                  src={getImageURL('users', user.otherIdPhoto, 600)}
                  className="w-full mt-2.5 animate-fadeIn h-64 z-30 border border-zinc-200 !flex-grow-0 !flex-shrink-0 rounded-3xl object-cover"
               />
            </div>
         </div>
      </>
   );
};

export default UserPhotos;
