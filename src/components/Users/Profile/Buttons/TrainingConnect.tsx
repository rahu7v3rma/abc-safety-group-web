'use client';

import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { TUserData } from '@/lib/types';
import { Import } from 'iconoir-react';
import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';

type TrainingConnectButtonProps = {
   user: TUserData;
};

interface ImportUser extends Omit<TUserData, 'height'> {
   height: string;
}

type ImportUserPayload = {
   students: ImportUser[];
};

const TrainingConnectButton: FC<TrainingConnectButtonProps> = ({ user }) => {
   const [importConfirmation, setImportConfirmation] = useState(false);

   const [importUser, importUserLoading] = usePost<
      ImportUserPayload & {
         uploadType: string;
      },
      any
   >('data', ['import', 'students']);

   const ImportTrainingConnect = useCallback(() => {
      toast.promise(
         importUser(
            {
               uploadType: 'upload_user',
               students: [
                  {
                     ...user,
                     height: `${user.height.feet}'${user.height.inches}"`,
                  },
               ],
            },
            {
               fail: console.log,
            },
            {
               throw: true,
            }
         ),
         {
            loading: `Importing user into training connect...`,
            success: `User imported`,
            error: 'Failed importing user',
         }
      );
   }, [importUser, user]);

   return (
      <Confirmation
         title="Import User Into Training Connect"
         open={importConfirmation}
         setDialogOpen={setImportConfirmation}
         action={ImportTrainingConnect}
      >
         <button
            onClick={() => setImportConfirmation(true)}
            className="px-5 w-48 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-indigo-800 font-semibold text-sm py-2 bg-gradient-to-b from-indigo-400 to-indigo-500 rounded-2xl shadow-inner-indigo"
         >
            Training Connect
            <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-indigo-600 rounded-[0.6rem]">
               {importUserLoading ? (
                  <Spinner className="h-4 w-4" />
               ) : (
                  <Import className="h-4 w-4" strokeWidth={2} />
               )}
            </span>
         </button>
      </Confirmation>
   );
};

export default TrainingConnectButton;
