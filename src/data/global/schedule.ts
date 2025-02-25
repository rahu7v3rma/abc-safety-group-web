import { TScheduleDetailsData } from '@/lib/types';
import fetchData from '../fetch';

export async function getScheduleDetails(
   courseId: string,
   seriesNumber: string,
   ott?: string,
) {
   return fetchData<
      {
         details: TScheduleDetailsData;
      },
      true
   >(`courses/schedule/load/${courseId}/${seriesNumber}`, {}, false, ott);
}
