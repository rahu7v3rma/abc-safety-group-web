'use client';

import DatePickerInputHook from '@/components/ui/DatePickerInputHook';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { TScheduleDetailsData } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, PageEdit } from 'iconoir-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useRef } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { create } from 'zustand';

export const scheduleUpdateSchema = z.object({
   startTime: z.date({
      errorMap: () => ({ message: 'Start time is required' }),
   }),
   endTime: z.date({
      errorMap: () => ({ message: 'End time is required' }),
   }),
});

export type scheduleUpdateSchemaType = z.infer<typeof scheduleUpdateSchema>;

type ScheduleUpdateProps = {
   schedule: TScheduleDetailsData;
};

const ScheduleUpdate: FC<ScheduleUpdateProps> = ({ schedule }) => {
   const pathname = usePathname();
   const router = useRouter();

   const formRef = useRef<HTMLFormElement>(null);

   const scheduleUpdateStateDefault: scheduleUpdateSchemaType = {
      startTime: new Date(schedule.startTime),
      endTime: new Date(schedule.endTime),
   };

   const useScheduleUpdate = create<
      { data: scheduleUpdateSchemaType } & { reset: () => void }
   >()((set) => ({
      data: {
         ...scheduleUpdateStateDefault,
      },
      reset: () => {
         set({
            data: scheduleUpdateStateDefault,
         });
      },
   }));

   const scheduleUpdateValues = useScheduleUpdate((state) => state.data);

   const {
      control,
      trigger,
      formState: { errors },
      handleSubmit,
      watch,
   } = useForm<scheduleUpdateSchemaType>({
      resolver: zodResolver(scheduleUpdateSchema),
      values: scheduleUpdateValues as scheduleUpdateSchemaType,
   });

   useEffect(() => {
      const subscription = watch((value) => {
         useScheduleUpdate.setState({
            data: value as scheduleUpdateSchemaType,
         });
      });
      return () => subscription.unsubscribe();
   }, [watch, useScheduleUpdate]);

   const {
      field: { value: startTime, onChange: onChangeStartTime },
   } = useController({ name: 'startTime', control });
   const {
      field: { value: endTime, onChange: onChangeEndTime },
   } = useController({ name: 'endTime', control });

   const params = useParams<{ id: string; seriesNumber: string }>();

   const [updatePost, updatePostLoading] = usePost<
      { startTime: string; endTime: string },
      { success: boolean }
   >('courses', ['schedule', 'update', params.id, params.seriesNumber]);

   function Update() {
      toast.promise(
         updatePost(
            {
               startTime: startTime.toISOString(),
               endTime: endTime.toISOString(),
            },
            {
               success: () => {
                  router.back();
                  router.refresh();
               },
            },
            { throw: true },
         ),
         {
            loading: 'Updating schedule...',
            success: 'Schedule updated',
            error: 'Failed updating schedule',
         },
      );
   }

   return (
      <div className="flex flex-1 flex-col">
         <div className="flex items-center justify-between">
            <div className="inline-flex items-center text-xl font-semibold tracking-tight">
               <PageEdit
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Schedule update
            </div>
            <div className="flex items-center gap-2.5">
               <button
                  disabled={updatePostLoading}
                  onClick={Update}
                  className="shadow-inner-blue inline-flex w-32 items-center justify-between rounded-2xl border border-blue-800 bg-gradient-to-b from-blue-400 to-blue-500 px-5 py-2 text-sm font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear disabled:cursor-not-allowed disabled:opacity-75"
               >
                  Update
                  <span className="-mr-2 flex h-8 w-8 items-center justify-center rounded-[0.6rem] bg-blue-600">
                     {updatePostLoading ? (
                        <Spinner className="h-4 w-4" />
                     ) : (
                        <Check className="h-4 w-4" strokeWidth={2} />
                     )}
                  </span>
               </button>
               <button
                  onClick={() => router.back()}
                  className="shadow-inner-red inline-flex items-center justify-between rounded-2xl border border-red-800 bg-gradient-to-b from-red-500 to-red-600 px-5 py-3.5 text-sm font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear disabled:cursor-not-allowed disabled:opacity-75"
               >
                  Cancel
               </button>
            </div>
         </div>
         <div className="relative mt-5 h-[1px] flex-grow overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-10">
            <div className="mx-auto w-full max-w-3xl">
               <form
                  ref={formRef}
                  onSubmit={handleSubmit(Update)}
                  className="flex flex-col"
               >
                  <div className="grid grid-cols-2 gap-5">
                     <DatePickerInputHook
                        trigger={trigger}
                        label="Start time"
                        value={startTime}
                        onChange={(date: Date | null) => {
                           if (date) {
                              if (date > endTime) {
                                 onChangeEndTime(date);
                              }
                              onChangeStartTime(date);
                           }
                        }}
                        error={errors.startTime}
                        datePicker={{
                           showYearDropdown: true,
                           showTimeSelect: true,
                           dateFormat: 'MMM d, yyyy h:mm aa',
                           scrollableYearDropdown: true,
                        }}
                     />
                     <DatePickerInputHook
                        trigger={trigger}
                        label="End time"
                        value={endTime}
                        onChange={onChangeEndTime}
                        error={errors.endTime}
                        datePicker={{
                           showYearDropdown: true,
                           showTimeSelect: true,
                           dateFormat: 'MMM d, yyyy h:mm aa',
                           scrollableYearDropdown: true,
                           minDate: startTime,
                           filterTime: (time) => time >= startTime,
                        }}
                     />
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default ScheduleUpdate;
