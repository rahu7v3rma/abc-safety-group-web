import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { Trash } from 'iconoir-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { toast } from 'sonner';

const DeleteCourseButton: FC = ({}) => {
   const [confirmationOpen, setConfirmationOpen] = useState(false);

   const [bypassRegistationChecks, setBypassRegistrationChecks] =
      useState(false);

   const [deleteCoursePost, deleteCoursePostLoading] = usePost<
      { courseIds: string[] },
      any
   >('courses', [
      `delete${bypassRegistationChecks ? '?bypassChecks=true' : ''}`,
   ]);

   const { id: courseId } = useParams<{ id: string }>();

   const router = useRouter();

   function DeleteCourse() {
      toast.promise(
         deleteCoursePost(
            { courseIds: [courseId] },
            {
               success: () => {
                  router.back();
                  router.refresh();
               },
            },
            { throw: true }
         ),
         {
            loading: `Deleting course...`,
            success: `Deleted course`,
            error: (error) => error.message,
         }
      );
   }

   return (
      <Confirmation
         title={`Delete course`}
         open={confirmationOpen}
         setDialogOpen={setConfirmationOpen}
         action={DeleteCourse}
      >
         <button
            disabled={deleteCoursePostLoading}
            className="px-5 w-30 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm py-2 bg-gradient-to-b from-red-400 to-red-500 rounded-2xl shadow-inner-red"
         >
            Delete
            <span className="flex items-center justify-center h-8 w-8 ml-4 -mr-2 bg-red-600 rounded-[0.6rem]">
               {deleteCoursePostLoading ? (
                  <Spinner className="h-4 w-4" />
               ) : (
                  <Trash className="h-4 w-4" strokeWidth={2} />
               )}
            </span>
         </button>
      </Confirmation>
   );
};

export default DeleteCourseButton;
