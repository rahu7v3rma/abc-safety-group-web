import { DropdownPaginatedFetchReturn } from '@/components/ui/DropdownListPaginated';
import { TAdminTableFormData, TInstructorFormData } from '@/lib/types';
import { getQuizzesList, getSurveysList } from '../admin/forms';
import { getFormsByCourseId } from '../instructor/forms';

export const fetchQuizzes = async (
   page: number
): Promise<DropdownPaginatedFetchReturn<TAdminTableFormData>> => {
   const data = await getQuizzesList({ active: true }, page);

   if (data.success) {
      return {
         options: data.payload.forms.map((quiz) => ({
            text: quiz.formName,
            value: quiz.formId,
         })),
         pagination: data.payload.pagination,
         data: data.payload.forms,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};

export const fetchSurveys = async (
   page: number
): Promise<DropdownPaginatedFetchReturn<TAdminTableFormData>> => {
   const data = await getSurveysList({ active: true }, page);

   if (data.success) {
      return {
         options: data.payload.forms.map((survey) => ({
            text: survey.formName,
            value: survey.formId,
         })),
         pagination: data.payload.pagination,
         data: data.payload.forms,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};

const fetchFormsByCourseId = async (
   courseId: string,
   page: number,
   formType: 'quiz' | 'survey'
): Promise<DropdownPaginatedFetchReturn<TInstructorFormData>> => {
   const data = await getFormsByCourseId(courseId, formType, page);

   if (data.success) {
      return {
         options: data.payload.forms.map((form) => ({
            text: form.formName,
            value: form.formId,
         })),
         pagination: data.payload.pagination,
         data: data.payload.forms,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};

export const fetchQuizzesByCourseId = async (
   courseId: string,
   page: number
) => {
   return await fetchFormsByCourseId(courseId, page, 'quiz');
};

export const fetchSurveysByCourseId = async (
   courseId: string,
   page: number
) => {
   return await fetchFormsByCourseId(courseId, page, 'survey');
};
