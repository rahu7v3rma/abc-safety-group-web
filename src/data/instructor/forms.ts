import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import fetchData from '../fetch';
import { TInstructorFormData } from '@/lib/types';

export async function getFormsByCourseId(
   courseId: string,
   formType?: 'quiz' | 'survey',
   page?: number,
   filterObj?: Record<string, any>
) {
   type FormsData = { forms: TInstructorFormData[] };

   const queries = filterObjectToQueries({
      ...(filterObj ? filterObj : {}),
      formType,
      page: page || 1,
      pageSize,
   });

   return fetchData<FormsData, true>(`forms/list/${courseId}` + queries);
}
