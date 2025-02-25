'use client';

import SubmitButton from '@/components/ui/Buttons/Submit';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/TextArea';
import UploadInput from '@/components/ui/UploadInput';
import usePost from '@/hooks/usePost';
import { zodResolver } from '@hookform/resolvers/zod';
import {
   ChatBubbleQuestion,
   EmptyPage,
   MultiplePages,
   Xmark,
} from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
   ReportBugSchema,
   useReportBugState,
   type TReportBugSchema,
} from './Schema';

const ReportBugComponent: FC = () => {
   const router = useRouter();

   const formValues = useReportBugState((state) => state.data);
   const formReset = useReportBugState((state) => state.reset);

   const {
      handleSubmit,
      formState: { errors },
      control,
      watch,
      trigger,
   } = useForm<TReportBugSchema>({
      resolver: zodResolver(ReportBugSchema),
      values: formValues,
   });

   useEffect(() => {
      const subscription = watch((value) => {
         useReportBugState.setState({
            data: value as TReportBugSchema,
         });
      });
      return () => {
         subscription.unsubscribe();
      };
   }, [watch]);

   const {
      field: { value: subjectValue, onChange: subjectOnChange },
   } = useController({ name: 'subject', control });
   const {
      field: { value: bodyValue, onChange: bodyOnChange },
   } = useController({ name: 'body', control });
   const {
      field: { value: filesValue, onChange: filesOnChange },
   } = useController({ name: 'files', control });

   const [reportBugPost, reportBugPostLoading] = usePost<FormData, any>(
      'admin',
      ['bug-report']
   );

   const canSave = useMemo(
      () =>
         ReportBugSchema.safeParse(formValues).success && !reportBugPostLoading,
      [formValues, reportBugPostLoading]
   );

   const Save = useCallback(() => {
      const requestPayload = new FormData();

      requestPayload.append('subject', formValues.subject);
      requestPayload.append('body', formValues.body);
      formValues.files.forEach((file) => {
         requestPayload.append('files', file);
      });

      toast.promise(
         reportBugPost(
            requestPayload,
            {
               success: formReset,
            },
            {
               throw: true,
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         ),
         {
            loading: 'Reporting bug...',
            success: 'Reported bug!',
            error: 'Failed reporting bug.',
         }
      );
   }, [reportBugPost, formValues, formReset]);

   const Cancel = useCallback(() => {
      formReset();
      router.back();
   }, [formReset, router]);

   const [uploadFile, setUploadFile] = useState<File>();

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <ChatBubbleQuestion
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Report a bug
            </div>
            <div className="flex items-center gap-2.5">
               <SubmitButton
                  disabled={!canSave || reportBugPostLoading}
                  onClick={Save}
                  loading={reportBugPostLoading}
               />
               <button
                  className="px-5 py-3.5 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm bg-gradient-to-b from-red-500 to-red-600 rounded-2xl shadow-inner-red"
                  onClick={Cancel}
               >
                  Cancel
               </button>
            </div>
         </div>
         <div className="flex-grow mt-5 h-[1px] p-10 overflow-auto relative rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="max-w-xl mx-auto w-full">
               <form
                  onSubmit={() => {
                     void handleSubmit(Save)();
                  }}
                  className="flex flex-col gap-7"
               >
                  <Input
                     label="Subject"
                     error={errors.subject}
                     value={subjectValue}
                     onChange={subjectOnChange}
                     trigger={() => {
                        void trigger();
                     }}
                  />
                  <Textarea
                     label="Body"
                     error={errors.body}
                     value={bodyValue}
                     onChange={bodyOnChange}
                     trigger={() => {
                        void trigger();
                     }}
                     rows={5}
                  />
                  <p className="tracking-tight text-lg font-semibold">
                     Upload content{' '}
                  </p>
                  <UploadInput
                     asFile={true}
                     accept=".png,.jpg,.jpeg,.ppt,.pdf,.xls,.xlsx,.doc,.docx,.csv"
                     value={uploadFile}
                     onChange={setUploadFile}
                     error={errors.files}
                     render={(selectedContent, remove) => (
                        <>
                           <span className="h-14 w-14 bg-blue-500 text-white flex items-center justify-center rounded-full">
                              <MultiplePages
                                 className="w-7 h-7"
                                 strokeWidth={1.5}
                              />
                           </span>
                           <p className="mt-6 text-zinc-600 max-w-[22rem] truncate font-medium underline">
                              {selectedContent.contentName}
                           </p>
                           <p className="mt-2 tracking-tight text-sm text-zinc-400 font-medium">
                              {selectedContent.content.match(
                                 /^data:(.*);base64,/
                              )?.[1] ?? '?'}
                           </p>
                           <div className="mt-6 flex items-center gap-x-2.5">
                              <button
                                 type="button"
                                 onClick={() => {
                                    filesOnChange([...filesValue, uploadFile]);
                                    remove();
                                    void trigger();
                                 }}
                                 className="py-2.5 text-sm px-4 rounded-xl bg-blue-500 font-medium tracking-tight text-white"
                              >
                                 Upload
                              </button>
                              <button
                                 type="button"
                                 onClick={remove}
                                 className="py-2.5 text-sm px-4 rounded-xl bg-red-500 font-medium tracking-tight text-white"
                              >
                                 Cancel
                              </button>
                           </div>
                        </>
                     )}
                  />
                  {filesValue.length > 0 ? (
                     filesValue.map((file, fileIndex) => (
                        <div
                           key={fileIndex}
                           className="w-full p-6 border bg-white shadow flex justify-between items-center rounded-3xl border-zinc-100"
                        >
                           <div className="flex w-full items-center">
                              <div className="h-12 w-12 flex border border-zinc-200 items-center text-blue-500 justify-center rounded-xl">
                                 <EmptyPage
                                    className="h-6 w-6"
                                    strokeWidth={2}
                                 />
                              </div>
                              <div className="ml-5 w-full flex flex-col items-start">
                                 <div className="flex gap-x-2.5">
                                    <p className="font-medium max-w-[400px] w-auto outline-none truncate tracking-tight">
                                       {file.name}
                                    </p>
                                 </div>
                              </div>
                              <Xmark
                                 className="text-red-600 cursor-pointer text-xl"
                                 onClick={() => {
                                    filesOnChange([
                                       ...filesValue.filter(
                                          (_, fileValueIndex) =>
                                             fileValueIndex !== fileIndex
                                       ),
                                    ]);
                                    void trigger();
                                 }}
                              />
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="w-full p-8 bg-white border border-zinc-200 font-medium text-zinc-500 tracking-tight shadow-sm rounded-2xl">
                        No files
                     </div>
                  )}
               </form>
            </div>
         </div>
      </div>
   );
};

export default ReportBugComponent;
