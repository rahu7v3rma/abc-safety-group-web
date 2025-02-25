import VisualizationTableButtonStart from '@/components/ui/VisualizationTable/Buttons/Start';
import usePost from '@/hooks/usePost';
import { TScheduleDetailsData } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';
import { toast } from 'sonner';

interface ScheduleButtonStartProps {
   schedule: TScheduleDetailsData;
}

const ScheduleButtonStart: FC<ScheduleButtonStartProps> = ({ schedule }) => {
   const params = useParams<{ id: string; seriesNumber: string }>();
   const router = useRouter();

   const [startPost, startPostLoading] = usePost<{}, { success: boolean }>(
      'courses',
      ['schedule', 'start', params.id, params.seriesNumber],
   );

   const Start = useCallback(() => {
      toast.promise(
         startPost(
            {},
            {
               success: router.refresh,
            },
            { throw: true },
         ),
         {
            loading: 'Starting schedule...',
            success: 'Schedule started',
            error: 'Failed starting schedule',
         },
      );
   }, [startPost, router]);

   return (
      <VisualizationTableButtonStart
         confirmationTitle="Start course schedule"
         confirmationAction={Start}
         loading={startPostLoading}
         disabled={schedule.complete}
         icon="Page"
      />
   );
};

export default ScheduleButtonStart;
