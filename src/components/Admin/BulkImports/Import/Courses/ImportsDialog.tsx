'use client';

import Dialog from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import InputNumber from '@/components/ui/InputNumber';
import Spinner from '@/components/ui/Spinner';
import Tooltip from '@/components/ui/Tooltip';
import VisualizationTable from '@/components/ui/VisualizationTable';
import usePost from '@/hooks/usePost';
import useSelectable from '@/hooks/useSelectable';
import { compareLowercase, filterNoneProperties } from '@/lib/helpers';
import { TBulkImportsCourse, TVisualizationTableRootSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { State, hookstate, useHookstate } from '@hookstate/core';
import clsx from 'clsx';
import {
   Check,
   Folder,
   FolderPlus,
   MultiplePages,
   Trash,
   WarningTriangle,
} from 'iconoir-react';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

interface CoursesImportDialogProps {
   courses: State<TBulkImportsCourse[], {}>;
   showCoursesDialog: boolean;
   setShowCoursesDialog: Dispatch<SetStateAction<boolean>>;
}

interface ButtonsProps {
   courses: State<TBulkImportsCourse[], {}>;
   setArchivedCourses: Dispatch<SetStateAction<any[]>>;
   selectable: ReturnType<typeof useSelectable<any>>;
}

const createBundleSchema = z.object({
   bundleName: z.string().min(1, { message: 'Bundle name is required' }),
   bundlePrice: z
      .number({ errorMap: () => ({ message: 'Bundle price is required' }) })
      .optional(),
   bundleDescription: z.string().optional(),
});

export type createBundleSchemaType = z.infer<typeof createBundleSchema>;

const CreateBundle: FC<
   ButtonsProps & {
      bundles: any[];
      setBundles: Dispatch<SetStateAction<any[]>>;
   }
> = ({ selectable, bundles, setBundles, courses, setArchivedCourses }) => {
   const [loading, setLoading] = useState<boolean>(false);
   const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
   const [selected, { removeSelectAll }] = selectable;

   const {
      handleSubmit,
      register: registerForm,
      formState: { errors },
      control,
      reset,
   } = useForm<createBundleSchemaType>({
      resolver: zodResolver(createBundleSchema),
      values: {
         bundleName: '',
         bundleDescription: '',
         bundlePrice: 0,
      },
   });

   const {
      field: { value: bundlePriceValue, onChange: bundlePriceOnChange },
   } = useController({ name: 'bundlePrice', control });

   function createBundle(values: createBundleSchemaType) {
      setLoading(true);
      const selectedCourses = selected.get({ noproxy: true });

      setArchivedCourses((archivedCourses) => [
         ...archivedCourses,
         ...selectedCourses.map((sc) => {
            const { __rowIndex, ...scValue } = sc;
            return {
               ...scValue,
               bundleIndex: bundles.length,
            };
         }),
      ]);
      setBundles((b) => [
         ...b,
         {
            bundle: {
               name: values.bundleName,
               price: values.bundlePrice,
               description: values.bundleDescription,
            },
            courses: selectedCourses.map((course) => ({
               courseName: course['Course Name'],
               language: course['Language'],
               schedule: [
                  {
                     date: course['Start Date'],
                     startTime: course['Start Time'],
                     endTime: course['End Time'],
                  },
               ],
               ...filterNoneProperties({
                  onlineClassLink: course['Online Class Link'],
                  password: course['Password'],
                  street: course['Street'],
                  rmFl: course['Rm/Fl'],
                  city: course['City'],
                  state: course['State'],
                  zip: course['ZIP'],
               }),
               instructorNames: [course['Instructor Name']],
               price: course['Price']
                  ? course['Price'].length
                     ? parseFloat(course['Price'])
                     : 0
                  : 0,
               code: course['Code'],
            })),
         },
      ]);

      courses.set((currentCourses) =>
         currentCourses.filter((_, courseIndex) => {
            const find = selectedCourses.find(
               (course) => course.__rowIndex === courseIndex,
            );
            if (find) {
               return false;
            }
            return true;
         }),
      );

      removeSelectAll();
      reset();
      setLoading(false);
      setShowCreateDialog(false);
   }

   return (
      <>
         <button
            disabled={!selected.length}
            onClick={() => setShowCreateDialog(true)}
            className="px-5 w-44 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
         >
            Create bundle
            <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
               <FolderPlus className="h-4 w-4" strokeWidth={2} />
            </span>
         </button>
         <Dialog
            open={showCreateDialog}
            onOpenChange={(open) => {
               reset();
               setShowCreateDialog(open);
            }}
            contentClassName="max-w-xl"
         >
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <FolderPlus
                  className="mr-4 h-7 w-7 text-blue-500"
                  strokeWidth={2}
               />
               Create bundle
            </div>
            <form onSubmit={handleSubmit(createBundle)}>
               <div className="mt-5 flex flex-col gap-5">
                  <div className="grid grid-cols-3 gap-5">
                     <div className="col-span-2">
                        <Input
                           label="Bundle name"
                           error={errors.bundleName}
                           {...registerForm('bundleName')}
                        />
                     </div>
                     <div className="col-span-1">
                        <InputNumber
                           iconLabel="$"
                           label="Bundle price"
                           error={errors.bundlePrice}
                           value={bundlePriceValue}
                           onChange={bundlePriceOnChange}
                        />
                     </div>
                  </div>
                  <Input
                     required={false}
                     label="Bundle description"
                     error={errors.bundleDescription}
                     {...registerForm('bundleDescription')}
                  />
               </div>
               <div className="mt-10 grid grid-cols-2 gap-2.5">
                  <button
                     type="submit"
                     disabled={loading}
                     className="flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
                  >
                     {loading ? (
                        <>
                           <Spinner className="h-5 w-5 mr-2 -ml-2" />
                           Creating...
                        </>
                     ) : (
                        'Create'
                     )}
                  </button>
                  <button
                     onClick={() => {
                        reset();
                        setShowCreateDialog(false);
                     }}
                     type="button"
                     className="flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
                  >
                     Cancel
                  </button>
               </div>
            </form>
         </Dialog>
      </>
   );
};

const createSeriesSchema = z.object({
   courseName: z.string().min(1, { message: 'Course name is required' }),
   // do this
   price: z
      .number({ errorMap: () => ({ message: 'Course price is required' }) })
      .optional(),
   courseDescription: z.string().optional(),
   code: z.string().min(1, { message: 'Course code is required' }),
});

export type createSeriesSchemaType = z.infer<typeof createSeriesSchema>;

const CreateSeries: FC<
   ButtonsProps & {
      series: any[];
      setSeries: Dispatch<SetStateAction<any[]>>;
   }
> = ({ selectable, series, setSeries, courses, setArchivedCourses }) => {
   const [loading, setLoading] = useState<boolean>(false);
   const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
   const [selected, { removeSelectAll }] = selectable;

   function areAllPropertiesSame(property: string, courses: any) {
      if (!courses.length) return false;

      const firstPropertyValue = courses[0][property];
      if (typeof firstPropertyValue === 'string' && !firstPropertyValue.length)
         return false;

      for (let i = 1; i < courses.length; i++) {
         if (courses[i][property] !== firstPropertyValue) {
            return false;
         }
      }

      return true;
   }

   const {
      handleSubmit,
      register: registerForm,
      formState: { errors },
      control,
      reset,
   } = useForm<createSeriesSchemaType>({
      resolver: zodResolver(createSeriesSchema),
      values: {
         courseName: areAllPropertiesSame(
            'Course Name',
            selected.get({ noproxy: true }),
         )
            ? selected.get({ noproxy: true })[0]['Course Name']
            : '',
         price: areAllPropertiesSame('Price', selected.get({ noproxy: true }))
            ? selected.get({ noproxy: true })[0]['Price']
            : 0,
         courseDescription: '',
         code: areAllPropertiesSame('Code', selected.get({ noproxy: true }))
            ? selected.get({ noproxy: true })[0]['Code']
            : '',
      },
   });

   const {
      field: { value: coursePriceValue, onChange: coursePriceOnChange },
   } = useController({ name: 'price', control });

   function createSeries(values: createSeriesSchemaType) {
      setLoading(true);
      const selectedCourses = selected.get({ noproxy: true });
      const selectedCourse = selectedCourses[0];

      setArchivedCourses((archivedCourses) => [
         ...archivedCourses,
         ...selectedCourses.map((sc) => {
            const { __rowIndex, ...scValue } = sc;
            return {
               ...scValue,
               seriesIndex: series.length,
            };
         }),
      ]);
      setSeries((b) => [
         ...b,
         {
            courseName: values.courseName,
            language: selectedCourse['Language'],
            schedule: selectedCourses.map((course) => ({
               date: course['Start Date'],
               startTime: course['Start Time'],
               endTime: course['End Time'],
            })),
            ...filterNoneProperties({
               description: values.courseDescription,
               onlineClassLink: selectedCourse['Online Class Link'],
               password: selectedCourse['Password'],
               street: selectedCourse['Street'],
               rmFl: selectedCourse['Rm/Fl'],
               city: selectedCourse['City'],
               state: selectedCourse['State'],
               zip: selectedCourse['ZIP'],
            }),
            instructorNames: Array.from(
               new Set(
                  selectedCourses.map((course) => course['Instructor Name']),
               ),
            ),
            price: values.price,
            code: values.code,
         },
      ]);

      courses.set((currentCourses) =>
         currentCourses.filter((_, courseIndex) => {
            const find = selectedCourses.find(
               (course) => course.__rowIndex === courseIndex,
            );
            if (find) {
               return false;
            }
            return true;
         }),
      );

      removeSelectAll();
      reset();
      setLoading(false);
      setShowCreateDialog(false);
   }

   return (
      <>
         <button
            disabled={!selected.length}
            onClick={() => setShowCreateDialog(true)}
            className="px-5 w-44 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
         >
            Create series
            <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
               <MultiplePages className="h-4 w-4" strokeWidth={2} />
            </span>
         </button>
         <Dialog
            open={showCreateDialog}
            onOpenChange={(open) => {
               reset();
               setShowCreateDialog(open);
            }}
            contentClassName="max-w-xl"
         >
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <FolderPlus
                  className="mr-4 h-7 w-7 text-blue-500"
                  strokeWidth={2}
               />
               Create series
            </div>
            <form onSubmit={handleSubmit(createSeries)}>
               <div className="mt-5 flex flex-col gap-5">
                  <div className="grid grid-cols-3 gap-5">
                     <div className="col-span-2">
                        <Input
                           label="Course name"
                           error={errors.courseName}
                           {...registerForm('courseName')}
                        />
                     </div>
                     <div className="col-span-1">
                        <InputNumber
                           iconLabel="$"
                           label="Course price"
                           error={errors.price}
                           value={coursePriceValue}
                           onChange={coursePriceOnChange}
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-3 gap-5">
                     <div className="col-span-2">
                        <Input
                           required={false}
                           label="Course description"
                           error={errors.courseDescription}
                           {...registerForm('courseDescription')}
                        />
                     </div>
                     <div className="col-span-1">
                        <Input
                           required={true}
                           label="Course code"
                           error={errors.code}
                           {...registerForm('code')}
                        />
                     </div>
                  </div>
               </div>
               <div className="mt-10 grid grid-cols-2 gap-2.5">
                  <button
                     type="submit"
                     disabled={loading}
                     className="flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
                  >
                     {loading ? (
                        <>
                           <Spinner className="h-5 w-5 mr-2 -ml-2" />
                           Creating...
                        </>
                     ) : (
                        'Create'
                     )}
                  </button>
                  <button
                     onClick={() => {
                        reset();
                        setShowCreateDialog(false);
                     }}
                     type="button"
                     className="flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
                  >
                     Cancel
                  </button>
               </div>
            </form>
         </Dialog>
      </>
   );
};

const CoursesImportDialog: FC<CoursesImportDialogProps> = ({
   courses,
   showCoursesDialog,
   setShowCoursesDialog,
}) => {
   const selectable = useSelectable<any>(
      hookstate<any[]>(
         courses
            .map((course, courseIndex) => ({
               ...course.value,
               __rowIndex: courseIndex,
            }))
            .filter((course: any) => !course.failed) as any,
      ),
   );

   const [importCourses, importCoursesLoading, importCoursesError] = usePost<
      any,
      any
   >('data', ['import', 'courses']);

   const [archivedCourses, setArchivedCourses] = useState<any[]>([]);
   const [bundles, setBundles] = useState<any[]>([]);
   const [bundleDetectionRan, setBundleDetectionRan] = useState<boolean>(false);
   const [series, setSeries] = useState<any[]>([]);
   const filtered = useHookstate<string | false>(false);
   const filteredCourses = useHookstate<any[]>([]);

   function bundleDetection() {
      setBundleDetectionRan(true);

      const checkCourses = courses
         .get({ noproxy: true })
         .map((course, courseIndex) => ({
            ...course,
            __rowIndex: courseIndex,
         }))
         .filter((course) => !course.failed);

      const HourDrugCourses = checkCourses.filter((course) => {
         const hasCode =
            typeof course['Code'] === 'string'
               ? course['Code'].toLowerCase()
               : course['Code'] === 'SST-302'.toLowerCase();
         const hasName =
            course['Course Name'].toLowerCase() ===
            '2-Hour Drug and Alcohol Awareness'.toLowerCase();

         return !!hasCode && !!hasName;
      });

      const HourFallCourses = checkCourses.filter((course) => {
         const hasCode =
            typeof course['Code'] === 'string'
               ? course['Code'].toLowerCase()
               : course['Code'] === 'SST-307'.toLowerCase();
         const hasName =
            course['Course Name'].toLowerCase() ===
            '8-Hour Fall Prevention'.toLowerCase();

         return !!hasCode && !!hasName;
      });

      const coursesToBeAdded = [];

      for (let di = 0; di < HourDrugCourses.length; ++di) {
         const drugCourse = HourDrugCourses[di];

         for (let fi = 0; fi < HourFallCourses.length; ++fi) {
            const fallCourse = HourFallCourses[fi];

            const languageCheck = compareLowercase(
               fallCourse['Language'],
               drugCourse['Language'],
            );
            const instructorCheck = compareLowercase(
               fallCourse['Instructor Name'],
               drugCourse['Instructor Name'],
            );

            if (languageCheck && instructorCheck) {
               if (
                  drugCourse['Online Class Link'] &&
                  fallCourse['Online Class Link']
               ) {
                  const classLinkCheck = compareLowercase(
                     drugCourse['Online Class Link'],
                     fallCourse['Online Class Link'],
                  );

                  if (classLinkCheck) {
                     HourDrugCourses.splice(di, 1);
                     HourFallCourses.splice(fi, 1);
                     coursesToBeAdded.push([drugCourse, fallCourse]);
                     break;
                  }
               } else if (
                  !drugCourse['Online Class Link'] &&
                  !fallCourse['Online Class Link']
               ) {
                  const zipCheck = fallCourse['ZIP'] === drugCourse['ZIP'];
                  const stateCheck = compareLowercase(
                     fallCourse['State'],
                     drugCourse['State'],
                  );
                  const cityCheck = compareLowercase(
                     fallCourse['City'],
                     drugCourse['City'],
                  );
                  const roomFlCheck = compareLowercase(
                     fallCourse['Rm/Fl'],
                     drugCourse['Rm/Fl'],
                  );
                  const streetCheck = compareLowercase(
                     fallCourse['Street'],
                     drugCourse['Street'],
                  );

                  if (
                     zipCheck &&
                     stateCheck &&
                     cityCheck &&
                     roomFlCheck &&
                     streetCheck
                  ) {
                     HourDrugCourses.splice(di, 1);
                     HourFallCourses.splice(fi, 1);
                     coursesToBeAdded.push([drugCourse, fallCourse]);
                     break;
                  }
               }
            }
         }
      }

      for (let i = 0; i < coursesToBeAdded.length; ++i) {
         const coursesForBundle = coursesToBeAdded[i];

         setArchivedCourses((archivedCourses) => [
            ...archivedCourses,
            ...coursesForBundle.map((course) => {
               const { __rowIndex, ...courseValue } = course;
               return {
                  ...courseValue,
                  bundleIndex: i,
               };
            }),
         ]);

         setBundles((b) => [
            ...b,
            {
               bundle: {
                  name: '10 HR SST',
                  price: 250,
               },
               courses: coursesForBundle.map((course) => ({
                  courseName: course['Course Name'],
                  language: course['Language'],
                  schedule: [
                     {
                        date: course['Start Date'],
                        startTime: course['Start Time'],
                        endTime: course['End Time'],
                     },
                  ],
                  ...filterNoneProperties({
                     onlineClassLink: course['Online Class Link'],
                     password: course['Password'],
                     street: course['Street'],
                     rmFl: course['Rm/Fl'],
                     city: course['City'],
                     state: course['State'],
                     zip: course['ZIP'],
                  }),
                  instructorNames: [course['Instructor Name']],
                  price: course['Price']
                     ? course['Price'].length
                        ? parseFloat(course['Price'])
                        : 0
                     : 0,
                  code: course['Code'],
               })),
            },
         ]);

         courses.set((currentCourses) =>
            currentCourses.filter((_, courseIndex) => {
               const find = coursesForBundle.find(
                  (course) => course.__rowIndex === courseIndex,
               );
               if (find) {
                  return false;
               }
               return true;
            }),
         );
      }
   }

   useEffect(() => {
      if (courses.length && !bundleDetectionRan) bundleDetection();
   }, [courses, bundleDetectionRan]);

   const bulkUploadTableSchema: TVisualizationTableRootSchema<TBulkImportsCourse> =
      {
         __root: {
            render: (children, values, rowIndex) => {
               if (values.failed) {
                  return (
                     <div className="bg-red-100 -mb-px z-10 border-b border-red-200 flex-grow">
                        {children}
                     </div>
                  );
               }
               const find = bundles.find((bundle: any) => {
                  const findCourse = bundle.courses.find(
                     (course: any) => course.__rowIndex === rowIndex,
                  );
                  return !!findCourse;
               });
               if (!!find) {
                  return (
                     <div className="bg-blue-100 z-10 -mb-px flex-grow border-b border-blue-200">
                        {children}
                     </div>
                  );
               }

               return children;
            },
            actions: (values, rowIndex) => {
               if (values.failed) {
                  return {
                     'Delete Course': () => deleteCourse(rowIndex),
                  };
               }
               return false;
            },
         },
         courseIndex: {
            hidden: true,
         },
         "Today's Date": {
            hidden: true,
         },
         reason: {
            hidden: true,
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
      };

   function BundleFindMinMaxStartDates(courses: any) {
      let earliestDate = new Date(courses[0].schedule[0].date);
      let latestDate = new Date(courses[0].schedule[0].date);

      for (let i = 1; i < courses.length; i++) {
         const currentDate = new Date(courses[i].schedule[0].date);

         if (currentDate < earliestDate) {
            earliestDate = currentDate;
         }

         if (currentDate > latestDate) {
            latestDate = currentDate;
         }
      }

      return {
         earliest: earliestDate.toLocaleDateString('en-US'),
         latest: latestDate.toLocaleDateString('en-US'),
      };
   }

   function SeriesFindMinMaxStartDates(schedule: any) {
      let earliestDate = new Date(schedule[0].date);
      let latestDate = new Date(schedule[0].date);

      for (let i = 1; i < schedule.length; i++) {
         const currentDate = new Date(schedule[i].date);

         if (currentDate < earliestDate) {
            earliestDate = currentDate;
         }

         if (currentDate > latestDate) {
            latestDate = currentDate;
         }
      }

      return {
         earliest: earliestDate.toLocaleDateString('en-US'),
         latest: latestDate.toLocaleDateString('en-US'),
      };
   }

   function startImport() {
      const allCourses = courses.get({ noproxy: true });

      toast.promise(
         importCourses(
            {
               courses: allCourses
                  .filter((course) => !course.failed)
                  .map((course) => ({
                     courseName: course['Course Name'],
                     language: course['Language'],
                     schedule: [
                        {
                           date: course['Start Date'],
                           startTime: course['Start Time'],
                           endTime: course['End Time'],
                        },
                     ],
                     ...filterNoneProperties({
                        onlineClassLink: course['Online Class Link'],
                        password: course['Password'],
                        street: course['Street'],
                        rmFl: course['Rm/Fl'],
                        city: course['City'],
                        state: course['State'],
                        zip: course['ZIP'],
                     }),
                     instructorNames: [course['Instructor Name']],
                     price: course['Price']
                        ? course['Price'].length
                           ? parseFloat(course['Price'])
                           : 0
                        : 0,
                     code: course['Code'],
                  })),
               bundles,
               series,
            },
            {
               success: (data) => {
                  reset();
                  setShowCoursesDialog(false);
               },
               fail: (message) => {
                  console.log(message);
               },
            },
            {
               throw: true,
            },
         ),
         {
            loading: `Importing Courses, Bundles & Series...`,
            success: `Courses, Bundles & Series imported`,
            error: 'Failed importing',
         },
      );
   }

   function filterBundle(bundle: any, bundleIndex: number) {
      filtered.set(`(${bundleIndex + 1}) ${bundle.bundle.name}`);
      filteredCourses.set(
         bundle.courses.map((course: any) => ({
            'Course Name': course.courseName,
            Language: course.language,
            'Start Date': course.schedule[0].date,
            'Start Time': course.schedule[0].startTime,
            'End Time': course.schedule[0].endTime,
            'Online Class Link': course.onlineClassLink ?? '',
            Password: course.password ?? '',
            Street: course.street ?? '',
            'Rm/Fl': course.rmFl ?? '',
            City: course.city,
            State: course.state,
            ZIP: course.zip,
            'Instructor Name': course.instructorNames[0],
            Price: course.price.toString(),
            Code: course.code,
         })),
      );
   }

   function filterSeries(course: any) {
      filtered.set(course.courseName);
      filteredCourses.set(
         course.schedule.map((schedule: any) => ({
            'Course Name': course.courseName,
            Language: course.language,
            'Start Date': schedule.date,
            'Start Time': schedule.startTime,
            'End Time': schedule.endTime,
            'Online Class Link': course.onlineClassLink ?? '',
            Password: course.password ?? '',
            Street: course.street ?? '',
            'Rm/Fl': course.rmFl ?? '',
            City: course.city,
            State: course.state,
            ZIP: course.zip,
            'Instructor Name': course.instructorNames,
            Price: course.price.toString(),
            Code: course.code,
         })),
      );
   }

   function deleteCourse(rowIndex: number) {
      courses.set(
         courses
            .get({ noproxy: true })
            .filter((_, courseIndex) => courseIndex !== rowIndex),
      );
   }

   function deleteBundle(bundleIndex: number) {
      setBundles((currentBundles) =>
         currentBundles.filter(
            (_, currentBundleIndex) => currentBundleIndex !== bundleIndex,
         ),
      );
      const bundleCourses = archivedCourses.filter(
         (ac) => ac.bundleIndex === bundleIndex,
      );
      courses.set((currentCourses) => {
         const newCourses = [
            ...currentCourses,
            ...bundleCourses.map((bundleCourse) => {
               const { bundleIndex, ...bundleCourseValues } = bundleCourse;
               return bundleCourseValues;
            }),
         ];
         return newCourses.sort((a, b) => a.courseIndex - b.courseIndex);
      });
      setArchivedCourses((archivedCourses) =>
         archivedCourses.filter((ac) => ac.bundleIndex !== bundleIndex),
      );
      resetFilter();
   }

   function deleteSeries(seriesIndex: number) {
      setSeries((currentSeries) =>
         currentSeries.filter(
            (_, currentSeriesIndex) => currentSeriesIndex !== seriesIndex,
         ),
      );
      const seriesCourses = archivedCourses.filter(
         (ac) => ac.seriesIndex === seriesIndex,
      );
      courses.set((currentCourses) => {
         const newCourses = [
            ...currentCourses,
            ...seriesCourses.map((seriesCourse) => {
               const { seriesIndex, ...seriesCourseValues } = seriesCourse;
               return seriesCourseValues;
            }),
         ];
         return newCourses.sort((a, b) => a.courseIndex - b.courseIndex);
      });
      setArchivedCourses((archivedCourses) =>
         archivedCourses.filter((ac) => ac.seriesIndex !== seriesIndex),
      );
      resetFilter();
   }

   function resetFilter() {
      filtered.set(false);
      filteredCourses.set([]);
   }

   function reset() {
      resetFilter();
      setBundleDetectionRan(false);
      courses.set([]);
      setArchivedCourses([]);
      setBundles([]);
      setSeries([]);
   }

   return (
      <Dialog
         open={showCoursesDialog}
         onOpenChange={(open) => {
            reset();
            setShowCoursesDialog(open);
         }}
         contentClassName="max-w-5xl"
      >
         <div className="mt-3">
            <VisualizationTable
               name="Courses"
               maxHeight="max-h-[500px]"
               actionsClassName="bg-red-100"
               data={filteredCourses.length ? filteredCourses : courses}
               schema={bulkUploadTableSchema}
               handleCasing={false}
               selectable={filteredCourses.length ? false : selectable}
               buttons={[
                  <CreateBundle
                     key="createBundle"
                     courses={courses}
                     setArchivedCourses={setArchivedCourses}
                     selectable={selectable}
                     setBundles={setBundles}
                     bundles={bundles}
                  />,
                  <CreateSeries
                     key="createSeries"
                     courses={courses}
                     setArchivedCourses={setArchivedCourses}
                     selectable={selectable}
                     setSeries={setSeries}
                     series={series}
                  />,
               ]}
               filtered={filtered}
               filteredReset={resetFilter}
            />
         </div>
         <div className="mt-8">
            <p className="inline-flex items-center font-semibold text-xl tracking-tight">
               <Folder className="mr-4 h-7 w-7 text-blue-500" strokeWidth={2} />
               Courses Bundles
            </p>
            <div className="mt-4 flex flex-col border border-zinc-300 rounded-2xl bg-zinc-100 min-h-[190px] max-h-[300px] overflow-auto">
               {bundles.length ? (
                  bundles.map((bundle, bundleIndex) => {
                     const { earliest, latest } = BundleFindMinMaxStartDates(
                        bundle.courses,
                     );
                     return (
                        <div
                           key={bundleIndex}
                           onClick={() => filterBundle(bundle, bundleIndex)}
                           className={clsx(
                              'p-5 w-full flex items-center relative justify-center transition duration-200 ease-linear text-center border-b border-t -mt-px',
                              bundleIndex + 1 >= 3 && 'last:!border-b-0',
                              filtered.value ===
                                 `(${bundleIndex + 1}) ${bundle.bundle.name}`
                                 ? 'bg-blue-200 border-blue-300 z-10'
                                 : 'bg-white hover:bg-blue-100 hover:border-blue-300 border-zinc-200 hover:z-10',
                           )}
                           role="button"
                        >
                           <div className="absolute inset-y-0 right-5 flex items-center">
                              <button
                                 onClick={(e: any) => {
                                    e.stopPropagation();
                                    deleteBundle(bundleIndex);
                                 }}
                                 className="p-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-transparent outline-none hover:border-zinc-200 transition duration-200 ease-linear text-red-500"
                              >
                                 <Trash className="h-5 w-5" strokeWidth={2} />
                              </button>
                           </div>
                           <p className="text-base font-medium">
                              {bundle.bundle.name}
                           </p>
                           <p className="ml-5 text-zinc-500">
                              {earliest} - {latest}
                           </p>
                        </div>
                     );
                  })
               ) : (
                  <div className="m-auto">
                     <p className="text-zinc-500 tracking-tight font-medium">
                        No courses bundles created
                     </p>
                  </div>
               )}
            </div>
         </div>
         <div className="mt-10">
            <p className="inline-flex items-center font-semibold text-xl tracking-tight">
               <MultiplePages
                  className="mr-4 h-7 w-7 text-blue-500"
                  strokeWidth={2}
               />
               Courses Series
            </p>
            <div className="mt-5 flex flex-col border border-zinc-300 rounded-2xl bg-zinc-100 min-h-[190px] max-h-[300px] overflow-auto">
               {series.length ? (
                  series.map((course, courseIndex) => {
                     const { earliest, latest } = SeriesFindMinMaxStartDates(
                        course.schedule,
                     );

                     return (
                        <div
                           key={courseIndex}
                           onClick={() => filterSeries(course)}
                           className={clsx(
                              'p-5 w-full flex items-center relative justify-center transition duration-200 ease-linear text-center border-b border-t -mt-px',
                              courseIndex + 1 >= 3 && 'last:!border-b-0',
                              filtered.value === course.courseName
                                 ? 'bg-blue-200 border-blue-300 z-10'
                                 : 'bg-white hover:bg-blue-100 hover:border-blue-300 border-zinc-200 hover:z-10',
                           )}
                           role="button"
                        >
                           <div className="absolute inset-y-0 right-5 flex items-center">
                              <button
                                 onClick={(e: any) => {
                                    e.stopPropagation();
                                    deleteSeries(courseIndex);
                                 }}
                                 className="p-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-transparent outline-none hover:border-zinc-200 transition duration-200 ease-linear text-red-500"
                              >
                                 <Trash className="h-5 w-5" strokeWidth={2} />
                              </button>
                           </div>
                           <p className="text-base font-medium">
                              {course.courseName}
                           </p>
                           <p className="ml-5 text-zinc-500">
                              {earliest} - {latest}
                           </p>
                        </div>
                     );
                  })
               ) : (
                  <div className="m-auto">
                     <p className="text-zinc-500 tracking-tight font-medium">
                        No courses bundles created
                     </p>
                  </div>
               )}
            </div>
         </div>
         <div className="mt-10 gap-x-2.5 w-full flex items-center justify-end">
            <button
               onClick={() => {
                  reset();
                  setShowCoursesDialog(false);
               }}
               className="py-3 inline-flex items-center px-6 font-medium rounded-xl bg-red-500 transition duration-200 ease-linear hover:bg-red-600 text-white"
            >
               Cancel
            </button>
            <button
               disabled={importCoursesLoading}
               onClick={startImport}
               className="py-3 px-6 disabled:opacity-75 inline-flex items-center disabled:hover:bg-blue-500 disabled:cursor-not-allowed font-medium rounded-xl bg-blue-500 transition duration-200 ease-linear hover:bg-blue-600 text-white"
            >
               {importCoursesLoading ? (
                  <>
                     <Spinner className="h-5 w-5 mr-2 -ml-2" />
                     Importing...
                  </>
               ) : (
                  'Import'
               )}
            </button>
         </div>
      </Dialog>
   );
};

export default CoursesImportDialog;
