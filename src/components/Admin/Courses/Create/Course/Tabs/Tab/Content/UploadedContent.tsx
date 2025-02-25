'use client';

import { EmptyPage, Trash } from 'iconoir-react';
import { FC, useRef, useState } from 'react';

import { contentType } from './Content';

interface CourseContentUploadedContentProps {
   contentIndex: number;
   currentContent: contentType;
   removeContent: (contentIndex: number) => void;
}

const CourseContentUploadedContent: FC<CourseContentUploadedContentProps> = ({
   contentIndex,
   currentContent,
   removeContent,
}) => {
   const [editingContent, setEditingContent] = useState<boolean>(false);

   const ref = useRef<HTMLInputElement>(null);

   return (
      <div className="w-full p-6 border bg-white shadow flex justify-between items-center rounded-3xl border-zinc-100">
         <div className="flex w-full items-center">
            <div className="h-12 w-12 flex border border-zinc-200 items-center text-blue-500 justify-center rounded-xl">
               <EmptyPage className="h-6 w-6" strokeWidth={2} />
            </div>
            <div className="ml-5 w-full">
               <div className="flex gap-x-2.5">
                  <p className="font-medium max-w-[400px] w-auto outline-none truncate tracking-tight">
                     {currentContent.name}
                  </p>
               </div>
               <p className="mt-1 text-sm text-zinc-400 font-medium">
                  {currentContent.type}
               </p>
            </div>
         </div>
         <button
            onClick={() => removeContent(contentIndex)}
            className="rounded-xl p-2.5 bg-red-500 text-white hover:bg-red-600 transition duration-200 ease-linear"
         >
            <Trash className="h-4 w-4" strokeWidth={2} />
         </button>
      </div>
   );
};

export default CourseContentUploadedContent;
