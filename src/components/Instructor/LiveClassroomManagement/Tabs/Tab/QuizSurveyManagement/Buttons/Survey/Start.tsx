'use client';

import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { TInstructorFormData } from '@/lib/types';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { toast } from 'sonner';

type StartSurveyPostPayload = {
   courseId: string;
   seriesNumber: string;
   formId: string;
};

type StartSurveyButtonProps = {
   selectedSurvey: TInstructorFormData;
   setSelectedSurvey: Dispatch<SetStateAction<TInstructorFormData | undefined>>;
};

const StartSurveyButton = ({
   selectedSurvey,
   setSelectedSurvey,
}: StartSurveyButtonProps) => {
   const { id: courseId, seriesNumber } = useParams<{
      id: string;
      seriesNumber: string;
   }>();

   const [startSurvey, startSurveyLoading] = usePost<
      StartSurveyPostPayload,
      any
   >('instructor', ['forms', 'start', 'survey']);

   const StartSurvey = useCallback(() => {
      toast.promise(
         startSurvey(
            { courseId, seriesNumber, formId: selectedSurvey.formId },
            {
               success: () => {
                  setSelectedSurvey({ ...selectedSurvey, available: true });
               },
            },
            { throw: true },
         ),
         {
            loading: 'Starting survey...',
            success: 'Started survey!',
            error: 'Failed starting survey',
         },
      );
   }, [courseId, seriesNumber, selectedSurvey, startSurvey, setSelectedSurvey]);

   return (
      <button
         className="primary-button"
         onClick={StartSurvey}
         disabled={startSurveyLoading}
      >
         {startSurveyLoading ? <Spinner /> : 'Start Survey'}
      </button>
   );
};

export default StartSurveyButton;
