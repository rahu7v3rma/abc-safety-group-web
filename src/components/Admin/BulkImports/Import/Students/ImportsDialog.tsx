'use client';

import Dialog from '@/components/ui/Dialog';
import Spinner from '@/components/ui/Spinner';
import Tooltip from '@/components/ui/Tooltip';
import VisualizationTable from '@/components/ui/VisualizationTable';
import usePost from '@/hooks/usePost';
import {
   convertFileToBase64Sync,
   isBase64,
   schemaAllowedColumns,
   validExtension,
} from '@/lib/helpers';
import { getImageURL } from '@/lib/image';
import {
   TVisualizationTableRootSchema,
   TBulkImportsStudent,
} from '@/lib/types';
import { State } from '@hookstate/core';
import { WarningTriangle, Check } from 'iconoir-react';
import {
   ChangeEvent,
   Dispatch,
   FC,
   SetStateAction,
   useMemo,
   useRef,
} from 'react';
import { toast } from 'sonner';
import ImportStudentHeadshot from './Headshot';
import { useRouter } from 'next/navigation';
import DefaultUserSchema from '@/components/DefaultSchemas/UserSchema';

interface StudentsImportDialogProps {
   fileName: State<string, {}>;
   students: State<TBulkImportsStudent[], {}>;
   showStudentsDialog: boolean;
   setShowStudentsDialog: Dispatch<SetStateAction<boolean>>;
}

const StudentsImportDialog: FC<StudentsImportDialogProps> = ({
   fileName,
   students,
   showStudentsDialog,
   setShowStudentsDialog,
}) => {
   const router = useRouter();

   const [deleteStudent, deleteStudentLoading, deleteStudentError] = usePost<
      { userIds: string[] },
      any
   >('admin', ['users', 'delete']);

   const [deleteStudents, deleteStudentsLoading, deleteStudentsError] = usePost<
      { userIds: string[] },
      any
   >('admin', ['users', 'delete']);

   const allFailed = useMemo(
      () => students.every((student) => !!student.failed.value),
      [students]
   );
   const uploadHeadshotRef = useRef<HTMLInputElement>(null);
   const headshotAccept = '.png,.jpg,.jpeg';

   const [
      importStudentHeadshots,
      importStudentHeadshotsLoading,
      importStudentHeadshotsError,
   ] = usePost<FormData, { headShots: TBulkImportsStudent[] }>('users', [
      'upload',
      'bulk',
      'headshots',
   ]);

   const [importStudents, importStudentsLoading, importStudentsError] = usePost<
      { fileName: string; students: TBulkImportsStudent[] },
      any
   >('data', ['import', 'students']);

   function removeStudent(userId: string) {
      toast.promise(
         deleteStudent(
            { userIds: [userId] },
            {
               success: () => {
                  students.set((cStudents) =>
                     cStudents.filter((student) => {
                        if (student.hasOwnProperty('userId')) {
                           if (student.userId === userId) {
                              return false;
                           }
                        }
                        return true;
                     })
                  );
               },
               fail: (message, payload) => {
                  console.log(message, payload);
               },
            },
            {
               throw: true,
            }
         ),
         {
            loading: 'Removing student...',
            success: 'Student removed!',
            error: (e) => {
               return e.message;
            },
         }
      );
   }

   function uploadHeadshot(userId: string) {
      if (uploadHeadshotRef.current) {
         uploadHeadshotRef.current.value = '';
         uploadHeadshotRef.current.click();

         const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files && files.length > 0) {
               const file = files[0];
               const fileExtension = file.name.match(/\.[^/.]+$/);
               if (
                  fileExtension &&
                  fileExtension.length &&
                  validExtension(headshotAccept, fileExtension[0])
               ) {
                  students.set((cStudents) =>
                     cStudents.map((student) => {
                        if (student.userId === userId) {
                           return {
                              ...student,
                              headShot: file as any,
                           };
                        }
                        return student;
                     })
                  );
               }
            }

            uploadHeadshotRef.current!.removeEventListener(
               'change',
               handleFileChange as any
            );
         };

         uploadHeadshotRef.current!.addEventListener(
            'change',
            handleFileChange as any
         );
      }
   }

   const allKeys = useMemo(() => {
      let keys: string[] = [];

      for (let i = 0; i < students.length; ++i) {
         const student = students[i];

         Object.keys(student).forEach((key) => {
            if (!keys.includes(key)) {
               keys.push(key);
            }
         });
      }

      return keys;
   }, [students]);

   const bulkUploadTableSchema: TVisualizationTableRootSchema<TBulkImportsStudent> =
      {
         __root: {
            render: (children, values) => {
               if (values.failed) {
                  return (
                     <div className="bg-red-100 -mb-px z-10 border-b border-red-200 flex-grow">
                        {children}
                     </div>
                  );
               } else {
                  return children;
               }
            },
            actions: (values) => {
               if (values.failed) {
                  return false;
               }
               return {
                  'Upload Headshot': () => uploadHeadshot(values.userId),
                  'Remove Student': () => removeStudent(values.userId),
               };
            },
         },
         failed: {
            inline: 110,
            name: 'Imported',
            render: (value, values) => {
               return (
                  <div className="w-full flex justify-center">
                     {value ? (
                        <Tooltip
                           content={values.reason ?? 'Something went wrong'}
                           contentProps={{
                              align: 'center',
                              side: 'top',
                              sideOffset: 5,
                              avoidCollisions: true,
                           }}
                           intent="error"
                        >
                           <div className="h-6 w-6">
                              <WarningTriangle
                                 className="h-full w-full text-red-500"
                                 strokeWidth={2}
                              />
                           </div>
                        </Tooltip>
                     ) : (
                        <Check
                           className="h-6 w-6 text-green-500"
                           strokeWidth={2}
                        />
                     )}
                  </div>
               );
            },
         },
         headShot: {
            allowNull: true,
            inline: DefaultUserSchema.headShot?.inline || 125,
            render: (value, values) => (
               <ImportStudentHeadshot
                  headShot={values.headShot}
                  firstName={values.firstName}
                  lastName={values.lastName}
               />
            ),
         },
         reason: {
            hidden: true,
         },
         ...schemaAllowedColumns<keyof TBulkImportsStudent>(
            [
               'failed',
               'firstName',
               'lastName',
               'email',
               'dob',
               'phoneNumber',
               'headShot',
            ],
            allKeys
         ),
      };

   async function ImportStudents(step: number, steps: number) {
      const studentsNotFailed = students
         .get()
         .filter((student) => !student.failed);

      toast.promise(
         importStudents(
            {
               fileName: fileName.value,
               students: studentsNotFailed,
            },
            {
               success: (data) => {
                  router.refresh();
                  setShowStudentsDialog(false);
               },
               fail: (message) => {
                  console.log(message);
               },
            },
            {
               throw: true,
            }
         ),
         {
            loading: `(${step}/${steps}) Importing students...`,
            success: `(${step}/${steps}) Students imported`,
            error: 'Failed importing students',
         }
      );
   }

   async function StartImport() {
      const studentsWithHeadshot = students.filter(
         (student) =>
            !!student.headShot && (student.headShot as any) instanceof File
      );

      if (studentsWithHeadshot.length) {
         const formData = new FormData();

         for (let i = 0; i < studentsWithHeadshot.length; ++i) {
            const student = studentsWithHeadshot[i];

            formData.append('userIds', student.userId.value);
            formData.append('pictures', student.headShot.value);
         }

         toast.promise(
            importStudentHeadshots(
               formData,
               {
                  success: ({ headShots }) => {
                     students.set((cStudents) =>
                        cStudents.map((student) => {
                           const find = headShots.find(
                              (h) => h.userId === student.userId
                           );
                           if (find) {
                              return {
                                 ...student,
                                 headShot: find.headShot,
                              };
                           }
                           return student;
                        })
                     );
                     ImportStudents(2, 2);
                  },
                  fail: (message) => {
                     console.log(message);
                     ImportStudents(2, 2);
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
               loading: '(1/2) Uploading headshots...',
               success: '(1/2) Headshots uploaded',
               error: 'Failed uploading headshots',
            }
         );
      } else {
         ImportStudents(1, 1);
      }
   }

   function Cancel() {
      const deleteIds = students
         .filter((student) => !student.failed.value)
         .map((student) => student.userId.value);

      if (deleteIds.length) {
         toast.promise(
            deleteStudents(
               { userIds: students.map((student) => student.userId.value) },
               {
                  success: () => {
                     students.set([]);
                     setShowStudentsDialog(false);
                  },
                  fail: (message, payload) => {
                     console.log(message, payload);
                  },
               },
               {
                  throw: true,
               }
            ),
            {
               loading: 'Removing students...',
               success: 'Students removed!',
               error: (e) => {
                  return e.message;
               },
            }
         );
      } else {
         students.set([]);
         setShowStudentsDialog(false);
      }
   }

   return (
      <Dialog
         open={showStudentsDialog}
         onOpenChange={(open) => {
            if (!open && students.length) {
               Cancel();
            }
            students.set([]);
            setShowStudentsDialog(open);
         }}
         contentClassName="max-w-5xl"
      >
         <VisualizationTable
            name="Student Bulk Data"
            data={students}
            maxHeight="max-h-[600px]"
            schema={bulkUploadTableSchema}
         />
         <div className="mt-10 gap-x-2.5 w-full flex items-center justify-end">
            <button
               onClick={Cancel}
               className="py-3 inline-flex items-center px-6 font-medium rounded-xl bg-red-500 transition duration-200 ease-linear hover:bg-red-600 text-white"
            >
               {deleteStudentsLoading ? (
                  <>
                     <Spinner className="h-5 w-5 mr-2 -ml-2" />
                     Removing...
                  </>
               ) : (
                  'Cancel'
               )}
            </button>
            <button
               onClick={StartImport}
               disabled={allFailed}
               className="py-3 px-6 disabled:opacity-75 inline-flex items-center disabled:hover:bg-blue-500 disabled:cursor-not-allowed font-medium rounded-xl bg-blue-500 transition duration-200 ease-linear hover:bg-blue-600 text-white"
            >
               {importStudentHeadshotsLoading || importStudentsLoading ? (
                  <>
                     <Spinner className="h-5 w-5 mr-2 -ml-2" />
                     Importing...
                  </>
               ) : (
                  'Import'
               )}
            </button>
            <input
               type="file"
               id="Headshot"
               name="Headshot"
               accept={headshotAccept}
               className="hidden"
               ref={uploadHeadshotRef}
            />
         </div>
      </Dialog>
   );
};

export default StudentsImportDialog;
