import ErrorPage from '@/components/ErrorPage';
import ScheduleDetails from '@/components/Schedule/Details';
import { getScheduleDetails } from '@/data/global/schedule';
import { notFound } from 'next/navigation';

export default async function AdminCoursesCourseScheduleDetails({
   params,
}: {
   params: { id: string; seriesNumber: string };
}) {
   const schedule = await getScheduleDetails(params.id, params.seriesNumber);

   if (schedule.success && schedule.payload.details) {
      return (
         <ScheduleDetails
            schedule={schedule.payload.details}
            signInOut={false}
            manage={true}
         />
      );
   } else if (schedule.message && schedule.message.includes('permissions')) {
      return (
         <ErrorPage icon="Page" title="Schedule" message={schedule.message} />
      );
   }

   notFound();
}
