import { TFormQuizDetails, TFormSurveyDetails } from '@/lib/types';
import fetchData from '../fetch';
import { filterObjectToQueries } from '@/lib/helpers';

export async function getQuizData(
   id: string,
   filterObj?: Record<string, any>,
   ott?: string,
) {
   type QuizData = { form: TFormQuizDetails };

   const queries = filterObjectToQueries({
      showCorrect: false,
      ...(filterObj ? filterObj : {}),
   });

   return fetchData<QuizData, true>(
      `forms/quiz/load/${id}` + queries,
      {},
      false,
      ott,
   );
}

export async function getSurveyData(
   id: string,
   filterObj?: Record<string, any>,
   ott?: string,
) {
   type SurveyData = { form: TFormSurveyDetails };

   const queries = filterObjectToQueries({
      ...(filterObj ? filterObj : {}),
   });

   return fetchData<SurveyData, true>(
      `forms/survey/load/${id}` + queries,
      {},
      false,
      ott,
   );
}
