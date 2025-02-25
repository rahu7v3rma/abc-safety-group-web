import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { TUserData } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface UserButtonDeleteProps {
   user: TUserData;
}

const UserButtonDelete: FC<UserButtonDeleteProps> = ({ user }) => {
   const router = useRouter();

   const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

   const [deletePost, deleteLoading] = usePost<{ userIds: string[] }, {}>(
      'admin',
      ['users', 'delete']
   );

   const Delete = useCallback(() => {
      toast.promise(
         deletePost(
            { userIds: [user.userId] },
            {
               success: () => {
                  router.refresh();
                  setTimeout(() => {
                     router.push('/admin/users');
                  }, 100);
               },
            },
            {
               throw: true,
            }
         ),
         {
            loading: `Deleting user...`,
            success: `User deleted!`,
            error: (e) => e.message,
         }
      );
   }, [deletePost, user, router]);

   return (
      <Confirmation
         title="Delete user"
         open={showConfirmation}
         setDialogOpen={setShowConfirmation}
         action={Delete}
      >
         <button
            onClick={() => setShowConfirmation(true)}
            disabled={deleteLoading}
            className="disabled:cursor-not-allowed disabled:opacity-75 flex justify-center items-center bg-gradient-to-b from-red-500 to-red-600 py-3.5 text-sm transition duration-200 ease-linear border border-red-800 shadow-inner-red w-32 text-white font-semibold tracking-tight rounded-2xl"
         >
            {deleteLoading ? (
               <>
                  <Spinner className="h-5 w-5 mr-2 -ml-2" />
                  Deleting
               </>
            ) : (
               'Delete'
            )}
         </button>
      </Confirmation>
   );
};

export default UserButtonDelete;
