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

type SendQuizLinkToClassPayload = {
   courseId: string;
   seriesNumber: string;
   formId: string;
   userId?: string[];
};

type SendQuizLinkToClassButtonProps = {
   selectedQuiz: TInstructorFormData;
};

const SendQuizLinkToClassButton = ({
   selectedQuiz,
}: SendQuizLinkToClassButtonProps) => {
   const { id: courseId, seriesNumber } = useParams<{
      id: string;
      seriesNumber: string;
   }>();

   const [sendQuizLink, sendQuizLinkLoading] = usePost<
      SendQuizLinkToClassPayload,
      any
   >('instructor', ['forms', 'send', 'quiz']);

   const [openConfirmation, setOpenConfirmation] = useState(false);
   const [sendQuizLinkToAllStudents, setSendQuizLinkToAllStudents] =
      useState(true);

   const [students, setStudents] = useState<DropdownOption[]>([]);

   const SendQuizLinkToClass = useCallback(() => {
      const payload: SendQuizLinkToClassPayload = {
         courseId,
         seriesNumber,
         formId: selectedQuiz.formId,
      };
      if (!sendQuizLinkToAllStudents) {
         payload.userId = students.map((student) => student.value);
      }
      toast.promise(sendQuizLink(payload, {}, { throw: true }), {
         loading: 'Sending quiz link...',
         success: 'Sent quiz link!',
         error: 'Failed sending quiz link',
      });
   }, [
      sendQuizLink,
      courseId,
      seriesNumber,
      selectedQuiz,
      sendQuizLinkToAllStudents,
      students,
   ]);

   return (
      <Confirmation
         open={openConfirmation}
         setDialogOpen={setOpenConfirmation}
         title="Send Quiz Link to Class"
         action={SendQuizLinkToClass}
         checkbox={{
            label: 'Send Quiz Link to All Students',
            checked: sendQuizLinkToAllStudents,
            setChecked: setSendQuizLinkToAllStudents,
         }}
         zIndex={0}
         content={
            !sendQuizLinkToAllStudents ? (
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
            disabled={sendQuizLinkLoading}
         >
            {sendQuizLinkLoading ? <Spinner /> : <>Send Quiz Link to Class</>}
         </button>
      </Confirmation>
   );
};

export default SendQuizLinkToClassButton;
