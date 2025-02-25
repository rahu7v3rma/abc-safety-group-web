'use client';

import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { TInstructorFormData } from '@/lib/types';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { toast } from 'sonner';

type StartQuizPostPayload = {
   courseId: string;
   seriesNumber: string;
   formId: string;
};

type StartQuizButtonProps = {
   selectedQuiz: TInstructorFormData;
   setSelectedQuiz: Dispatch<SetStateAction<TInstructorFormData | undefined>>;
};

const StartQuizButton = ({
   selectedQuiz,
   setSelectedQuiz,
}: StartQuizButtonProps) => {
   const { id: courseId, seriesNumber } = useParams<{
      id: string;
      seriesNumber: string;
   }>();

   const [startQuiz, startQuizLoading] = usePost<StartQuizPostPayload, any>(
      'instructor',
      ['forms', 'start', 'quiz'],
   );

   const StartQuiz = useCallback(() => {
      toast.promise(
         startQuiz(
            { courseId, seriesNumber, formId: selectedQuiz.formId },
            {
               success: () => {
                  setSelectedQuiz({ ...selectedQuiz, available: true });
               },
            },
            { throw: true },
         ),
         {
            loading: 'Starting quiz...',
            success: 'Started quiz!',
            error: 'Failed starting quiz',
         },
      );
   }, [courseId, seriesNumber, selectedQuiz, startQuiz, setSelectedQuiz]);

   return (
      <button
         className="primary-button"
         onClick={StartQuiz}
         disabled={startQuizLoading}
      >
         {startQuizLoading ? <Spinner /> : 'Start Quiz'}
      </button>
   );
};

export default StartQuizButton;
