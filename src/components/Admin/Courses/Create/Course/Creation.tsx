'use client';

import SaveButton from '@/components/ui/Buttons/Save';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { filterZeroProperties, getDropdownObjectValue } from '@/lib/helpers';
import { ImmutableArray, ImmutableObject, useHookstate } from '@hookstate/core';
import { PagePlus, Upload } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import CourseTabsRender from './Tabs/Render';
import {
   certificationSchema,
   certificationSchemaType,
   useCertification,
} from './Tabs/Tab/Certification';
import { useContent } from './Tabs/Tab/Content/Content';
import {
   generalInformationSchema,
   generalInformationSchemaType,
   useGeneralInformation,
} from './Tabs/Tab/GeneralInformation';
import { useQuizSurveys } from './Tabs/Tab/QuizSurveys';
import {
   seriesSettingsSchema,
   seriesSettingsSchemaType,
   useSeriesSettings,
} from './Tabs/Tab/SeriesSettings';
import CourseTabs from './Tabs/Tabs';

interface CourseCreationProps {}

const CourseCreation: FC<CourseCreationProps> = () => {
   const router = useRouter();

   const generalInformation = useGeneralInformation((state) => state.data);
   const resetGeneralInformation = useGeneralInformation(
      (state) => state.reset
   );
   const seriesSettings = useSeriesSettings((state) => state.data);
   const resetSeriesSettings = useSeriesSettings((state) => state.reset);

   const certification = useCertification((state) => state.data);
   const resetCertification = useCertification((state) => state.reset);

   const content = useContent((state) => state.data);
   const resetContent = useContent((state) => state.reset);

   const quizSurveys = useQuizSurveys((state) => state.data);
   const resetQuizSurveys = useQuizSurveys((state) => state.reset);

   const [tab, setTab] = useState<number>(0);

   function Reset() {
      resetGeneralInformation();
      resetCertification();
      resetSeriesSettings();
      resetContent();
      resetQuizSurveys();
   }

   useEffect(() => {
      Reset();
   }, []);

   const canSave = useMemo(() => {
      const generalInformationCheck =
         generalInformationSchema.safeParse(generalInformation);
      const seriesSettingsCheck =
         seriesSettingsSchema.safeParse(seriesSettings);
      const certificationCheck = certificationSchema.safeParse(certification);

      return (
         !!generalInformationCheck.success &&
         !!seriesSettingsCheck.success &&
         !!certificationCheck.success
      );
   }, [generalInformation, seriesSettings, certification]);

   const [createCourse, loading] = usePost<
      {
         general: ImmutableObject<
            Omit<generalInformationSchemaType, 'coursePicture'>
         >;
         series: ImmutableObject<seriesSettingsSchemaType>;
         certification: ImmutableObject<certificationSchemaType>;
         quizzes: ImmutableArray<string>;
         surveys: ImmutableArray<string>;
         // content: ImmutableArray<contentType>;
         active: boolean;
      },
      { courseId: string }
   >('courses', 'create');

   const createdCourseId = useHookstate('');

   const [uploadCourseContents, loadingContents] = usePost<FormData, any>(
      'courses',
      ['content', 'upload', createdCourseId]
   );

   function UploadContents() {
      const formData = new FormData();

      formData.append('coursePicture', generalInformation.coursePicture!);
      content.content.forEach((c) => {
         formData.append('content', c, c.name);
      });

      toast.promise(
         uploadCourseContents(
            formData,
            {
               success: () => {
                  Reset();
                  router.refresh();
                  router.push('/admin/courses?table=Courses');
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
            loading: '(2/2) Uploading course contents...',
            success: '(2/2) Course contents uploaded',
            error: 'Failed uploading course content',
         }
      );
   }

   function Create(active: boolean = false) {
      if (canSave) {
         const frequency = seriesSettings.frequency!;
         let classFrequency: any;

         switch (frequency) {
            case 'Daily':
               classFrequency = {
                  days: { ...seriesSettings.classFrequency!.days },
               };
               break;
            case 'Weekly':
               classFrequency = {
                  weeks: { ...seriesSettings.classFrequency!.weeks },
               };
               break;
            case 'Monthly':
               classFrequency = {
                  months: { ...seriesSettings.classFrequency!.months },
               };
               break;
            case 'Yearly':
               classFrequency = {
                  years: { ...seriesSettings.classFrequency!.years },
               };
               break;
         }

         const prerequisites = generalInformation.prerequisites;
         const instructors = generalInformation.instructors;
         const quizzes = quizSurveys.quizzes;
         const surveys = quizSurveys.surveys;

         const { coursePicture, ...general } = generalInformation;

         toast.promise(
            createCourse(
               {
                  general: {
                     ...general,
                     instructors: getDropdownObjectValue(instructors),
                     prerequisites: getDropdownObjectValue(prerequisites),
                  },
                  series: {
                     firstClassDtm: seriesSettings.firstClassDtm!,
                     frequency,
                     classesInSeries: seriesSettings.classesInSeries!,
                     classFrequency,
                  },
                  certification: certification.certificate
                     ? {
                          certificate: true,
                          certificateName: certification.certificateName!.length
                             ? certification.certificateName
                             : `${
                                  generalInformation.courseCode &&
                                  generalInformation.courseCode + ', '
                               }${generalInformation.courseName}`,
                          expiration: filterZeroProperties({
                             years: certification.expiration.years || 0,
                             months: certification.expiration.months || 0,
                          }),
                       }
                     : ({
                          certificate: false,
                       } as any),
                  quizzes: getDropdownObjectValue(quizzes),
                  surveys: getDropdownObjectValue(surveys),
                  active,
               },
               {
                  success: ({ courseId }) => {
                     createdCourseId.set(courseId);
                     UploadContents();
                  },
               },
               { throw: true }
            ),
            {
               loading: '(1/2) Creating course...',
               success: '(1/2) Course created',
               error: 'Failed creating course',
            }
         );
      }
   }

   function Cancel() {
      router.push('/admin/courses');
   }

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <PagePlus
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Course creation
            </div>
            <div className="flex items-center gap-2.5">
               <SaveButton
                  disabled={!canSave || loading || loadingContents}
                  onClick={() => Create()}
                  loading={loading || loadingContents}
               />
               <button
                  disabled={!canSave}
                  onClick={() => Create(true)}
                  className="px-5 w-48 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
               >
                  Save and Publish
                  <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                     {!!loading || !!loadingContents ? (
                        <Spinner className="h-4 w-4" />
                     ) : (
                        <Upload className="h-4 w-4" strokeWidth={2} />
                     )}
                  </span>
               </button>
               <button
                  onClick={Cancel}
                  className="px-5 py-3.5 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm bg-gradient-to-b from-red-500 to-red-600 rounded-2xl shadow-inner-red"
               >
                  Cancel
               </button>
            </div>
         </div>
         <div className="flex mt-5 flex-grow gap-5 h-[1px]">
            <CourseTabs tab={tab} setTab={setTab} />
            <div
               key={tab}
               className="flex-1 p-10 flex flex-col overflow-auto relative rounded-2xl bg-zinc-50 border border-zinc-200"
            >
               <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
                  <CourseTabsRender tab={tab} setTab={setTab} />
               </div>
            </div>
         </div>
      </div>
   );
};

export default CourseCreation;
