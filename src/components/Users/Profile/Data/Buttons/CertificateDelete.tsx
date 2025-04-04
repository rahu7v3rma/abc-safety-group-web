import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import useSelectable from '@/hooks/useSelectable';
import { TStudentTableCertificateData } from '@/lib/types';
import { State } from '@hookstate/core';
import { Trash } from 'iconoir-react';
import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface DeleteButtonProps {
   certificates: State<TStudentTableCertificateData[], {}>;
   selectable: ReturnType<typeof useSelectable<TStudentTableCertificateData>>;
}

const DeleteButton: FC<DeleteButtonProps> = ({ certificates, selectable }) => {
   const [selected] = selectable;

   const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);

   const [deleteCertificatesPost, deleteCertificatesLoading] = usePost<
      { certificateNumbers: string[] },
      any
   >('admin', ['users', 'certificates', 'delete']);

   const deleteCertificates = useCallback(() => {
      const certificateNumbers = selected
         .get({ noproxy: true })
         .map((certificate) => certificate.certificateNumber);

      toast.promise(
         deleteCertificatesPost(
            {
               certificateNumbers,
            },
            {
               success: () => {
                  certificates.set((currentCertificates) =>
                     currentCertificates.filter(
                        (certificate) =>
                           !certificateNumbers.includes(
                              certificate.certificateNumber
                           )
                     )
                  );
                  selected.set([]);
               },
            },
            {
               throw: true,
            }
         ),
         {
            loading: `Deleting ${selected.length} certificate${
               selected.length > 1 ? 's' : ''
            }...`,
            success: `Success deleting ${selected.length} certificate${
               selected.length > 1 ? 's' : ''
            }`,
            error: `Failed deleting ${selected.length} certificate${
               selected.length > 1 ? 's' : ''
            }`,
         }
      );
   }, [certificates, deleteCertificatesPost, selected]);

   return (
      <Confirmation
         title={`Delete ${selected.length} certificate${
            selected.length > 1 ? 's' : ''
         }`}
         open={confirmationOpen}
         setDialogOpen={setConfirmationOpen}
         action={deleteCertificates}
      >
         <button
            disabled={!selectable[0].value.length || deleteCertificatesLoading}
            className="px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm py-2 bg-gradient-to-b from-red-400 to-red-500 rounded-2xl shadow-inner-red"
         >
            Delete
            <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-red-600 rounded-[0.6rem]">
               {deleteCertificatesLoading ? (
                  <Spinner className="h-4 w-4" />
               ) : (
                  <Trash className="h-4 w-4" strokeWidth={2} />
               )}
            </span>
         </button>
      </Confirmation>
   );
};

export default DeleteButton;
