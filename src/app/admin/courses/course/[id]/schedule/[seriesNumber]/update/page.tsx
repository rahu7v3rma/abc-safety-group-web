import ScheduleUpdate from '@/components/Schedule/Update';
import { getScheduleDetails } from '@/data/global/schedule';
import ErrorPage from '@/components/ErrorPage';
import { notFound } from 'next/navigation';

export default async function AdminCoursesCourseScheduleUpdate({
   params,
}: {
   params: { id: string; seriesNumber: string };
}) {
   const schedule = await getScheduleDetails(params.id, params.seriesNumber);

   if (schedule.success && schedule.payload.details) {
      return <ScheduleUpdate schedule={schedule.payload.details} />;
   } else if (schedule.message && schedule.message.includes('permissions')) {
      return (
         <ErrorPage icon="Page" title="Schedule" message={schedule.message} />
      );
   }

   notFound();
}
