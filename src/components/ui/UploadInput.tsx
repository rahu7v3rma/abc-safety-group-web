'use client';

import { convertFileToBase64, validExtension } from '@/lib/helpers';
import { getImageURL } from '@/lib/image';
import { TAPIRouters } from '@/lib/types';
import clsx from 'clsx';
import { CloudUpload, Xmark } from 'iconoir-react';
import Image from 'next/image';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { FieldError, Merge } from 'react-hook-form';
import { selectedContentType } from '../Admin/Courses/Create/Course/Tabs/Tab/Content/Content';

interface UploadInputProps {
   asFile?: boolean;
   trigger?: () => void;
   error?:
      | FieldError
      | Merge<FieldError, Array<FieldError | undefined>>
      | undefined;
   label?: string;
   required?: boolean;
   value?: string | File | undefined;
   onChange: any;
   accept: string;
   router?: TAPIRouters;
   render?: (
      selectedContent: selectedContentType,
      remove: () => void
   ) => ReactNode;
}

const UploadInput: FC<UploadInputProps> = ({
   asFile = false,
   trigger,
   label,
   required = true,
   error,
   value,
   onChange,
   accept,
   router,
   render,
}) => {
   const [selectedContent, setSelectedContent] = useState<
      selectedContentType | false
   >(false);

   useEffect(() => {
      async function updateSelectedContent(file: File) {
         const base64 = await convertFileToBase64(file);
         setSelectedContent({
            contentName: file.name,
            content: base64,
         });
      }
      if (asFile && value && typeof value !== 'string' && !selectedContent) {
         updateSelectedContent(value as File);
      }
   }, []);

   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const handleFileChange = async (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const files = event.target.files;
      if (files && files.length > 0) {
         const file = files[0];
         const fileExtension = file.name.match(/\.[^/.]+$/);
         if (
            fileExtension &&
            fileExtension.length &&
            validExtension(accept, fileExtension[0])
         ) {
            const base64Content = await convertFileToBase64(file);

            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
            setSelectedContent({
               contentName: fileNameWithoutExtension,
               content: base64Content,
            });
            if (asFile) {
               onChange(file);
            } else {
               onChange(base64Content);
            }
         }
      }
      if (trigger) trigger();
   };

   const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
   };

   const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
         const file = files[0];
         const fileExtension = file.name.match(/\.[^/.]+$/);
         if (
            fileExtension &&
            fileExtension.length &&
            validExtension(accept, fileExtension[0])
         ) {
            const base64Content = await convertFileToBase64(file);
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
            setSelectedContent({
               contentName: fileNameWithoutExtension,
               content: base64Content,
            });
            if (asFile) {
               onChange(file);
            } else {
               onChange(base64Content);
            }
         }
      }
      if (trigger) trigger();
   };

   const remove = () => {
      if (value) {
         onChange('');
      }
      if (selectedContent) {
         setSelectedContent(false);
      }
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
      if (trigger) trigger();
   };

   return (
      <div>
         {label && (
            <p className="font-medium tracking-tight">
               <span
                  className={clsx(
                     'font-bold text-lg text-red-500',
                     required && 'mr-2'
                  )}
                  style={{
                     verticalAlign: 'sub',
                  }}
               >
                  {required ? '*' : ''}
               </span>
               {label}
            </p>
         )}
         <input
            disabled={!!value}
            type="file"
            id={label}
            name={label}
            className="hidden"
            accept={accept}
            ref={fileInputRef}
            onChange={handleFileChange}
         />
         {!!value ? (
            <div
               className={clsx(
                  'w-full flex flex-col items-center justify-center text-center bg-white border-[2px] border-dashed rounded-3xl transition duration-200 ease-linear',
                  error
                     ? 'p-10 border-red-500 hover:border-stone-400'
                     : value
                     ? 'p-5 border-stone-400'
                     : 'p-10 border-stone-300 hover:border-stone-400',
                  label && 'mt-2'
               )}
            >
               {!render ? (
                  <button
                     type="button"
                     tabIndex={-1}
                     onClick={remove}
                     className="w-auto max-w-full h-auto max-h-[24rem] rounded-3xl overflow-hidden group relative"
                  >
                     <Image
                        src={
                           typeof value === 'string'
                              ? value.match(/^data:image\/[a-z]+;base64/g)
                                 ? value
                                 : getImageURL(router!, value)
                              : selectedContent
                              ? selectedContent.content
                              : ''
                        }
                        placeholder="blur"
                        blurDataURL={`/_next/image?url=${
                           typeof value === 'string'
                              ? value.match(/^data:image\/[a-z]+;base64/g)
                                 ? value
                                 : getImageURL(router!, value)
                              : selectedContent
                              ? selectedContent.content
                              : ''
                        }&w=16&q=1`}
                        width={600}
                        height={600}
                        className="w-auto animate-fadeIn max-w-full h-auto max-h-[24rem] object-cover"
                        alt={label ?? 'Uploaded Image'}
                     />
                     <div className="hidden bg-transparent group-hover:bg-black/40 transition duration-200 ease-linear group-hover:flex absolute inset-0 items-center justify-center">
                        <Xmark
                           className="h-12 w-12 text-red-500"
                           strokeWidth={2}
                        />
                     </div>
                  </button>
               ) : (
                  render(selectedContent as selectedContentType, remove)
               )}
            </div>
         ) : (
            <label
               className={clsx(
                  'w-full cursor-pointer flex flex-col items-center justify-center text-center bg-white border-[2px] border-dashed rounded-3xl transition duration-200 ease-linear',
                  error
                     ? 'p-10 border-red-500 hover:border-stone-400'
                     : value
                     ? 'p-5 border-stone-400'
                     : 'p-10 border-stone-300 hover:border-stone-400',
                  label && 'mt-2'
               )}
               onClick={() => fileInputRef.current?.click()}
               onDragOver={handleDragOver}
               onDrop={handleDrop}
            >
               <span className="h-14 w-14 bg-blue-500 text-white flex items-center justify-center rounded-full">
                  <CloudUpload className="w-7 h-7" strokeWidth={2} />
               </span>
               <p className="mt-6 tracking-tight text-base text-stone-500 font-medium">
                  <span className="text-stone-600">Click to upload</span> or
                  drag and drop
               </p>
               <p className="mt-2 tracking-tight text-sm text-stone-400 font-medium">
                  <span className="text-red-500 font-semibold">*</span>{' '}
                  {accept.split(',').map((a, i) => (
                     <span key={a} className="uppercase">
                        {a.replace('.', '')}
                        {i + 1 !== accept.split(',').length && ','}{' '}
                     </span>
                  ))}
               </p>
            </label>
         )}
         {error && (
            <div className="text-sm text-red-500 mt-2 font-medium tracking-tight">
               {error.message}
            </div>
         )}
      </div>
   );
};

export default UploadInput;
