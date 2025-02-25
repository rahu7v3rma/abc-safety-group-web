'use client';

import { Dispatch, FC, SetStateAction } from 'react';

import GeneralInformation from './Tab/GeneralInformation';
import SeriesSettings from './Tab/SeriesSettings';
import Content from './Tab/Content/Content';
import QuizSurveys from './Tab/QuizSurveys';
import PreviewCertificate from './Tab/PreviewCertificate/PreviewCertificate';

import {
   TAdminTableCourseData,
   TAdminTableFormData,
   TUserData,
} from '@/lib/types';
import Certification from './Tab/Certification';

const tabs = [
   GeneralInformation,
   SeriesSettings,
   Certification,
   Content,
   QuizSurveys,
   PreviewCertificate,
];

interface CourseTabsRenderProps {
   tab: number;
   setTab: Dispatch<SetStateAction<number>>;
}

const CourseTabsRender: FC<CourseTabsRenderProps> = ({ tab, setTab }) => {
   if (tab > tabs.length - 1) return null;

   const CurrentTab = tabs[tab];

   return <CurrentTab tab={tab} setTab={setTab} />;
};

export default CourseTabsRender;
