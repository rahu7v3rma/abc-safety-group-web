import z from 'zod';
import { create } from 'zustand';

export const ReportBugSchema = z.object({
   subject: z.string().min(10, {
      message: 'Subject too short'
   }),
   body: z.string().min(20, {
      message: 'Body too short'
   }),
   files: z.array(z.custom<File>()).min(1, { message: 'File is required' })
});

export type TReportBugSchema = z.infer<typeof ReportBugSchema>;

export const reportBugDefaultValues: TReportBugSchema = {
   subject: '',
   body: '',
   files: []
};

export const useReportBugState = create<
   { data: TReportBugSchema } & { reset: () => void }
>()((set) => ({
   data: reportBugDefaultValues,
   reset: () => {
      set({
         data: reportBugDefaultValues
      });
   }
}));
