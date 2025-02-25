import Confirmation from '@/components/ui/Confirmation';
import Dropdown from '@/components/ui/Dropdown';
import Tooltip from '@/components/ui/Tooltip';
import { useUser } from '@/contexts/user';
import usePost from '@/hooks/usePost';
import {
   TCourseContentData,
   TCourseDetailsData,
   TUserContextForce,
} from '@/lib/types';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { Download, EmptyPage, Menu, MultiplePages } from 'iconoir-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import saveAs from 'file-saver';
import { State, useHookstate } from '@hookstate/core';
import UploadInput from '@/components/ui/UploadInput';

interface CourseContentsProps {
   course: TCourseDetailsData;
   contents?: TCourseContentData[] | false;
   modify?: boolean;
}

const CourseContents: FC<CourseContentsProps> = ({
   course,
   contents: contentsData,
   modify,
}) => {
   const contents = useHookstate<TCourseContentData[]>(contentsData || []);
   const { user } = useUser<TUserContextForce>();

   const [file, setFile] = useState<File>();

   const [showMenuConfirmation, setShowMenuConfirmation] =
      useState<boolean>(false);
   const [confirmationAction, setConfirmationAction] =
      useState<keyof typeof actions>();

   const [selectedContent, setSelectedContent] =
      useState<State<TCourseContentData>>();

   const [notifyUsers, setNotifyUsers] = useState(false);

   const [publishUnpublishPost] = usePost<
      { fileIds: string[]; publish: boolean },
      any
   >('courses', [
      'content',
      'update',
      notifyUsers ? `${course.courseId}?notifyUsers=true` : course.courseId,
   ]);

   const [deletePost] = usePost<{ fileIds: string[] }, any>('courses', [
      'content',
      'delete',
      course.courseId,
   ]);

   const [uploadCourseContents] = usePost<
      FormData,
      { content: TCourseContentData[] }
   >('courses', ['content', 'upload', course.courseId]);

   if (!contents) {
      return <p>No course content</p>;
   }

   const actions = {
      Publish: PublishUnpublishContent,
      Unpublish: PublishUnpublishContent,
      Delete: DeleteContent,
   };

   async function StartDownload(content: TCourseContentData) {
      const response = await fetch(
         process.env.NEXT_PUBLIC_API_URL +
            `courses/content/load/${content.contentId}?uid=${user.userId}`,
         {
            method: 'GET',
         }
      );

      if (response.ok) {
         const arrayBuffer = await response.arrayBuffer();

         const blob = new Blob([arrayBuffer], {
            type: response.headers.get('content-type') as string,
         });

         saveAs(blob, content.contentName);
      } else {
         throw new Error('Failed to download content');
      }
   }

   async function DownloadContent(content: TCourseContentData) {
      toast.promise(StartDownload(content), {
         loading: 'Downloading content...',
         success: 'Downloaded content!',
         error: (e) => {
            return e.message;
         },
      });
   }

   function PublishUnpublishContent() {
      if (selectedContent) {
         toast.promise(
            publishUnpublishPost(
               {
                  fileIds: [selectedContent.contentId.value],
                  publish: !selectedContent.published.value,
               },
               {
                  success: () => {
                     selectedContent.published.set(
                        !selectedContent.published.value
                     );
                  },
               },
               {
                  throw: true,
               }
            ),
            {
               loading: selectedContent.published.value
                  ? 'Unpublishing content...'
                  : 'Publishing content...',
               success: selectedContent.published.value
                  ? 'Unpublished content!'
                  : 'Published content!',
               error: (e) => {
                  return e.message;
               },
            }
         );
      }
   }

   function DeleteContent() {
      if (selectedContent) {
         toast.promise(
            deletePost(
               {
                  fileIds: [selectedContent.contentId.value],
               },
               {
                  success: () => {
                     contents.set((currentContents) =>
                        currentContents.filter(
                           (c) =>
                              c.contentId !== selectedContent.contentId.value
                        )
                     );
                  },
               },
               {
                  throw: true,
               }
            ),
            {
               loading: 'Deleting content...',
               success: 'Deleted content!',
               error: (e) => {
                  return e.message;
               },
            }
         );
      }
   }

   function UploadContent(remove: any) {
      const formData = new FormData();

      if (file) {
         formData.append('content', file, file.name);
      }

      toast.promise(
         uploadCourseContents(
            formData,
            {
               success: ({ content }) => {
                  contents.set((currentContents) => [
                     ...currentContents,
                     content[0],
                  ]);
                  remove();
               },
            },
            {
               throw: true,
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         ),
         {
            loading: 'Uploading content...',
            success: 'Content uploaded!',
            error: 'Failed uploading content',
         }
      );
   }

   return (
      <div>
         <p className="tracking-tight text-xl font-semibold">
            Content list{' '}
            <span className="ml-2.5 text-lg text-blue-500 font-medium">
               {contents.length}
            </span>
         </p>
         <div className="mt-5 flex flex-col gap-5">
            {!!modify && confirmationAction && (
               <Confirmation
                  title={
                     confirmationAction ? `${confirmationAction} content` : ''
                  }
                  open={showMenuConfirmation}
                  setDialogOpen={setShowMenuConfirmation}
                  severe={false}
                  action={actions[confirmationAction]}
                  checkbox={
                     confirmationAction === 'Publish'
                        ? {
                             checked: notifyUsers,
                             setChecked: setNotifyUsers,
                             label: 'Notify users',
                             severeMessage:
                                'Are you sure you want to send this file to students? This action is irreversible.',
                          }
                        : undefined
                  }
               />
            )}
            {contents.length ? (
               contents.map((content) => (
                  <div
                     key={content.contentId.value}
                     className="w-full p-6 border bg-white shadow flex justify-between items-center rounded-3xl border-zinc-100"
                  >
                     <div className="flex w-full items-center">
                        <div className="h-12 w-12 flex border border-zinc-200 items-center text-blue-500 justify-center rounded-xl">
                           <EmptyPage className="h-6 w-6" strokeWidth={2} />
                        </div>
                        <div className="ml-5 w-full flex flex-col items-start">
                           <div className="flex gap-x-2.5">
                              <p className="font-medium max-w-[400px] w-auto outline-none truncate tracking-tight">
                                 {content.contentName.value}
                              </p>
                           </div>
                           <p
                              className={clsx(
                                 'mt-2 text-sm py-1 px-2 rounded-lg font-medium inline-blocks',
                                 content.published.value
                                    ? 'bg-green-500/10 text-green-500'
                                    : 'bg-zinc-500/10 text-zinc-500'
                              )}
                           >
                              {content.published.value
                                 ? 'published'
                                 : 'unpublished'}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-x-2.5">
                        {(!!content.published.value || !!modify) && (
                           <Tooltip content="Download">
                              <button
                                 onClick={() => DownloadContent(content.value)}
                                 className="rounded-lg p-2 text-blue-500 bg-blue-500/20 hover:bg-blue-500/30 transition duration-200 ease-linear"
                              >
                                 <Download
                                    className="h-5 w-5"
                                    strokeWidth={2}
                                 />
                              </button>
                           </Tooltip>
                        )}
                        {!!modify && (
                           <Dropdown
                              rootProps={{
                                 open:
                                    showMenuConfirmation &&
                                    selectedContent &&
                                    selectedContent.contentId ===
                                       content.contentId
                                       ? true
                                       : undefined,
                              }}
                              trigger={
                                 <button className="rounded-lg p-2.5 bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 transition duration-200 ease-linear data-[state=open]:bg-zinc-200 data-[state=open]:text-zinc-800">
                                    <Menu className="h-4 w-4" strokeWidth={2} />
                                 </button>
                              }
                           >
                              <DropdownMenuItem
                                 onClick={() => {
                                    setSelectedContent(content);
                                    setConfirmationAction(
                                       content.published.value
                                          ? 'Unpublish'
                                          : 'Publish'
                                    );
                                    setShowMenuConfirmation(true);
                                 }}
                                 className={clsx(
                                    'text-sm font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center px-4 py-2.5 relative select-none outline-none',
                                    content.published.value
                                       ? 'text-zinc-500 data-[highlighted]:bg-zinc-500/10 data-[highlighted]:text-zinc-600'
                                       : 'text-green-500 data-[highlighted]:bg-green-500/10 data-[highlighted]:text-green-600'
                                 )}
                              >
                                 {content.published.value
                                    ? 'Unpublish'
                                    : 'Publish'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 onClick={() => {
                                    setSelectedContent(content);
                                    setConfirmationAction('Delete');
                                    setShowMenuConfirmation(true);
                                 }}
                                 className={clsx(
                                    'text-sm font-medium text-red-500 tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center px-4 py-2.5 relative select-none outline-none data-[highlighted]:bg-red-500/10 data-[highlighted]:text-red-600'
                                 )}
                              >
                                 Delete
                              </DropdownMenuItem>
                           </Dropdown>
                        )}
                     </div>
                  </div>
               ))
            ) : (
               <div className="w-full p-8 bg-white border border-zinc-200 font-medium text-zinc-500 tracking-tight shadow-sm rounded-2xl">
                  No contents for this course.
               </div>
            )}
            {modify && (
               <>
                  <p className="mt-[20px] tracking-tight text-lg font-semibold">
                     Upload content{' '}
                  </p>
                  <UploadInput
                     asFile={true}
                     accept=".png,.jpg,.jpeg,.ppt,.pdf,.xls,.xlsx,.doc,.docx,.csv"
                     value={file}
                     onChange={setFile}
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
                              )?.[1] || '?'}
                           </p>
                           <div className="mt-6 flex items-center gap-x-2.5">
                              <button
                                 type="button"
                                 onClick={() => {
                                    if (file) {
                                       UploadContent(remove);
                                    } else {
                                       remove();
                                    }
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
               </>
            )}
         </div>
      </div>
   );
};

export default CourseContents;
