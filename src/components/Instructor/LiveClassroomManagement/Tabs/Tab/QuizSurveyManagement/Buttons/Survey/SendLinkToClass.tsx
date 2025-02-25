'use client';

import Confirmation from '@/components/ui/Confirmation';
import { DropdownOption } from '@/components/ui/DropdownHook';
import DropdownListPaginated from '@/components/ui/DropdownListPaginated';
import Spinner from '@/components/ui/Spinner';
import { fetchStudents } from '@/data/pagination/courses';
import usePost from '@/hooks/usePost';
import { TInstructorFormData } from '@/lib/types';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type SendSurveyLinkToClassPayload = {
   courseId: string;
   seriesNumber: string;
   formId: string;
   userId?: string[];
};

type SendSurveyLinkToClassButtonProps = {
   selectedSurvey: TInstructorFormData;
};

const SendSurveyLinkToClassButton = ({
   selectedSurvey,
}: SendSurveyLinkToClassButtonProps) => {
   const { id: courseId, seriesNumber } = useParams<{
      id: string;
      seriesNumber: string;
   }>();

   const [sendSurveyLink, sendSurveyLinkLoading] = usePost<
      SendSurveyLinkToClassPayload,
      any
   >('instructor', ['forms', 'send', 'survey']);

   const [openConfirmation, setOpenConfirmation] = useState(false);
   const [sendSurveyLinkToAllStudents, setSendSurveyLinkToAllStudents] =
      useState(true);

   const [students, setStudents] = useState<DropdownOption[]>([]);

   const SendSurveyLinkToClass = useCallback(() => {
      const payload: SendSurveyLinkToClassPayload = {
         courseId,
         seriesNumber,
         formId: selectedSurvey.formId,
      };
      if (!sendSurveyLinkToAllStudents) {
         payload.userId = students.map((student) => student.value);
      }
      toast.promise(sendSurveyLink(payload, {}, { throw: true }), {
         loading: 'Sending survey link...',
         success: 'Sent survey link!',
         error: 'Failed sending survey link',
      });
   }, [
      sendSurveyLink,
      courseId,
      seriesNumber,
      selectedSurvey,
      sendSurveyLinkToAllStudents,
      students,
   ]);

   return (
      <Confirmation
         open={openConfirmation}
         setDialogOpen={setOpenConfirmation}
         title="Send Survey Link to Class"
         action={SendSurveyLinkToClass}
         checkbox={{
            label: 'Send Survey Link to All Students',
            checked: sendSurveyLinkToAllStudents,
            setChecked: setSendSurveyLinkToAllStudents,
         }}
         zIndex={0}
         content={
            !sendSurveyLinkToAllStudents ? (
               <div className="mt-4">
                  <DropdownListPaginated
                     label="Students"
                     values={students}
                     onChange={setStudents}
                     fetch={(page) =>
                        fetchStudents(courseId, seriesNumber, page)
                     }
                     placeholder="Select student..."
                     dropdownTriggerClassname="w-56"
                  />
               </div>
            ) : (
               <></>
            )
         }
      >
         <button
            className="primary-button"
            onClick={() => setOpenConfirmation(true)}
            disabled={sendSurveyLinkLoading}
         >
            {sendSurveyLinkLoading ? (
               <Spinner />
            ) : (
               <>Send Survey Link to Class</>
            )}
         </button>
      </Confirmation>
   );
};

export default SendSurveyLinkToClassButton;
