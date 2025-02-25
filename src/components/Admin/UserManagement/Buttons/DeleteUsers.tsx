import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import useSelectable from '@/hooks/useSelectable';
import { TAdminTableUserManagementData } from '@/lib/types';
import { State } from '@hookstate/core';
import { UserXmark } from 'iconoir-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';

interface DeleteUsersProps {
   users: State<TAdminTableUserManagementData[], {}>;
   selectable: ReturnType<typeof useSelectable<TAdminTableUserManagementData>>;
}

const DeleteUsers: FC<DeleteUsersProps> = ({ users, selectable }) => {
   const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);

   const [deleteUsersPost, deleteUsersLoading] = usePost<
      { userIds: string[] },
      any
   >('admin', ['users', 'delete']);

   function deleteUsers() {
      const [selected] = selectable;
      const userIds = selected
         .get({ noproxy: true })
         .map((user) => user.userId);

      toast.promise(
         deleteUsersPost(
            {
               userIds,
            },
            {
               success: () => {
                  users.set((currentUsers) =>
                     currentUsers.filter(
                        (user) => !userIds.includes(user.userId)
                     )
                  );
                  selected.set([]);
               },
               fail: (message, payload) => {
                  console.log(message, payload);
               },
            },
            {
               throw: true,
            }
         ),
         {
            loading: `Deleting ${selected.length} user${
               selected.length > 1 ? 's' : ''
            }...`,
            success: `Deleted ${selected.length} user${
               selected.length > 1 ? 's' : ''
            }`,
            error: (e) => {
               return e.message;
            },
         }
      );
   }

   return (
      <Confirmation
         title="Delete users"
         open={confirmationOpen}
         setDialogOpen={setConfirmationOpen}
         action={deleteUsers}
      >
         <button
            disabled={!selectable[0].value.length || deleteUsersLoading}
            className="px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm py-2 bg-gradient-to-b from-red-400 to-red-500 rounded-2xl shadow-inner-red"
         >
            Delete
            <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-red-600 rounded-[0.6rem]">
               {deleteUsersLoading ? (
                  <Spinner className="h-4 w-4" />
               ) : (
                  <UserXmark className="h-4 w-4" strokeWidth={2} />
               )}
            </span>
         </button>
      </Confirmation>
   );
};

export default DeleteUsers;
