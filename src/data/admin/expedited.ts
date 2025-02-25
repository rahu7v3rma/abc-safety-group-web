import { ExpeditedRegisterCourseOrBundle } from '@/components/ExpeditedRegister/Schema';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import fetchData from '../fetch';

async function getExpeditedStartDateList(
   filterObj?: Record<string, any> | false,
   page?: number,
) {
   type AdminExpeditedStartDateList = {
      found: ExpeditedRegisterCourseOrBundle[];
   };

   const queries = filterObjectToQueries({
      ...(filterObj ? filterObj : {}),
      ...{
         page: page || 1,
         pageSize,
      },
   });

   return fetchData<AdminExpeditedStartDateList, true>(
      `admin/expedited-register/firstClass` + queries,
   );
}

// async function getExpeditedDateList() {
//    type AdminExpeditedDateListData = { startTimes: string[] };

//    return fetchData<AdminExpeditedDateListData, true>(
//       `admin/expedited-register/list`
//    );
// }

// async function getExpeditedCoursesList() {
//    type AdminExpeditedCoursesData = { courseNames: string[] };

//    return fetchData<AdminExpeditedCoursesData, true>(
//       `admin/expedited-register/course/distinct-names`
//    );
// }

// async function getExpeditedBundlesList() {
//    type AdminExpeditedBundlesData = { bundleNames: string[] };

//    return fetchData<AdminExpeditedBundlesData, true>(
//       `admin/expedited-register/bundle/distinct-names`
//    );
// }

export { getExpeditedStartDateList };
