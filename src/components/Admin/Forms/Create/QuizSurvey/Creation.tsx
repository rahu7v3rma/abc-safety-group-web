'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PasteClipboard, Upload } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import usePost from '@/hooks/usePost';
import QuizSurveyEditor, {
   quizSurveySchema,
   quizSurveySchemaType,
   quizSurveyState,
   quizSurveyStateDefault,
} from './Editor';

import SaveButton from '@/components/ui/Buttons/Save';
import Spinner from '@/components/ui/Spinner';
import {
   TAdminFormQuizDetailsQuestion,
   TQuizCreationData,
   TSurveyCreationData,
   TSurveyQuestionData,
} from '@/lib/types';

const QuizSurveyCreation = () => {
   const router = useRouter();

   const form = useForm<quizSurveySchemaType>({
      resolver: zodResolver(quizSurveySchema),
      values: quizSurveyStateDefault,
   });

   useEffect(() => {
      const subscription = form.watch((value) => {
         quizSurveyState.set(value as quizSurveySchemaType);
      });
      return () => subscription.unsubscribe();
   }, [form.watch]);

   const [questions, setQuestions] = useState<TAdminFormQuizDetailsQuestion[]>(
      []
   );

   const [createQuiz, quizLoading, quizError] = usePost<TQuizCreationData, any>(
      'forms',
      ['quiz', 'create']
   );
   const [createSurvey, surveyLoading, surveyError] = usePost<
      TSurveyCreationData,
      any
   >('forms', ['survey', 'create']);

   function Save(active: boolean = false) {
      if (quizSurveyState.formType.get() === 'Quiz') {
         toast.promise(
            createQuiz(
               {
                  formName: quizSurveyState.formName.value,
                  active,
                  passingPoints: quizSurveyState.passingPoints.value!,
                  questions: questions.map(
                     ({ questionId, ...question }, questionIndex) => ({
                        ...question,
                        pointValue: question.pointValue!,
                        questionNumber: questionIndex,
                        choices: question.choices!.map(
                           (choice, choiceIndex) => ({
                              ...choice,
                              choicePosition: choiceIndex,
                           })
                        ),
                     })
                  ),
                  attempts: quizSurveyState.attempts.value!,
                  duration: quizSurveyState.duration.value!,
               },
               {
                  success: () => {
                     router.push('/admin/forms');
                  },
               },
               { throw: true }
            ),
            {
               loading: 'Creating quiz...',
               success: 'Quiz created',
               error: 'Failed creating quiz',
            }
         );
      } else if (quizSurveyState.formType.get() === 'Survey') {
         toast.promise(
            createSurvey(
               {
                  formName: quizSurveyState.formName.value,
                  active,
                  questions: questions.map(
                     (
                        { questionId, pointValue, choices, ...question },
                        questionIndex
                     ) => {
                        let mapped: TSurveyQuestionData = {
                           ...question,
                           questionNumber: questionIndex,
                        };
                        if (choices && choices.length) {
                           mapped.choices = choices.map(
                              (choice, choiceIndex) => ({
                                 ...choice,
                                 choicePosition: choiceIndex,
                              })
                           );
                        }
                        return mapped;
                     }
                  ),
               },
               {
                  success: () => {
                     router.refresh();
                     router.push('/admin/forms');
                     router.refresh();
                  },
               },
               { throw: true }
            ),
            {
               loading: 'Creating survey...',
               success: 'Survey created',
               error: 'Failed creating survey',
            }
         );
      }
   }

   function Cancel() {
      router.push('/admin/forms');
   }

   const scoreLow = useMemo(() => {
      const [formType, passingPoints] = [
         quizSurveyState.formType.get(),
         quizSurveyState.passingPoints.get(),
      ];

      if (formType && questions.length && passingPoints) {
         const points = questions
            .map((q) => q.pointValue!)
            .reduce((b, a) => b + a);
         if (points < passingPoints) {
            return true;
         }
         return false;
      }
      return false;
   }, [quizSurveyState.formType.get(), questions]);

   const canSave = useMemo(() => {
      return !Object.keys(form.formState.errors).length && questions.length;
   }, [form.formState, questions]);

   return (
      <div className="relative flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <PasteClipboard
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Quiz/Survey creation
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={!canSave || quizLoading || surveyLoading}
                  onClick={form.handleSubmit(() => Save())}
                  loading={quizLoading || surveyLoading}
               />
               <button
                  disabled={!canSave}
                  onClick={form.handleSubmit(() => Save(true))}
                  className="px-5 w-48 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
               >
                  Save and Publish
                  <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                     {quizLoading || surveyLoading ? (
                        <Spinner className="h-4 w-4" />
                     ) : (
                        <Upload className="h-4 w-4" strokeWidth={2} />
                     )}
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
                  form={form}
                  questions={questions}
                  setQuestions={setQuestions}
                  scoreLow={scoreLow}
               />
            </div>
         </div>
      </div>
   );
};

export default QuizSurveyCreation;
