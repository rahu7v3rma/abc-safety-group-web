'use client';

import { FC, useMemo, useState } from 'react';

import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import useSelectable from '@/hooks/useSelectable';
import {
   TAdminCertificatesGeneratePostPayload,
   TAdminCourseDetailsManageStudentTable,
   TCourseDetailsData,
} from '@/lib/types';
import { State } from '@hookstate/core';
import { Plus } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface GenerateCertificatesProps {
   students: State<TAdminCourseDetailsManageStudentTable[], {}>;
   selectable: ReturnType<typeof useSelectable<any>>;
   course: TCourseDetailsData;
}

const GenerateCertificates: FC<GenerateCertificatesProps> = ({
   students,
   selectable,
   course,
}) => {
   const router = useRouter();

   const [uploadCertificates, setUploadCertificates] = useState<boolean>(false);
   const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
   const [selected, { removeSelectAll }] = selectable;

   const [generateCertificatesPost, generateCertificatesLoading] = usePost<
      TAdminCertificatesGeneratePostPayload,
      any
   >('admin', ['users', 'certificates', 'generate']);

   const selectedStudents = (
      selected.get({
         noproxy: true,
      }) as TAdminCourseDetailsManageStudentTable[]
   ).filter((s) => !s.certificate);

   function generateCertificates() {
      const userIds = selectedStudents.map((u) => u.userId);

      toast.promise(
         generateCertificatesPost(
            {
               courseId: course.courseId,
               userIds,
               uploadCertificates,
            },
            {
               success: () => {
                  router.refresh();
                  students.set((currentStudents) =>
                     currentStudents.map((st) => {
                        if (userIds.includes(st.userId)) {
                           return {
                              ...st,
                              certificate: true,
                           };
                        }
                        return st;
                     })
                  );
                  removeSelectAll();
               },
            },
            { throw: true }
         ),
         {
            loading: `Generating certificates for ${selectedStudents.length} students`,
            success: `Generated certificates for ${selectedStudents.length} students`,
            error: (e) => {
               return e.message;
            },
         }
      );
   }

   const canGenerate = useMemo(() => {
      return !!selectedStudents.filter((st) => st.certificate !== true).length;
   }, [selectedStudents]);

   return (
      <>
         <button
            disabled={!canGenerate}
            onClick={() => {
               setConfirmationOpen(true);
            }}
            className="px-5 w-[13.5rem] inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue gap-2"
         >
            Generate Certificates
            <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
               {generateCertificatesLoading ? (
                  <Spinner className="h-5 w-5" />
               ) : (
                  <Plus className="h-5 w-5" strokeWidth={2} />
               )}
            </span>
         </button>
         <Confirmation
            title="Generate Certificates"
            description={
               selectedStudents ? `${selectedStudents.length} students` : ''
            }
            action={generateCertificates}
            open={confirmationOpen}
            setDialogOpen={setConfirmationOpen}
            checkbox={{
               checked: uploadCertificates,
               setChecked: setUploadCertificates,
               label: 'Upload to training connect',
            }}
            severe={false}
         />
      </>
   );
};

export default GenerateCertificates;
