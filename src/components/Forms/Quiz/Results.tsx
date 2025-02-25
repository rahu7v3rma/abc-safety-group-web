import { getColorForPercentage } from '@/lib/helpers';
import {
   TStudentFormQuizStarted,
   TStudentFormQuizStartedSubmitResponse,
} from '@/lib/types';
import clsx from 'clsx';
import { intervalToDuration } from 'date-fns';
import { FC, useMemo } from 'react';
import { zeroPad } from 'react-countdown';

interface QuizResultsProps {
   quiz: TStudentFormQuizStarted;
   results: TStudentFormQuizStartedSubmitResponse;
   duration: false | number;
}

const QuizResults: FC<QuizResultsProps> = ({ quiz, results, duration }) => {
   const svgCircleR = 40;
   const circumference = svgCircleR * 2 * Math.PI;
   const percentage = Math.round((results.score / results.neededScore) * 100);
   const strokeOffset = circumference - (percentage / 100) * circumference;

   const formattedDuration = useMemo(() => {
      if (duration) {
         return intervalToDuration({ start: 0, end: duration });
      }
      return { minutes: 0, seconds: 0 };
   }, [duration]);

   return (
      <div className="m-auto flex w-full flex-col">
         <div className="flex items-center justify-center gap-x-2.5">
            <span
               className={clsx(
                  'rounded-lg bg-blue-500/10 px-2 py-1 text-sm font-medium tracking-tight text-blue-500',
               )}
            >
               Submitted
            </span>
            <span
               className={clsx(
                  'rounded-lg px-2 py-1 text-sm font-medium tracking-tight',
                  results.passing
                     ? 'bg-green-500/10 text-green-500'
                     : 'bg-red-500/10 text-red-500',
               )}
            >
               {results.passing ? 'Passed' : 'Not passing'}
            </span>
         </div>
         <p className="mt-5 text-center text-2xl font-semibold tracking-tight">
            {quiz.formName}
         </p>
         <div className="relative mx-auto mt-5 h-40 w-40">
            <svg className="h-full w-full" viewBox="0 0 100 100">
               <circle
                  className="text-zinc-200"
                  stroke-width="7"
                  stroke="currentColor"
                  r={svgCircleR}
                  cx={svgCircleR + 10}
                  cy={svgCircleR + 10}
                  fill="transparent"
               />
               <circle
                  className={getColorForPercentage(percentage)}
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-dasharray={circumference}
                  stroke-dashoffset={strokeOffset}
                  stroke="currentColor"
                  fill="transparent"
                  r={svgCircleR}
                  cx={svgCircleR + 10}
                  cy={svgCircleR + 10}
               />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <p
                  className={clsx(
                     'text-xl font-semibold',
                     getColorForPercentage(percentage),
                  )}
               >
                  {percentage}%
               </p>
            </div>
         </div>
         <div className="mx-auto mt-5 flex w-full max-w-[13rem] flex-col gap-y-2.5">
            <div className="flex items-center justify-between">
               <p className="font-medium tracking-tight text-zinc-500">
                  Points
               </p>
               <p
                  className={clsx(
                     results.passing ? 'text-green-500' : 'text-red-500',
                     'font-medium',
                  )}
               >
                  {results.score}
               </p>
            </div>
            <div className="flex items-center justify-between">
               <p className="font-medium tracking-tight text-zinc-500">
                  Passing points
               </p>
               <p className="font-medium text-green-500">
                  {results.neededScore}
               </p>
            </div>
            {!!duration && (
               <div className="flex items-center justify-between">
                  <p className="font-medium tracking-tight text-zinc-500">
                     Duration
                  </p>
                  <p className="font-medium text-zinc-600">
                     {zeroPad(formattedDuration.minutes ?? '0')}:
                     {zeroPad(formattedDuration.seconds ?? '0')}
                  </p>
               </div>
            )}
         </div>
         <div className="mt-10 text-center">
            <p className="text-zinc-500">
               {results.retake > 0 ? (
                  <>
                     You can retake this quiz{' '}
                     <span className="font-medium tracking-tight text-black">
                        {results.retake}
                     </span>{' '}
                     more time{results.retake > 1 ? 's' : ''}.
                  </>
               ) : (
                  <>You cannot retake this quiz.</>
               )}
            </p>
         </div>
      </div>
   );
};

export default QuizResults;
