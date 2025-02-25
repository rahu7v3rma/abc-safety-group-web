import { ExpeditedRegisterCourseOrBundle } from '@/components/ExpeditedRegister/Schema';
import { DropdownPaginatedFetchReturn } from '@/components/ui/DropdownListPaginated';
import { getExpeditedStartDateList } from '../admin/expedited';

export const fetchExpeditedCourses = async (
   page: number,
   startDate: string
): Promise<DropdownPaginatedFetchReturn<ExpeditedRegisterCourseOrBundle>> => {
   const data = await getExpeditedStartDateList(
      {
         searchType: 'course',
         startDate,
      },
      page
   );

   if (data.success) {
      return {
         options: data.payload.found.map((course) => ({
            text: course.name,
            value: course.id,
            subtext: course.startDate,
         })),
         pagination: data.payload.pagination,
         data: data.payload.found,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};

export const fetchExpeditedBundles = async (
   page: number,
   startDate: string
): Promise<DropdownPaginatedFetchReturn<ExpeditedRegisterCourseOrBundle>> => {
   const data = await getExpeditedStartDateList(
      {
         searchType: 'bundle',
         startDate,
      },
      page
   );

   if (data.success) {
      return {
         options: data.payload.found.map((course) => ({
            text: course.name,
            value: course.id,
            subtext: course.startDate,
         })),
         pagination: data.payload.pagination,
         data: data.payload.found,
      };
   }

   return {
      options: false,
      pagination: false,
      data: false,
   };
};
