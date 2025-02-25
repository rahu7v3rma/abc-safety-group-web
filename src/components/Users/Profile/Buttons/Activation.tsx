import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { TUserData } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface UserButtonActivationProps {
   user: TUserData;
}

const UserButtonActivation: FC<UserButtonActivationProps> = ({ user }) => {
   const router = useRouter();

   const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

   const [deactivatePost, deactivateLoading] = usePost<undefined, {}>('admin', [
      'users',
      'deactivate',
      user.userId,
   ]);

   const [activatePost, activateLoading] = usePost<undefined, {}>('admin', [
      'users',
      'activate',
      user.userId,
   ]);

   const Deactivate = useCallback(() => {
      toast.promise(
         deactivatePost(
            undefined,
            {
               success: () => {
                  router.refresh();
               },
            },
            {
               throw: true,
            }
         ),
         {
            loading: `Deactivating user...`,
            success: `User deactivated!`,
            error: (e) => e.message,
         }
      );
   }, [deactivatePost, router, user]);

   const Activate = useCallback(() => {
      toast.promise(
         activatePost(
            undefined,
            {
               success: () => {
                  router.refresh();
               },
            },
            {
               throw: true,
            }
         ),
         {
            loading: `Activating user...`,
            success: `User activated!`,
            error: (e) => e.message,
         }
      );
   }, [activatePost, router, user]);

   if (user.active) {
      return (
         <Confirmation
            title="Deactivate user"
            open={showConfirmation}
            setDialogOpen={setShowConfirmation}
            action={Deactivate}
            severe={false}
         >
            <button
               disabled={deactivateLoading}
               className="disabled:cursor-not-allowed flex justify-center items-center disabled:opacity-75 bg-gradient-to-b from-orange-500 to-orange-600 text-sm transition duration-200 ease-linear border border-orange-800 shadow-inner-orange py-3.5 w-32 text-white font-semibold tracking-tight rounded-2xl"
            >
               {deactivateLoading ? (
                  <>
                     <Spinner className="h-5 w-5 mr-2 -ml-2" />
                     Deactivating
                  </>
               ) : (
                  'Deactivate'
               )}
            </button>
         </Confirmation>
      );
   }

   return (
      <Confirmation
         title="Activate user"
         open={showConfirmation}
         setDialogOpen={setShowConfirmation}
         action={Activate}
         severe={false}
      >
         <button
            disabled={activateLoading}
            className="disabled:cursor-not-allowed flex justify-center items-center disabled:opacity-75 bg-gradient-to-b from-green-500 to-green-600 text-sm transition duration-200 ease-linear border border-green-800 shadow-inner-green py-3.5 w-32 text-white font-semibold tracking-tight rounded-2xl"
         >
            {activateLoading ? (
               <>
                  <Spinner className="h-5 w-5 mr-2 -ml-2" />
                  Activating
               </>
            ) : (
               'Activate'
            )}
         </button>
      </Confirmation>
   );
};

export default UserButtonActivation;
