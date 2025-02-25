'use client';

import VisualizationTableButtonManage from '@/components/ui/VisualizationTable/Buttons/Manage';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

const ScheduleButtonManage = () => {
   const params = useParams<{ id: string; seriesNumber: string }>();
   const router = useRouter();

   const Manage = useCallback(() => {
      return router.push(
         `/instructor/live-classroom-management/course/${params.id}/schedule/${params.seriesNumber}`,
      );
   }, [router, params]);

   return <VisualizationTableButtonManage onClick={Manage} />;
};

export default ScheduleButtonManage;
