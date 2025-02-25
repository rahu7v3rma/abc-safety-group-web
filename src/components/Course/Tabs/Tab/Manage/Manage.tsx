'use client';

import { useHookstate } from '@hookstate/core';
import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CourseManageStudentsTableSchema } from './Schema';

import Confirmation from '@/components/ui/Confirmation';
import VisualizationTable from '@/components/ui/VisualizationTable';
import usePost from '@/hooks/usePost';
import useSelectable from '@/hooks/useSelectable';
import GenerateCertificates from './Buttons/GenerateCertificates';
import EditNotes from './EditNotes';
import EditPaymentStatus from './EditPaymentStatus';

import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import {
   APIResponsePagination,
   TAdminCourseDetailsManageStudent,
   TAdminCourseDetailsManageStudentTable,
   TCourseDetailsData,
   TWithPagination,
} from '@/lib/types';
import EnrollStudents from './Buttons/EnrollStudents';

interface CourseManageProps {
   students?: TWithPagination<{ students: TAdminCourseDetailsManageStudent[] }>;
   course: TCourseDetailsData;
   page: number;
}

const CourseManage: FC<CourseManageProps> = ({
   students: studentsData,
   course,
   page,
}) => {
   function getStudents() {
      if (studentsData) {
         return studentsData.students.map((s) => ({
            ...s,
            quizzes: `${s.quizzes.taken}/${s.quizzes.total}`,
            surveys: `${s.surveys.taken}/${s.surveys.total}`,
            signInSheet: `${s.signInSheet.amount}/${s.signInSheet.total}`,
         }));
      } else {
         return [];
      }
   }

   const students = useHookstate<TAdminCourseDetailsManageStudentTable[]>(
      getStudents()
   );

   useEffect(() => {
      students.set(getStudents());
   }, [studentsData]);

   const studentsPagination = useUpdateHookstate<APIResponsePagination | false>(
      studentsData ? studentsData.pagination : false
   );
   const selectable = useSelectable(students);
   const actionsStudent = useHookstate<
      TAdminCourseDetailsManageStudentTable | false
   >(false);

   const [editNotesOpen, setEditNotesOpen] = useState<boolean>(false);
   const [editPaymentStatusOpen, setEditPaymentStatusOpen] =
      useState<boolean>(false);
   const [
      deregisterStudentConfirmationOpen,
      setDeregisterStudentConfirmationOpen,
   ] = useState<boolean>(false);

   const [deregisterStudentPost] = usePost<
      { courseId: string; userId: string },
      any
   >('courses', 'unenroll');

   function deregisterStudent() {
      if (actionsStudent.value) {
         toast.promise(
            deregisterStudentPost(
               {
                  userId: actionsStudent.value.userId,
                  courseId: course.courseId,
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

   CourseManageStudentsTableSchema.__root = {
      ...CourseManageStudentsTableSchema.__root,
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
            schema={CourseManageStudentsTableSchema}
            maxHeight="min-h-[20rem]"
            selectable={selectable}
            actionsClassName="bg-zinc-50 group-hover:bg-zinc-100 hover:!bg-zinc-50"
            autoHeight
            buttons={[
               <EnrollStudents
                  key="enrollStudents"
                  students={students}
                  course={course}
                  page={page}
               />,
               <GenerateCertificates
                  key="generateCertificates"
                  students={students}
                  selectable={selectable}
                  course={course}
               />,
            ]}
         />
         <EditNotes
            open={editNotesOpen}
            setOpen={setEditNotesOpen}
            course={course}
            students={students}
            actionsStudent={actionsStudent}
         />
         <EditPaymentStatus
            open={editPaymentStatusOpen}
            setOpen={setEditPaymentStatusOpen}
            course={course}
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

export default CourseManage;
