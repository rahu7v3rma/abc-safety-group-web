'use client';

import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { TInstructorFormData } from '@/lib/types';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { toast } from 'sonner';

type StopQuizPostPayload = {
   courseId: string;
   seriesNumber: string;
   formId: string;
};

type StopQuizButtonProps = {
   selectedQuiz: TInstructorFormData;
   setSelectedQuiz: Dispatch<SetStateAction<TInstructorFormData | undefined>>;
};

const StopQuizButton = ({
   selectedQuiz,
   setSelectedQuiz,
}: StopQuizButtonProps) => {
   const { id: courseId, seriesNumber } = useParams<{
      id: string;
      seriesNumber: string;
   }>();

   const [stopQuiz, stopQuizLoading] = usePost<StopQuizPostPayload, any>(
      'instructor',
      ['forms', 'stop', 'quiz'],
   );

   const StopQuiz = useCallback(() => {
      toast.promise(
         stopQuiz(
            { courseId, seriesNumber, formId: selectedQuiz.formId },
            {
               success: () => {
                  setSelectedQuiz({ ...selectedQuiz, available: false });
               },
            },
            { throw: true },
         ),
         {
            loading: 'Stopping quiz...',
            success: 'Stopped quiz!',
            error: 'Failed stopping quiz',
         },
      );
   }, [courseId, seriesNumber, selectedQuiz, setSelectedQuiz, stopQuiz]);

   return (
      <button
         className="primary-button"
         onClick={StopQuiz}
         disabled={stopQuizLoading}
      >
         {stopQuizLoading ? <Spinner /> : 'Stop Quiz'}
      </button>
   );
};

export default StopQuizButton;
