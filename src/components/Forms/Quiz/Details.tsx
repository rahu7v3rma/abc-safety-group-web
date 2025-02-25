'use client';

import clsx from 'clsx';
import { Circle, PageFlip } from 'iconoir-react';
import { FC, useCallback, useState } from 'react';

import Confirmation from '@/components/ui/Confirmation';
import VisualizationTableButtonStart from '@/components/ui/VisualizationTable/Buttons/Start';
import VisualizationTableButtonUpdate from '@/components/ui/VisualizationTable/Buttons/Update';
import enums from '@/lib/enums';
import { alphabet, minutesToHumanReadable } from '@/lib/helpers';
import {
   TFormQuizDetails,
   TStudentFormQuizStarted,
   TWithOTT,
} from '@/lib/types';
import QuizStarted from './Started';
import usePost from '@/hooks/usePost';
import { toast } from 'sonner';
import Spinner from '@/components/ui/Spinner';

type QuizDetailsProps = {
   quiz: TFormQuizDetails;
   showQuestions?: boolean;
   update?: boolean;
   start?: boolean;
   formId?: string;
   courseId?: string;
   seriesNumber?: number;
   external?: boolean;
};

const QuizDetails: FC<TWithOTT<QuizDetailsProps>> = ({
   quiz,
   update = false,
   showQuestions = false,
   start = true,
   formId,
   courseId,
   seriesNumber,
   external = false,
   ott,
}) => {
   const [started, setStarted] = useState<boolean>(false);
   const [quizStarted, setQuizStarted] = useState<TStudentFormQuizStarted>();
   const [quizResponseId, setQuizResponseId] = useState<string>('');

   const [confirmation, setConfirmation] = useState<boolean>(false);

   const [startQuiz, startQuizLoading] = usePost<
      { formId: string; courseId: string; seriesNumber: number },
      { form: TStudentFormQuizStarted; responseId: string }
   >('forms', ['start', 'quiz']);

   const StartQuiz = useCallback(() => {
      if (formId && courseId && seriesNumber) {
         toast.promise(
            startQuiz(
               {
                  formId,
                  courseId,
                  seriesNumber,
               },
               {
                  success: ({ form, responseId }) => {
                     setQuizStarted(form);
                     setQuizResponseId(responseId);
                     setStarted(true);
                  },
               },
               {
                  throw: true,
                  ott,
               },
            ),
            {
               loading: 'Starting quiz...',
               success: 'Quiz started!',
               error: (e) => {
                  return e.message;
               },
            },
         );
      }
   }, [startQuiz, formId, courseId, seriesNumber]);

   if (started && quizStarted && courseId && seriesNumber && formId) {
      return (
         <QuizStarted
            responseId={quizResponseId}
            quiz={quizStarted}
            courseId={courseId}
            seriesNumber={seriesNumber}
            quizId={formId}
            external={external}
            ott={ott}
         />
      );
   }

   return (
      <div className="flex flex-1 flex-col">
         <div className="flex items-center justify-between">
            <div className="inline-flex items-center text-xl font-semibold tracking-tight">
               <PageFlip
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Quiz details
            </div>
            {!!update && <VisualizationTableButtonUpdate />}
            {!!start && !started && (
               <VisualizationTableButtonStart
                  confirmationAction={StartQuiz}
                  confirmationTitle="Start quiz"
                  confirmationSevere={true}
                  confirmationDescription={`You have ${minutesToHumanReadable(
                     quiz.duration,
                  )} to complete this quiz.`}
                  loading={startQuizLoading}
                  disabled={startQuizLoading}
                  icon="Hourglass"
               />
            )}
         </div>
         <div
            className={clsx(
               'mt-5 flex flex-col gap-5 overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-10',
               !external ? 'h-[1px] flex-grow' : 'h-full',
            )}
         >
            <div className="mx-auto w-full max-w-xl">
               <div className="flex items-center gap-2.5">
                  <span className="rounded-lg bg-blue-500/10 px-2 py-1 text-sm font-medium tracking-tight text-blue-500">
                     Quiz
                  </span>
                  <span
                     className={clsx(
                        'rounded-lg px-2 py-1 text-sm font-medium tracking-tight',
                        quiz.active
                           ? 'bg-green-500/10 text-green-500'
                           : 'bg-red-500/10 text-red-500',
                     )}
                  >
                     {quiz.active ? 'Active' : 'Inactive'}
                  </span>
               </div>
               <p className="tacking-tight mt-5 text-xl font-semibold">
                  {quiz.formName}
               </p>
               <div className="mt-5">
                  <p className="text-zinc-500">
                     This quiz contains{' '}
                     <span className="font-medium tracking-tight text-black">
                        {quiz.questionsCount ?? 0} questions
                     </span>{' '}
                     and requires{' '}
                     <span className="mx-1 inline-flex items-center rounded-lg bg-green-500/10 px-2.5 py-1 text-sm font-medium tracking-tight text-green-500">
                        <Circle
                           fill="currentColor"
                           className="mr-1.5 h-3 w-3"
                           strokeWidth={2}
                        />
                        {quiz.passingPoints}
                     </span>{' '}
                     total points to pass.
                  </p>
               </div>
               <div className="mt-10 grid grid-cols-4">
                  <div>
                     <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                        Duration
                     </span>
                     <div className="mt-5">
                        <p className="inline-flex items-center gap-2 font-medium tracking-tight">
                           {minutesToHumanReadable(quiz.duration)}
                        </p>
                     </div>
                  </div>
                  <div>
                     <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                        Attempts
                     </span>
                     <div className="mt-5">
                        <p className="inline-flex items-center gap-2 font-medium tracking-tight">
                           {quiz.attempts}
                        </p>
                     </div>
                  </div>
               </div>
               {!!showQuestions && !!quiz.questions && (
                  <div className="mt-10 flex flex-col gap-8">
                     {quiz.questions.map((question) => (
                        <div
                           key={question.questionNumber}
                           className="w-full rounded-3xl border border-zinc-100 bg-white px-10 py-8 shadow"
                        >
                           <div className="flex flex-wrap gap-2.5">
                              <p className="inline-block rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                                 Question {question.questionNumber + 1}
                              </p>
                              <p className="inline-block rounded-lg bg-blue-500/10 px-2 py-1 text-sm font-medium tracking-tight text-blue-500">
                                 {enums[question.answerType]}
                              </p>
                              <p className="inline-flex items-center rounded-lg bg-green-500/10 px-2.5 py-1 text-sm font-medium tracking-tight text-green-500">
                                 <Circle
                                    className="mr-1.5 h-3 w-3"
                                    strokeWidth={2}
                                 />
                                 {question.pointValue}
                              </p>
                           </div>
                           <p className="mt-5 text-lg font-medium tracking-tight">
                              {question.description}
                           </p>
                           <div className="mt-8 flex flex-col gap-2.5">
                              {question.choices.map((choice) => (
                                 <div
                                    key={choice.choicePosition}
                                    className="flex gap-2.5"
                                 >
                                    <div className="group flex w-14 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-100 py-3 font-medium">
                                       <span
                                          className={clsx(
                                             'inline-block font-medium',
                                             (choice as any).isCorrect &&
                                                'text-green-500',
                                          )}
                                       >
                                          {alphabet[choice.choicePosition]}
                                       </span>
                                    </div>
                                    <p
                                       className={clsx(
                                          'flex-1 rounded-xl border px-4 py-3 text-base font-medium shadow-sm outline-none',
                                          (choice as any).isCorrect
                                             ? 'border-green-600 bg-green-600 text-white'
                                             : 'border-zinc-300 bg-zinc-50 text-black',
                                       )}
                                    >
                                       {choice.description}
                                    </p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
               {!!start && (
                  <Confirmation
                     title="Start quiz"
                     description={`You have ${minutesToHumanReadable(
                        quiz.duration,
                     )} to complete this quiz.`}
                     open={confirmation}
                     setDialogOpen={setConfirmation}
                     severe={true}
                     action={StartQuiz}
                  >
                     <button
                        onClick={() => setConfirmation(true)}
                        disabled={startQuizLoading}
                        className="mt-16 flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-4 text-center font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-75"
                     >
                        Start Quiz
                        {!!startQuizLoading && (
                           <Spinner className="ml-2.5 h-5 w-5" />
                        )}
                     </button>
                  </Confirmation>
               )}
            </div>
         </div>
      </div>
   );
};

export default QuizDetails;
