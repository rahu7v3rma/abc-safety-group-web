'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ClipboardCheck, EyeClosed, Upload } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import usePost from '@/hooks/usePost';
import QuizSurveyEditor, {
   quizSurveySchema,
   quizSurveySchemaType,
   quizSurveyState,
} from '../../Create/QuizSurvey/Editor';

import Confirmation from '@/components/ui/Confirmation';
import {
   TAdminFormSurveyDetailsQuestion,
   TFormSurveyDetails,
   TSurveyUpdateData,
} from '@/lib/types';

interface SurveyUpdateProps {
   survey: TFormSurveyDetails;
}

const SurveyUpdate: FC<SurveyUpdateProps> = ({ survey }) => {
   const router = useRouter();

   const form = useForm<quizSurveySchemaType>({
      resolver: zodResolver(quizSurveySchema),
      values: {
         formName: survey.formName,
         formType: 'Survey',
      },
   });

   useEffect(() => {
      quizSurveyState.set({
         formName: survey.formName,
         formType: 'Survey',
      });
   }, []);

   useEffect(() => {
      const subscription = form.watch((value) => {
         quizSurveyState.set(value as quizSurveySchemaType);
      });
      return () => subscription.unsubscribe();
   }, [form.watch]);

   const [questions, setQuestions] = useState<
      TAdminFormSurveyDetailsQuestion[]
   >(survey.questions || []);

   const [updateQuiz, quizLoading, quizError] = usePost<TSurveyUpdateData, any>(
      'forms',
      ['survey', 'update']
   );

   function Update(active: boolean = false) {
      toast.promise(
         updateQuiz(
            {
               formId: survey.formId,
               formName: quizSurveyState.formName.value,
               active,
               questions: questions.map((question, questionIndex) => ({
                  ...question,
                  pointValue: question.pointValue!,
                  questionNumber: questionIndex,
                  ...(question.choices
                     ? {
                          choices: question.choices!.map(
                             (choice, choiceIndex) => ({
                                ...choice,
                                choicePosition: choiceIndex,
                             })
                          ),
                       }
                     : {}),
               })),
            },
            {
               success: () => {
                  router.refresh();
                  router.push('/admin/forms/survey/' + survey.formId);
               },
            },
            { throw: true }
         ),
         {
            loading: 'Updating survey...',
            success: 'Survey updated',
            error: 'Failed updating survey',
         }
      );
   }

   function Cancel() {
      router.push('/admin/forms/survey/' + survey.formId);
   }

   const canUpdate = useMemo(() => {
      const quizSurveyCheck = quizSurveySchema.safeParse(quizSurveyState.get());

      return !!quizSurveyCheck.success && questions.length;
   }, [quizSurveyState.get(), questions]);

   const [openPublishButtonConfirmation, setOpenPublishButtonConfirmation] =
      useState(false);

   const [openUnpublishButtonConfirmation, setOpenUnpublishButtonConfirmation] =
      useState(false);

   return (
      <div className="relative flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <ClipboardCheck
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Survey update
            </div>
            <div className="flex items-center gap-2.5">
               {survey.active ? (
                  <Confirmation
                     open={openUnpublishButtonConfirmation}
                     setDialogOpen={setOpenUnpublishButtonConfirmation}
                     title="Update and Unpublish"
                     description="This survey will not be available on all of its associated courses."
                     action={form.handleSubmit(() => Update(false))}
                     severe={false}
                  >
                     <button
                        onClick={() => setOpenUnpublishButtonConfirmation(true)}
                        disabled={!canUpdate}
                        className="px-5 w-56 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
                     >
                        Update and Unpublish
                        <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                           <EyeClosed className="h-4 w-4" strokeWidth={2} />
                        </span>
                     </button>
                  </Confirmation>
               ) : (
                  <Confirmation
                     open={openPublishButtonConfirmation}
                     setDialogOpen={setOpenPublishButtonConfirmation}
                     title="Update and Publish"
                     description="This survey will be available on all of its associated courses."
                     action={form.handleSubmit(() => Update(true))}
                     severe={false}
                  >
                     <button
                        onClick={() => setOpenPublishButtonConfirmation(true)}
                        disabled={!canUpdate}
                        className="px-5 w-52 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
                     >
                        Update and Publish
                        <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                           <Upload className="h-4 w-4" strokeWidth={2} />
                        </span>
                     </button>
                  </Confirmation>
               )}
               <button
                  disabled={!canUpdate}
                  onClick={() => Update(survey.active)}
                  className="px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
               >
                  Update
                  <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                     <Check className="h-4 w-4" strokeWidth={2} />
                  </span>
               </button>
               <button
                  onClick={Cancel}
                  className="px-5 py-3.5 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm bg-gradient-to-b from-red-500 to-red-600 rounded-2xl shadow-inner-red"
               >
                  Cancel
               </button>
            </div>
         </div>
         <div className="flex mt-5 flex-grow gap-5 h-[1px]">
            <div className="w-full p-10 overflow-auto relative rounded-2xl bg-zinc-50 border border-zinc-200">
               <QuizSurveyEditor
                  locked
                  form={form}
                  questions={questions}
                  setQuestions={setQuestions}
                  scoreLow={false}
               />
            </div>
         </div>
      </div>
   );
};

export default SurveyUpdate;
