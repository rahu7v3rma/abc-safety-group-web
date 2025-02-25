import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import useSelectable from '@/hooks/useSelectable';
import { TAdminTableCourseData } from '@/lib/types';
import { State } from '@hookstate/core';
import { UserXmark } from 'iconoir-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';

interface DeleteCoursesProps {
   courses: State<TAdminTableCourseData[], {}>;
   selectable: ReturnType<typeof useSelectable<TAdminTableCourseData>>;
}

const DeleteCourses: FC<DeleteCoursesProps> = ({ courses, selectable }) => {
   const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);

   const [deleteCoursesPost, deleteCoursesLoading] = usePost<
      { courseIds: string[] },
      any
   >('courses', 'delete');

   function deleteCourses() {
      const [selected] = selectable;
      const courseIds = selected
         .get({ noproxy: true })
         .map((course) => course.courseId);

      toast.promise(
         deleteCoursesPost(
            {
               courseIds,
            },
            {
               success: () => {
                  courses.set((currentCourses) =>
                     currentCourses.filter(
                        (course) => !courseIds.includes(course.courseId)
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
            loading: `Deleting ${selected.length} course${
               selected.length > 1 ? 's' : ''
            }...`,
            success: `Deleted ${selected.length} course${
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
         title="Delete courses"
         open={confirmationOpen}
         setDialogOpen={setConfirmationOpen}
         action={deleteCourses}
      >
         <button
            disabled={!selectable[0].value.length || deleteCoursesLoading}
            className="px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm py-2 bg-gradient-to-b from-red-400 to-red-500 rounded-2xl shadow-inner-red"
         >
            Delete
            <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-red-600 rounded-[0.6rem]">
               {deleteCoursesLoading ? (
                  <Spinner className="h-4 w-4" />
               ) : (
                  <UserXmark className="h-4 w-4" strokeWidth={2} />
               )}
            </span>
         </button>
      </Confirmation>
   );
};

export default DeleteCourses;
