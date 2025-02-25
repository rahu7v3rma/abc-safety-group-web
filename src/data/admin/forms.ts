import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import { TAdminTableFormData } from '@/lib/types';
import fetchData from '../fetch';

async function getFormsList(page?: number) {
   type AdminFormsData = {
      forms: TAdminTableFormData[];
   };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<AdminFormsData, true>('forms/list' + queries);
}

async function getQuizzesList(
   filterObj?: Record<string, any> | false,
   page?: number,
) {
   type AdminQuizzesData = { forms: TAdminTableFormData[] };

   const queries = filterObjectToQueries({
      ...(filterObj ? filterObj : {}),
      ...{
         page: page || 1,
         pageSize,
      },
   });

   return fetchData<AdminQuizzesData, true>(`forms/list/quiz` + queries);
}

async function getSurveysList(
   filterObj?: Record<string, any> | false,
   page?: number,
) {
   type AdminSurveysData = { forms: TAdminTableFormData[] };

   const queries = filterObjectToQueries({
      ...(filterObj ? filterObj : {}),
      ...{
         page: page || 1,
         pageSize,
      },
   });

   return fetchData<AdminSurveysData, true>(`forms/list/survey` + queries);
}

export { getFormsList, getQuizzesList, getSurveysList };
