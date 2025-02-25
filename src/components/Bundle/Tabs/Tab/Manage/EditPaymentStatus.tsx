import Dialog from '@/components/ui/Dialog';
import Textarea from '@/components/ui/TextArea';
import usePost from '@/hooks/usePost';
import {
   TAdminBundleDetailsManageStudent,
   TAdminCourseDetailsManageStudentTable,
   TBundleDetailsData,
   TCourseDetailsData,
} from '@/lib/types';
import { State } from '@hookstate/core';
import { EditPencil } from 'iconoir-react';
import { Dispatch, FC, SetStateAction } from 'react';
import { toast } from 'sonner';
import Spinner from '@/components/ui/Spinner';
import { z } from 'zod';
import { useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Checkbox from '@/components/ui/Checkbox';
import { useRouter } from 'next/navigation';

const editPaymentStatusSchema = z.object({
   paid: z.boolean(),
   usingCash: z.boolean(),
});

type editPaymentStatusSchemaType = z.infer<typeof editPaymentStatusSchema>;

interface EditPaymentStatusProps {
   open: boolean;
   setOpen: Dispatch<SetStateAction<boolean>>;
   bundle: TBundleDetailsData;
   students: State<TAdminBundleDetailsManageStudent[], {}>;
   actionsStudent: State<false | TAdminBundleDetailsManageStudent, {}>;
}

const EditPaymentStatus: FC<EditPaymentStatusProps> = ({
   open,
   setOpen,
   bundle,
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
      control,
   } = useForm<editPaymentStatusSchemaType>({
      resolver: zodResolver(editPaymentStatusSchema),
      values: {
         paid: student ? student.paid ?? false : false,
         usingCash: student ? student.usingCash ?? false : false,
      },
   });

   const [EditPaymentStatusPost, EditPaymentStatusLoading] = usePost<
      {
         userId: string;
         registrationStatus?: string;
         paid: boolean;
         usingCash: boolean;
         notes?: string;
      },
      any
   >('courses', ['bundle', 'enroll', 'update', bundle.bundleId]);

   function Save(values: editPaymentStatusSchemaType) {
      if (student) {
         toast.promise(
            EditPaymentStatusPost(
               {
                  userId: student.userId,
                  paid: values.paid,
                  usingCash: values.usingCash,
               },
               {
                  success: () => {
                     router.refresh();
                     students.set((currentStudents) =>
                        currentStudents.map((st) => {
                           if (student && st.userId === student.userId) {
                              return {
                                 ...st,
                                 paid: values.paid,
                                 usingCash: values.usingCash,
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
               loading: 'Editing payment status',
               success: 'Edited payment status',
               error: (e) => {
                  return e.message;
               },
            }
         );
      }
   }

   const {
      field: { value: paidValue, onChange: paidOnChange },
   } = useController({ name: 'paid', control });
   const {
      field: { value: usingCashValue, onChange: usingCashOnChange },
   } = useController({ name: 'usingCash', control });

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
               Edit Payment Status
            </div>
            {student && (
               <p className="mt-2.5 tracking-tight font-medium text-zinc-500">
                  Edit payment status for{' '}
                  <span className="text-zinc-700">
                     {student.firstName} {student.lastName}
                  </span>
               </p>
            )}
            <div className="mt-10 flex items-center gap-10">
               <div className="flex items-center gap-2.5">
                  <Checkbox
                     id="studentPaid"
                     name="studentPaid"
                     checked={paidValue}
                     onCheckedChange={paidOnChange}
                     className="h-7 w-7 flex-shrink-0 flex-grow-0"
                     checkClassName="w-5 h-5"
                  />
                  <label
                     htmlFor="studentPaid"
                     className="text-zinc-600 font-medium tracking-tight"
                  >
                     Paid
                  </label>
               </div>
               <div className="flex items-center gap-2.5">
                  <Checkbox
                     id="studentUsingCash"
                     name="studentUsingCash"
                     checked={usingCashValue}
                     onCheckedChange={usingCashOnChange}
                     className="h-7 w-7 flex-shrink-0 flex-grow-0"
                     checkClassName="w-5 h-5"
                  />
                  <label
                     htmlFor="studentUsingCash"
                     className="text-zinc-600 font-medium tracking-tight"
                  >
                     Using Cash
                  </label>
               </div>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-2.5">
               <button
                  type="submit"
                  disabled={EditPaymentStatusLoading}
                  className="flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
               >
                  {!!EditPaymentStatusLoading && (
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

export default EditPaymentStatus;
