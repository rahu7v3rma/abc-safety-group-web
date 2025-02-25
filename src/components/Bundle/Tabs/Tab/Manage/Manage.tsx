'use client';

import { FC, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useHookstate } from '@hookstate/core';

import { BundleManageStudentsTableSchema } from './Schema';

import useSelectable from '@/hooks/useSelectable';
import usePost from '@/hooks/usePost';
import VisualizationTable from '@/components/ui/VisualizationTable';
import Confirmation from '@/components/ui/Confirmation';
import EditPaymentStatus from './EditPaymentStatus';
import EditNotes from './EditNotes';

import {
   APIResponsePagination,
   TAdminBundleDetailsManageStudent,
   TBundleDetailsData,
   TWithPagination,
} from '@/lib/types';
import EnrollStudents from './Buttons/EnrollStudents';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';

interface BundleManageProps {
   students:
      | TWithPagination<{ students: TAdminBundleDetailsManageStudent[] }>
      | false;
   bundle: TBundleDetailsData;
   page: number;
}

const BundleManage: FC<BundleManageProps> = ({
   students: studentsData,
   bundle,
   page,
}) => {
   const students = useUpdateHookstate<TAdminBundleDetailsManageStudent[]>(
      studentsData ? studentsData.students : []
   );
   const studentsPagination = useUpdateHookstate<APIResponsePagination | false>(
      studentsData ? studentsData.pagination : false
   );
   const selectable = useSelectable(students);
   const actionsStudent = useHookstate<
      TAdminBundleDetailsManageStudent | false
   >(false);

   const [editNotesOpen, setEditNotesOpen] = useState<boolean>(false);
   const [editPaymentStatusOpen, setEditPaymentStatusOpen] =
      useState<boolean>(false);
   const [
      deregisterStudentConfirmationOpen,
      setDeregisterStudentConfirmationOpen,
   ] = useState<boolean>(false);

   const [deregisterStudentPost] = usePost<
      { bundleId: string; userId: string },
      any
   >('courses', ['bundle', 'unenroll']);

   function deregisterStudent() {
      if (actionsStudent.value) {
         toast.promise(
            deregisterStudentPost(
               {
                  userId: actionsStudent.value.userId,
                  bundleId: bundle.bundleId,
               },
               {
                  success: () => {
                     students.set((currentStudents) =>
                        currentStudents.filter(
                           (s) =>
                              s.userId !==
                              (actionsStudent.value
                                 ? actionsStudent.value.userId
                                 : '')
                        )
                     );
                  },
               },
               { throw: true }
            ),
            {
               loading: 'Deregistering student',
               success: 'Deregistered student',
               error: (e) => {
                  return e.message;
               },
            }
         );
      }
   }

   BundleManageStudentsTableSchema.__root = {
      ...BundleManageStudentsTableSchema.__root,
      actions: (values) => {
         return {
            'Edit notes': () => {
               actionsStudent.set(JSON.parse(JSON.stringify(values)));
               setEditNotesOpen(true);
            },
            'Edit payment status': () => {
               actionsStudent.set(JSON.parse(JSON.stringify(values)));
               setEditPaymentStatusOpen(true);
            },
            'Deregister student': () => {
               actionsStudent.set(JSON.parse(JSON.stringify(values)));
               setDeregisterStudentConfirmationOpen(true);
            },
         };
      },
   };

   return (
      <>
         <VisualizationTable
            name="Students"
            data={students}
            pagination={studentsPagination}
            schema={BundleManageStudentsTableSchema}
            maxHeight="min-h-[20rem]"
            selectable={selectable}
            actionsClassName="bg-zinc-50 group-hover:bg-zinc-100 hover:!bg-zinc-50"
            buttons={[
               <EnrollStudents
                  key="enrollStudents"
                  students={students}
                  page={page}
                  bundle={bundle}
               />,
            ]}
            autoHeight
         />
         <EditNotes
            open={editNotesOpen}
            setOpen={setEditNotesOpen}
            bundle={bundle}
            students={students}
            actionsStudent={actionsStudent}
         />
         <EditPaymentStatus
            open={editPaymentStatusOpen}
            setOpen={setEditPaymentStatusOpen}
            bundle={bundle}
            students={students}
            actionsStudent={actionsStudent}
         />
         <Confirmation
            title="Deregister student"
            description={
               actionsStudent.value
                  ? `${actionsStudent.value.firstName} ${actionsStudent.value.lastName}`
                  : ''
            }
            action={deregisterStudent}
            open={deregisterStudentConfirmationOpen}
            setDialogOpen={setDeregisterStudentConfirmationOpen}
         />
      </>
   );
};

export default BundleManage;
