import CourseContent from './Tabs/Tab/CourseContent';
import CourseDetails from './Tabs/Tab/CourseDetails';
import QuizSurveyManagement from './Tabs/Tab/QuizSurveyManagement';
import StudentManagement from './Tabs/Tab/StudentManagement';

export type LiveClassroomManagementTab =
   | 'Course Details'
   | 'Students Management'
   | 'Quiz/Survey Management'
   | 'Course Content';

export const LiveClassroomManagementTabs: LiveClassroomManagementTab[] = [
   'Course Details',
   'Students Management',
   'Quiz/Survey Management',
   'Course Content',
];

export const LiveClassroomManagementTabsComponents = [
   CourseDetails,
   StudentManagement,
   QuizSurveyManagement,
   CourseContent,
];
