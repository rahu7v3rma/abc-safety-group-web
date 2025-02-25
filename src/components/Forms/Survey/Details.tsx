'use client';

import clsx from 'clsx';
import { PasteClipboard } from 'iconoir-react';
import { FC, useCallback, useState } from 'react';

import enums from '@/lib/enums';
import { alphabet } from '@/lib/helpers';

import Confirmation from '@/components/ui/Confirmation';
import VisualizationTableButtonStart from '@/components/ui/VisualizationTable/Buttons/Start';
import VisualizationTableButtonUpdate from '@/components/ui/VisualizationTable/Buttons/Update';
import {
   TFormSurveyDetails,
   TStudentFormSurveyStarted,
   TWithOTT,
} from '@/lib/types';
import SurveyStarted from './Started';
import usePost from '@/hooks/usePost';
import { toast } from 'sonner';
import Spinner from '@/components/ui/Spinner';
import { useParams } from 'next/navigation';

interface SurveyDetailsProps {
   survey: TFormSurveyDetails;
   showQuestions?: boolean;
   update?: boolean;
   start?: boolean;
   formId?: string;
   external?: boolean;
}

const SurveyDetails: FC<TWithOTT<SurveyDetailsProps>> = ({
   survey,
   showQuestions,
   update = false,
   start = true,
   formId,
   external = false,
   ott,
}) => {
   const params = useParams<{ id: string; seriesNumber: string }>();

   const [started, setStarted] = useState<boolean>(false);
   const [surveyStarted, setSurveyStarted] =
      useState<TStudentFormSurveyStarted>();
   const [surveyResponseId, setSurveyResponseId] = useState<string>('');

   const [confirmation, setConfirmation] = useState<boolean>(false);

   const [startSurvey, startSurveyLoading] = usePost<
      { formId: string; courseId: string; seriesNumber: number },
      { form: TStudentFormSurveyStarted; responseId: string }
   >('forms', ['start', 'survey']);

   const StartSurvey = useCallback(() => {
      if (formId) {
         toast.promise(
            startSurvey(
               {
                  formId,
                  courseId: params.id,
                  seriesNumber: parseInt(params.seriesNumber),
               },
               {
                  success: ({ form, responseId }) => {
                     setSurveyStarted(form);
                     setSurveyResponseId(responseId);
                     setStarted(true);
                  },
               },
               {
                  throw: true,
                  ott,
               },
            ),
            {
               loading: 'Starting survey...',
               success: 'Survey started!',
               error: (e) => {
                  return e.message;
               },
            },
         );
      }
   }, [startSurvey, formId, params]);

   if (started && surveyStarted && formId) {
      return (
         <SurveyStarted
            responseId={surveyResponseId}
            survey={surveyStarted}
            surveyId={formId}
            ott={ott}
         />
      );
   }
   return (
      <div className="flex flex-1 flex-col">
         <div className="flex items-center justify-between">
            <div className="inline-flex items-center text-xl font-semibold tracking-tight">
               <PasteClipboard
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Survey details
            </div>
            {!!update && <VisualizationTableButtonUpdate />}
            {!!start && !started && (
               <VisualizationTableButtonStart
                  confirmationAction={StartSurvey}
                  confirmationTitle="Start survey"
                  confirmationSevere={false}
                  loading={startSurveyLoading}
                  disabled={startSurveyLoading}
                  icon="PasteClipboard"
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
                     Survey
                  </span>
                  <span
                     className={clsx(
                        'rounded-lg px-2 py-1 text-sm font-medium tracking-tight',
                        survey.active
                           ? 'bg-green-500/10 text-green-500'
                           : 'bg-red-500/10 text-red-500',
                     )}
                  >
                     {survey.active ? 'Active' : 'Inactive'}
                  </span>
               </div>
               <p className="tacking-tight mt-5 text-xl font-semibold">
                  {survey.formName}
               </p>
               <div className="mt-5">
                  <p className="text-zinc-500">
                     This survey contains{' '}
                     <span className="font-medium tracking-tight text-black">
                        {survey.questionsCount} questions
                     </span>{' '}
                  </p>
               </div>
               {!!showQuestions && !!survey.questions && (
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
                           {question.choices && question.choices.length && (
                              <div className="mt-8 flex flex-col gap-2.5">
                                 {question.choices.map((choice) => (
                                    <div
                                       key={choice.choicePosition}
                                       className="flex gap-2.5"
                                    >
                                       <div className="group flex w-14 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-100 py-3 font-medium">
                                          <span className="inline-block font-medium">
                                             {alphabet[choice.choicePosition]}
                                          </span>
                                       </div>
                                       <p className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-base font-medium text-black shadow-sm outline-none">
                                          {choice.description}
                                       </p>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               )}
               {!!start && (
                  <Confirmation
                     title="Start survey"
                     open={confirmation}
                     setDialogOpen={setConfirmation}
                     severe={false}
                     action={StartSurvey}
                  >
                     <button
                        disabled={startSurveyLoading}
                        onClick={() => setConfirmation(true)}
                        className="mt-16 flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-4 text-center font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-75"
                     >
                        Start Survey
                        {!!startSurveyLoading && (
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

export default SurveyDetails;
