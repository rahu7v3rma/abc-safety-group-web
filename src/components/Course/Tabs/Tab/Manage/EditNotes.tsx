import Dialog from '@/components/ui/Dialog';
import Textarea from '@/components/ui/TextArea';
import usePost from '@/hooks/usePost';
import {
   TAdminCourseDetailsManageStudentTable,
   TCourseDetailsData,
} from '@/lib/types';
import { State } from '@hookstate/core';
import { DesignPencil, EditPencil } from 'iconoir-react';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Spinner from '@/components/ui/Spinner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const editNotesSchema = z.object({
   notes: z.string(),
});

type editNotesSchemaType = z.infer<typeof editNotesSchema>;

interface EditNotesProps {
   open: boolean;
   setOpen: Dispatch<SetStateAction<boolean>>;
   course: TCourseDetailsData;
   students: State<TAdminCourseDetailsManageStudentTable[], {}>;
   actionsStudent: State<false | TAdminCourseDetailsManageStudentTable, {}>;
}

const EditNotes: FC<EditNotesProps> = ({
   open,
   setOpen,
   course,
   students,
   actionsStudent,
}) => {
   const router = useRouter();
   const student = actionsStudent.get({ noproxy: true });

   const {
      handleSubmit,
      register: registerForm,
      formState: { errors },
      reset,
   } = useForm<editNotesSchemaType>({
      resolver: zodResolver(editNotesSchema),
      values: {
         notes: student ? student.notes || '' : '',
      },
   });

   const [editNotesPost, editNotesLoading] = usePost<
      {
         userId: string;
         registrationStatus?: string;
         paid?: boolean;
         usingCash?: boolean;
         notes: string;
      },
      any
   >('courses', ['enroll', 'update', course.courseId]);

   function Save(values: editNotesSchemaType) {
      if (student) {
         toast.promise(
            editNotesPost(
               {
                  userId: student.userId,
                  notes: values.notes,
               },
               {
                  success: () => {
                     router.refresh();
                     students.set((currentStudents) =>
                        currentStudents.map((st) => {
                           if (student && st.userId === student.userId) {
                              return {
                                 ...st,
                                 notes: values.notes,
                              };
                           }
                           return st;
                        })
                     );
                     setOpen(false);
                  },
               },
               { throw: true }
            ),
            {
               loading: 'Editing notes',
               success: 'Edited notes',
               error: (e) => {
                  return e.message;
               },
            }
         );
      }
   }

   return (
      <Dialog
         open={open}
         onOpenChange={(value) => {
            if (!value) {
               reset();
            }
            setOpen(value);
         }}
      >
         <form onSubmit={handleSubmit(Save)}>
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <EditPencil
                  className="mr-4 h-7 w-7 text-blue-500"
                  strokeWidth={2}
               />
               Edit Notes
            </div>
            {actionsStudent.value && (
               <p className="mt-2.5 tracking-tight font-medium text-zinc-500">
                  Edit notes for{' '}
                  <span className="text-zinc-700">
                     {actionsStudent.value.firstName}{' '}
                     {actionsStudent.value.lastName}
                  </span>
               </p>
            )}
            <div className="mt-5 flex flex-col gap-5">
               <Textarea
                  required={false}
                  label="Notes"
                  error={errors.notes}
                  {...registerForm('notes')}
                  className="min-h-[10rem]"
               />
            </div>
            <div className="mt-10 grid grid-cols-2 gap-2.5">
               <button
                  type="submit"
                  disabled={editNotesLoading}
                  className="flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
               >
                  {!!editNotesLoading && (
                     <Spinner className="h-6 w-6 mr-2.5 opacity-50" />
                  )}
                  Save
               </button>
               <button
                  onClick={() => {
                     setOpen(false);
                  }}
                  type="button"
                  className="flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
               >
                  Cancel
               </button>
            </div>
         </form>
      </Dialog>
   );
};

export default EditNotes;
