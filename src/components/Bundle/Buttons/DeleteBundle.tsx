import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { Trash } from 'iconoir-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { toast } from 'sonner';

const DeleteBundleButton: FC = ({}) => {
   const [confirmationOpen, setConfirmationOpen] = useState(false);

   const [bypassRegistationChecks, setBypassRegistrationChecks] =
      useState(false);

   const [deleteBundlePost, deleteBundlePostLoading] = usePost<
      { bundleIds: string[] },
      any
   >('courses', [
      'bundle',
      `delete${bypassRegistationChecks ? '?bypassChecks=true' : ''}`,
   ]);

   const { id: bundleId } = useParams<{ id: string }>();

   const router = useRouter();

   function DeleteCourse() {
      toast.promise(
         deleteBundlePost(
            { bundleIds: [bundleId] },
            {
               success: () => {
                  router.push('/admin/courses?table=Bundles');
                  router.refresh();
               },
            },
            { throw: true }
         ),
         {
            loading: `Deleting bundle...`,
            success: `Deleted bundle`,
            error: (error) => error.message,
         }
      );
   }

   return (
      <Confirmation
         title={`Delete bundle`}
         open={confirmationOpen}
         setDialogOpen={setConfirmationOpen}
         action={DeleteCourse}
      >
         <button
            disabled={deleteBundlePostLoading}
            className="px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm py-2 bg-gradient-to-b from-red-400 to-red-500 rounded-2xl shadow-inner-red"
         >
            Delete
            <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-red-600 rounded-[0.6rem]">
               {deleteBundlePostLoading ? (
                  <Spinner className="h-4 w-4" />
               ) : (
                  <Trash className="h-4 w-4" strokeWidth={2} />
               )}
            </span>
         </button>
      </Confirmation>
   );
};

export default DeleteBundleButton;
