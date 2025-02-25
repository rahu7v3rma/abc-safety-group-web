import VisualizationTableButtonComplete from '@/components/ui/VisualizationTable/Buttons/Complete';
import usePost from '@/hooks/usePost';
import { TScheduleDetailsData } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';
import { toast } from 'sonner';

interface ScheduleButtonCompleteProps {
   schedule: TScheduleDetailsData;
}

const ScheduleButtonComplete: FC<ScheduleButtonCompleteProps> = ({
   schedule,
}) => {
   const router = useRouter();
   const params = useParams<{ id: string; seriesNumber: string }>();

   const [completePost, completePostLoading] = usePost<
      {},
      { success: boolean }
   >('courses', ['schedule', 'complete', params.id, params.seriesNumber]);

   const Complete = useCallback(() => {
      toast.promise(
         completePost(
            {},
            {
               success: () => {
                  router.refresh();
               },
            },
            { throw: true },
         ),
         {
            loading: 'Completing schedule...',
            success: 'Schedule completed',
            error: 'Failed completing schedule',
         },
      );
   }, [completePost, router]);

   return (
      <VisualizationTableButtonComplete
         confirmationTitle="Complete course schedule"
         confirmationAction={Complete}
         loading={completePostLoading}
         {...(schedule.inProgress && {
            confirmationDescription:
               'This action will make this class unable to be actively managed.',
         })}
      />
   );
};

export default ScheduleButtonComplete;
