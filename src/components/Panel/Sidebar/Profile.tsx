'use client';

import { LogOut } from 'iconoir-react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';

import Spinner from '@/components/ui/Spinner';
import { useRoles } from '@/contexts/roles';
import { useUser } from '@/contexts/user';
import usePost from '@/hooks/usePost';
import { getImageURL } from '@/lib/image';
import { contextState } from '@/lib/state';
import { TRolesContextForce, TUserContextForce } from '@/lib/types';
import clsx from 'clsx';
import Image from 'next/image';
import { useContext } from 'react';
import { PanelSidebarContext } from '.';

const Profile = () => {
   const { user, updateUser } = useUser<TUserContextForce>();
   const { updateRoles } = useRoles<TRolesContextForce>();

   const router = useRouter();

   const [logoutPost, loading] = usePost('users', 'logout');

   function logout() {
      logoutPost(undefined, {
         success: () => {
            updateUser(false);
            updateRoles(false);
            contextState.setState({
               user: false,
               roles: false,
            });
            Cookie.remove(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
            router.refresh();
            router.push('/login');
         },
         fail: (message) => {
            console.log(message);
         },
      });
   }

   const { collapsed } = useContext(PanelSidebarContext);

   return (
      <div
         className={clsx(
            'px-5 flex items-center justify-center',
            !collapsed && 'lg:px-8 lg:justify-between'
         )}
      >
         <div className={`flex items-center ${!collapsed && 'lg:gap-4'}`}>
            <Image
               alt="My picture"
               src={getImageURL('users', user.headShot, 300)}
               placeholder="blur"
               blurDataURL={`/_next/image?url=${getImageURL(
                  'users',
                  user.headShot,
                  16
               )}&w=16&q=1`}
               width={100}
               height={100}
               className="h-10 w-10 animate-fadeIn shadow-md object-cover rounded-full lg:h-14 lg:w-14"
            />
            <p
               className={clsx(
                  'hidden font-medium tracking-tight text-black',
                  !collapsed && 'lg:inline-block'
               )}
            >
               {user.firstName} {user.lastName}
            </p>
         </div>
         <button
            disabled={loading}
            onClick={logout}
            className={clsx(
               'hidden transition duration-200 disabled:cursor-not-allowed ease-linear',
               loading ? 'text-zinc-500' : 'text-red-500 hover:text-red-600',
               !collapsed && 'lg:block'
            )}
         >
            {loading ? (
               <Spinner className="h-6 w-6" />
            ) : (
               <LogOut className="h-6 w-6" strokeWidth={2} />
            )}
         </button>
      </div>
   );
};

export default Profile;
