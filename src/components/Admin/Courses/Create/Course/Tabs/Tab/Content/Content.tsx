'use client';

import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { MultiplePages, NavArrowRight } from 'iconoir-react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import UploadedContent from './UploadedContent';
import UploadInput from '@/components/ui/UploadInput';

export type contentType = File;
export type selectedContentType = {
   contentName: string;
   content: string;
};
type contentStateType = {
   content: contentType[];
};

export const contentStateDefault: contentStateType = {
   content: [],
};

export const useContent = create(
   immer<
      { data: contentStateType } & {
         reset: () => void;
         add: (data: contentType) => void;
         remove: (contentIndex: number) => void;
      }
   >((set) => ({
      data: {
         ...contentStateDefault,
      },
      add: (data) => {
         set((state) => {
            state.data.content = [...state.data.content, data];
         });
      },
      remove: (contentIndex) => {
         set((state) => {
            state.data.content = state.data.content.filter(
               (_, ci) => ci !== contentIndex
            );
         });
      },
      reset: () => {
         set((state) => {
            state.data = contentStateDefault;
         });
      },
   }))
);

interface CourseContentProps {
   tab: number;
   setTab: Dispatch<SetStateAction<number>>;
}

const CourseContent: FC<CourseContentProps> = ({ tab, setTab }) => {
   const content = useContent((state) => state.data.content);
   const addContent = useContent((state) => state.add);
   const removeContent = useContent((state) => state.remove);

   const [file, setFile] = useState<File>();
   const [adding, setAdding] = useState<boolean>(false);

   return (
      <div>
         <h2 className="tracking-tight font-medium">Attach Content(s)</h2>
         <div className="mt-5">
            <UploadInput
               asFile={true}
               accept=".png,.jpg,.jpeg,.ppt,.pdf,.xls,.xlsx,.doc,.docx,.csv"
               value={file}
               onChange={setFile}
               render={(selectedContent, remove) => (
                  <>
                     <span className="h-14 w-14 bg-blue-500 text-white flex items-center justify-center rounded-full">
                        <MultiplePages className="w-7 h-7" strokeWidth={1.5} />
                     </span>
                     <p className="mt-6 text-zinc-600 max-w-[22rem] truncate font-medium underline">
                        {selectedContent.contentName}
                     </p>
                     <p className="mt-2 tracking-tight text-sm text-zinc-400 font-medium">
                        {selectedContent.content.match(
                           /^data:(.*);base64,/
                        )?.[1] || '?'}
                     </p>
                     <div className="mt-6 flex items-center gap-x-2.5">
                        <button
                           type="button"
                           onClick={() => {
                              if (file) {
                                 addContent(file);
                              }
                              remove();
                           }}
                           className="py-2.5 text-sm px-4 rounded-xl bg-blue-500 font-medium tracking-tight text-white"
                        >
                           Add
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
         </div>
         {!!content.length && (
            <div className="mt-10">
               <p className="tracking-tight font-medium">
                  Content list{' '}
                  <span className="ml-2.5 text-blue-500 font-medium">
                     {content.length}
                  </span>
               </p>
               <div className="mt-5 flex flex-col gap-5">
                  {content.map((currentContent, contentIndex) => (
                     <UploadedContent
                        key={contentIndex}
                        contentIndex={contentIndex}
                        currentContent={currentContent}
                        removeContent={removeContent}
                     />
                  ))}
               </div>
            </div>
         )}
         <button
            onClick={() => setTab(tab + 1)}
            className="mt-10 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
         >
            Quizzes & Surveys
            <NavArrowRight className="ml-2.5 h-5 w-5" strokeWidth={2} />
         </button>
      </div>
   );
};

export default CourseContent;
