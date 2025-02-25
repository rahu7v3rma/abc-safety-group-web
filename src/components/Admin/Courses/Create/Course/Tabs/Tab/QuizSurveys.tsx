'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { NavArrowRight } from 'iconoir-react';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { useController, useForm } from 'react-hook-form';
import { z } from 'zod';
import { create } from 'zustand';

import DropdownListPaginated from '@/components/ui/DropdownListPaginated';
import { fetchQuizzes, fetchSurveys } from '@/data/pagination/forms';

export const quizSurveysSchema = z.object({
   quizzes: z.array(
      z.object({
         text: z.string(),
         value: z.string(),
      })
   ),
   surveys: z.array(
      z.object({
         text: z.string(),
         value: z.string(),
      })
   ),
});

export type quizSurveysSchemaType = z.infer<typeof quizSurveysSchema>;

export const quizSurveysStateDefault: quizSurveysSchemaType = {
   quizzes: [],
   surveys: [],
};

export const useQuizSurveys = create<
   { data: quizSurveysSchemaType } & { reset: () => void }
>()((set, get) => ({
   data: {
      ...quizSurveysStateDefault,
   },
   reset: () => {
      set({
         data: quizSurveysStateDefault,
      });
   },
}));

interface CourseQuizSurveysProps {
   tab: number;
   setTab: Dispatch<SetStateAction<number>>;
}

const CourseQuizSurveys: FC<CourseQuizSurveysProps> = ({ tab, setTab }) => {
   const quizSurveys = useQuizSurveys((state) => state.data);

   const {
      handleSubmit,
      register: registerForm,
      formState: { errors },
      control,
      watch,
      trigger,
   } = useForm<quizSurveysSchemaType>({
      resolver: zodResolver(quizSurveysSchema),
      values: quizSurveys,
   });

   useEffect(() => {
      const subscription = watch((value) => {
         useQuizSurveys.setState({
            data: value as quizSurveysSchemaType,
         });
      });
      return () => subscription.unsubscribe();
   }, [watch]);

   const {
      field: { value: quizzesValue, onChange: quizzesOnChange },
   } = useController({ name: 'quizzes', control });

   const {
      field: { value: surveysValue, onChange: surveysOnChange },
   } = useController({ name: 'surveys', control });

   function Continue() {
      setTab(tab + 1);
   }

   return (
      <form onSubmit={handleSubmit(Continue)} className="flex flex-col gap-7">
         <DropdownListPaginated
            trigger={trigger}
            required={false}
            label="Quizzes"
            values={quizzesValue || []}
            fetch={fetchQuizzes}
            onChange={quizzesOnChange}
            placeholder="Select a quiz..."
            error={errors.quizzes}
         />
         <DropdownListPaginated
            trigger={trigger}
            required={false}
            label="Surveys"
            values={surveysValue}
            fetch={fetchSurveys}
            onChange={surveysOnChange}
            placeholder="Select a survey..."
            error={errors.surveys}
         />
         <button
            onClick={() => setTab(tab + 1)}
            className="mt-10 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
         >
            Preview Certificate
            <NavArrowRight className="ml-2.5 h-5 w-5" strokeWidth={2} />
         </button>
      </form>
   );
};

export default CourseQuizSurveys;
