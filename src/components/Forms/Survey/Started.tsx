'use client';

import Confirmation from '@/components/ui/Confirmation';
import Note from '@/components/ui/Note';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import enums from '@/lib/enums';
import { alphabet } from '@/lib/helpers';
import {
   TStudentFormStartedAnswer,
   TStudentFormSurveyStarted,
   TStudentFormSurveyStartedQuestion,
   TStudentFormSurveyStartedQuestionChoice,
   TWithOTT,
} from '@/lib/types';
import clsx from 'clsx';
import { Check, PasteClipboard, Xmark } from 'iconoir-react';
import { useParams } from 'next/navigation';
import { FC, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import SurveyResults from './Results';

interface SurveyStartedProps {
   responseId: string;
   survey: TStudentFormSurveyStarted;
   surveyId: string;
}

const SurveyStarted: FC<TWithOTT<SurveyStartedProps>> = ({
   responseId,
   survey,
   surveyId,
   ott,
}) => {
   const params = useParams<{ id: string; seriesNumber: string }>();

   const [answers, setAnswers] = useState<TStudentFormStartedAnswer[]>([]);

   const [submitConfirmation, setSubmitConfirmation] = useState<boolean>(false);
   const [submitSurvey, submitSurveyLoading] = usePost<
      { responseId: string; questions: TStudentFormStartedAnswer[] },
      any
   >('forms', ['survey', 'submit', params.id, params.seriesNumber, surveyId]);

   const [results, setResults] = useState<false | any>(false);

   const SubmitSurvey = useCallback(() => {
      toast.promise(
         submitSurvey(
            {
               responseId,
               questions: answers,
            },
            {
               success: (data) => {
                  setResults(data);
               },
            },
            {
               throw: true,
               ott,
            }
         ),
         {
            loading: 'Submitting survey...',
            success: 'Survey submitted!',
            error: (e) => {
               return e.message;
            },
         }
      );
   }, [responseId, submitSurvey, answers]);

   function toggleAnswer(
      question: TStudentFormSurveyStartedQuestion,
      choice: TStudentFormSurveyStartedQuestionChoice
   ) {
      const findQuestion = answers.find((answer) => {
         return answer.questionId === question.questionId;
      });

      if (findQuestion) {
         setAnswers((currentAnswers) => [
            ...currentAnswers.filter((answer) => {
               if (answer.questionId === question.questionId) {
                  return false;
               }
               return true;
            }),
            {
               questionId: question.questionId,
               questionNumber: question.questionNumber,
               description: question.description,
               answerType: question.answerType,
               answer: {
                  choicePosition: choice.choicePosition,
                  description: choice.description,
               },
            },
         ]);
      } else {
         setAnswers((currentAnswers) => [
            ...currentAnswers,
            {
               questionId: question.questionId,
               questionNumber: question.questionNumber,
               description: question.description,
               answerType: question.answerType,
               answer: {
                  choicePosition: choice.choicePosition,
                  description: choice.description,
               },
            },
         ]);
      }
   }

   const isAnswer = useCallback(
      (
         question: TStudentFormSurveyStartedQuestion,
         choice: TStudentFormSurveyStartedQuestionChoice
      ) => {
         const findQuestion = answers.find((answer) => {
            return (
               answer.questionId === question.questionId &&
               choice.choicePosition === answer.answer.choicePosition
            );
         });

         return !!findQuestion;
      },
      [answers]
   );

   const questionsAnswered = useMemo(() => {
      return survey.questions
         .map((question) => {
            const findAnswer = answers.find(
               (answer) => answer.questionId === question.questionId
            );
            return !!findAnswer;
         })
         .filter((v) => v === true).length;
   }, [survey, answers]);

   return (
      <div className="flex flex-1 flex-col">
         <div className="flex items-center justify-between">
            <div className="inline-flex items-center text-xl font-semibold tracking-tight">
               <PasteClipboard
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               {survey.formName}
            </div>
         </div>
         <div className="mt-5 flex h-[1px] flex-grow flex-col gap-5 overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-10">
            {!!results ? (
               <SurveyResults survey={survey} />
            ) : (
               <div className="mx-auto w-full max-w-xl">
                  <Note text="Survey taking is in progress, do not exit, your changes will not be saved!" />
                  <div className="mt-10 flex flex-col gap-8">
                     {survey.questions.map((question) => (
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
                                    <button
                                       type="button"
                                       onClick={() =>
                                          toggleAnswer(question, choice)
                                       }
                                       className={clsx(
                                          'group flex w-16 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-100 py-3.5 font-medium transition duration-200 ease-linear',
                                          isAnswer(question, choice)
                                             ? clsx(
                                                  'border-blue-500 hover:border-red-500 hover:bg-red-500/10'
                                               )
                                             : 'hover:border-blue-500 hover:bg-blue-500/10'
                                       )}
                                    >
                                       <span
                                          className={clsx(
                                             'inline-block group-hover:hidden',
                                             isAnswer(question, choice) &&
                                                'font-medium text-blue-500'
                                          )}
                                       >
                                          {alphabet[choice.choicePosition]}
                                       </span>
                                       <span
                                          className={clsx(
                                             'hidden group-hover:inline-block',
                                             isAnswer(question, choice)
                                                ? 'text-red-500'
                                                : 'text-blue-500'
                                          )}
                                       >
                                          {isAnswer(question, choice) ? (
                                             <Xmark
                                                className="h-6 w-6"
                                                strokeWidth={2}
                                             />
                                          ) : (
                                             <Check
                                                className="h-6 w-6"
                                                strokeWidth={2}
                                             />
                                          )}
                                       </span>
                                    </button>
                                    <p
                                       className={clsx(
                                          'flex flex-1 items-center break-all rounded-xl border px-4 text-base font-medium outline-none transition duration-200 ease-linear',
                                          isAnswer(question, choice)
                                             ? 'border-blue-500 bg-blue-500 text-white'
                                             : 'border-zinc-300 bg-zinc-50 text-black'
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
                  <Confirmation
                     title="Submit survey"
                     description={
                        questionsAnswered < survey.questions.length
                           ? `You answered ${questionsAnswered} out of ${survey.questions.length} questions.`
                           : 'You answered all questions.'
                     }
                     open={submitConfirmation}
                     setDialogOpen={setSubmitConfirmation}
                     severe={true}
                     action={SubmitSurvey}
                     zIndex={10006}
                  >
                     <button
                        disabled={submitSurveyLoading}
                        onClick={() => setSubmitConfirmation(true)}
                        className="mt-10 flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 text-center font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-75"
                     >
                        Submit
                        {!!submitSurveyLoading && (
                           <Spinner className="ml-2.5 h-5 w-5" />
                        )}
                     </button>
                  </Confirmation>
               </div>
            )}
         </div>
      </div>
   );
};

export default SurveyStarted;
