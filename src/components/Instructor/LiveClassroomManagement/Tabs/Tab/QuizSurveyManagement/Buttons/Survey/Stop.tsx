'use client';

import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { TInstructorFormData } from '@/lib/types';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { toast } from 'sonner';

type StopSurveyPostPayload = {
   courseId: string;
   seriesNumber: string;
   formId: string;
};

type StopSurveyButtonProps = {
   selectedSurvey: TInstructorFormData;
   setSelectedSurvey: Dispatch<SetStateAction<TInstructorFormData | undefined>>;
};

const StopSurveyButton = ({
   selectedSurvey,
   setSelectedSurvey,
}: StopSurveyButtonProps) => {
   const { id: courseId, seriesNumber } = useParams<{
      id: string;
      seriesNumber: string;
   }>();

   const [stopSurveyApi, stopSurveyApiLoading] = usePost<
      StopSurveyPostPayload,
      any
   >('instructor', ['forms', 'stop', 'survey']);

   const StopSurveyClick = useCallback(() => {
      toast.promise(
         stopSurveyApi(
            { courseId, seriesNumber, formId: selectedSurvey.formId },
            {
               success: () => {
                  setSelectedSurvey({ ...selectedSurvey, available: false });
               },
            },
            { throw: true },
         ),
         {
            loading: 'Stopping survey...',
            success: 'Stopped survey!',
            error: 'Failed stopping survey',
         },
      );
   }, [
      courseId,
      seriesNumber,
      selectedSurvey,
      setSelectedSurvey,
      stopSurveyApi,
   ]);

   return (
      <button
         className="primary-button"
         onClick={StopSurveyClick}
         disabled={stopSurveyApiLoading}
      >
         {stopSurveyApiLoading ? <Spinner /> : 'Stop Survey'}
      </button>
   );
};

export default StopSurveyButton;
