'use client';

import Link from 'next/link';
import { TInstructorFormData } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

type ViewQuizButtonProps = {
   selectedQuiz: TInstructorFormData;
};

const ViewQuizButton = ({ selectedQuiz }: ViewQuizButtonProps) => {
   const router = useRouter();

   const { id: courseId, seriesNumber } = useParams<{
      id: string;
      seriesNumber: string;
   }>();

   const viewPath = useMemo(() => {
      return (
         `/instructor/my-courses/` +
         `course/${courseId}/` +
         `schedule/${seriesNumber}/` +
         `quiz/${selectedQuiz.formId}`
      );
   }, [router, courseId, seriesNumber, selectedQuiz]);

   return (
      <Link href={viewPath ?? ''} className="primary-button hover:text-white">
         View Quiz
      </Link>
   );
};

export default ViewQuizButton;
