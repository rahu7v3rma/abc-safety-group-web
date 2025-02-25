import AdminClassScheduleTable from '@/components/Admin/ClassSchedule/Table';
import * as adminScheduleData from '@/data/admin/schedule';

export default async function AdminClassSchedule({
   searchParams,
}: {
   searchParams: { [key: string]: string | string[] | undefined };
}) {
   const page = parseInt(searchParams.page as string) || 1;

   const schedule = await adminScheduleData.getSchedule(page);

   return (
      <AdminClassScheduleTable
         data={schedule.success ? schedule.payload.schedule : []}
         pagination={schedule.success ? schedule.payload.pagination : false}
         error={!schedule.success ? schedule.message : false}
         page={page}
      />
   );
}
