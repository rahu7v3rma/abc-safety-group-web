import { TStudentFormSurveyStarted } from '@/lib/types';
import clsx from 'clsx';
import { FC } from 'react';

interface SurveyResultsProps {
   survey: TStudentFormSurveyStarted;
}

const SurveyResults: FC<SurveyResultsProps> = ({ survey }) => {
   return (
      <div className="m-auto">
         <div className="flex items-center justify-center gap-x-2.5">
            <span
               className={clsx(
                  'rounded-lg bg-blue-500/10 px-2 py-1 text-sm font-medium tracking-tight text-blue-500',
               )}
            >
               Submitted
            </span>
         </div>
         <p className="mt-5 text-center text-2xl font-semibold tracking-tight">
            {survey.formName}
         </p>
         <p className="mt-5 text-zinc-500">Thank you for taking this survey</p>
      </div>
   );
};

export default SurveyResults;
