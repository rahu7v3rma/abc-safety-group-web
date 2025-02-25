'use client';

import Link from 'next/link';
import { TInstructorFormData } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

type ViewSurveyButtonProps = {
   selectedSurvey: TInstructorFormData;
};

const ViewSurveyButton = ({ selectedSurvey }: ViewSurveyButtonProps) => {
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
         `survey/${selectedSurvey.formId}`
      );
   }, [router, courseId, seriesNumber, selectedSurvey]);

   return (
      <Link href={viewPath ?? '#'} className="primary-button">
         View Survey
      </Link>
   );
};

export default ViewSurveyButton;
