import { StaticImageData } from 'next/image';
import { Dispatch, ReactNode, SetStateAction } from 'react';

import * as iconoirIcons from 'iconoir-react';

export type Config = {
   logo: string | StaticImageData;
   name: string;
   api: string;
};

// ---- api functionality types ----

export type APIResponse<P, PA = true> =
   | ({ success: true } & APIResponseSuccess<P, PA>)
   | ({ success: false } & APIResponseError);

export type APIResponseSuccess<P, PA = true> = {
   payload: PA extends true ? P & { pagination: APIResponsePagination } : P;
   message?: never;
};

export type APIResponseError = {
   message?: string;
   detail?: string;
   payload?: never;
};

export type APIResponseActions<P> = {
   success?: ActionsSuccess<P>;
   fail?: ActionsFail<P>;
   error?: ActionsError;
};

export type ActionsSuccess<P> = (payload: P) => void;
export type ActionsFail<P> = (message: string, payload?: P) => void;
export type ActionsError = (message: string) => void;

export type APIResponsePagination = {
   curPage: number;
   totalPages: number;
   pageSize: number;
   totalCount: number;
};

export type TWithPagination<D> = D & { pagination: APIResponsePagination };

export type TWithOTT<T> = T & {
   ott?: string;
};

export type TUserData = {
   userId: string;
   firstName: string;
   middleName: string;
   lastName: string;
   suffix: string;
   email: string;
   phoneNumber: string;
   dob: string;
   password: string;
   timeZone: string;
   headShot: string;
   state: string;
   city: string;
   eyeColor: string;
   gender: string;
   height: {
      feet: number;
      inches: number;
   };
   photoIdPhoto: string;
   otherIdPhoto?: string;
   textNotifications: boolean;
   emailNotifications: boolean;
   address: string;
   zipcode: string;
   active: boolean;
   expirationDate?: string;
};

export type TUser = TUserData | false;

export interface TUserContext {
   user: TUser;
   updateUser: Dispatch<SetStateAction<TUser>>;
}

export interface TUserContextForce {
   user: TUserData;
   updateUser: Dispatch<SetStateAction<TUser>>;
}

export type TRoleData = {
   roleId: string;
   roleName: TUserRoles;
   roleDesc: string;
};

export type TRoles = TRoleData[] | false;

export interface TRolesContext {
   roles: TRoles;
   updateRoles: Dispatch<SetStateAction<TRoles>>;
}

export interface TRolesContextForce {
   roles: TRoleData[];
   updateRoles: Dispatch<SetStateAction<TRoles>>;
}

export type TPermissionData = {
   permissionId: string;
   permissionNode: string;
   description: string;
};

export type TPermissions = TPermissionData[];

export interface TPermissionsContext {
   permissions: TPermissions;
   updatePermissions: Dispatch<SetStateAction<TPermissions>>;
}

type RootRenderFunction<D> = (
   children: ReactNode,
   values: D,
   rowIndex: number
) => ReactNode;
type RootActionsFunction<D> = (
   values: D,
   rowIndex: number
) => Record<string, any> | false;

type RootCustomActionsFunction<D> = ((values: D) => JSX.Element | null)[];

type RenderFunction<D, K extends keyof D> = (
   value: D[K],
   values: D,
   rowIndex: number
) => ReactNode;

export type TVisualizationTableSchema<D> = {
   [K in keyof D]?: {
      name?: string;
      allowNull?: boolean;
      inline?: number;
      hidden?: boolean;
      render?: K extends keyof D ? RenderFunction<D, K> : never;
   };
};

//
// ** this breaks nextjs build process completely due to memory overload **
//
// type TupleUnion<U extends string | number | symbol, R extends any[] = []> = {
//    [S in U]: Exclude<U, S> extends never
//       ? [...R, S]
//       : TupleUnion<Exclude<U, S>, [...R, S]>;
// }[U];

// export type TVisualizationTableRootSchema<D, CO = false> = {
//    __root?: {
//       render?: RootRenderFunction<D>;
//       actions?: RootActionsFunction<D>;
//       columnsOrder?: CO extends false ? TupleUnion<keyof D> : string[];
//    };
// } & TVisualizationTableSchema<D>;

export type TVisualizationTableRootSchema<D, CO = false> = {
   __root?: {
      render?: RootRenderFunction<D>;
      actions?: RootActionsFunction<D>;
      customActions?: RootCustomActionsFunction<D>;
      columnsOrder?: CO extends false ? Array<keyof D> : string[];
   };
} & TVisualizationTableSchema<D>;

export type TVisualizationTableColumnsState = {
   [key: string]: {
      width: number;
   };
};

export type TVisualizationTableFunctions = {
   search?: TVisualizationTableSearch<any>;
} & {
   [K in TVisualizationTableButtons]?: () => void;
};

export type TVisualizationTableDisableds = {
   [K in keyof TVisualizationTableFunctions]?: boolean;
};

export type TVisualizationTableLoadings = {
   [K in keyof TVisualizationTableFunctions]?: boolean;
};

export type TVisualizationTableErrors = {
   [K in keyof TVisualizationTableFunctions]?: false | string;
};

export type TVisualizationTableSearch<O = undefined> = (
   value: string,
   option: O
) => void;

export type TVisualizationTableCustomButtonsProps = {
   disabled?: boolean;
};

// ---- general types ----

export type TAPIRouters =
   | 'users'
   | 'courses'
   | 'data'
   | 'forms'
   | 'admin'
   | 'transactions'
   | 'instructor';

export type TPanels = 'admin' | 'student' | 'instructor';

export type TUserRoles = 'superuser' | 'admin' | 'instructor' | 'student';

export type TUsers = 'admin' | 'instructor' | 'student';

export type TVisualizationTableButtons = 'export' | 'filter' | 'create';

export type TImageSizes = 16 | 24 | 60 | 300 | 600 | 1024;

export type Panel = 'admin' | 'student' | 'instructor';

export type Payment = 'cash' | 'paypal';

export type TIcons = keyof typeof iconoirIcons;

// ---- view types ----

export type TStudentCertificatesData = {
   courseId: string;
   courseName: string;
   studentName: string;
   completionDate: string;
   expirationDate: string;
};

export type TStudentCoursesData = {
   courseId: string;
   coursePicture: string;
   courseName: string;
   courseStatus: string;
};

export type TStudentCoursesCatalogData = {
   courseId: string;
   courseName: string;
   courseType: string;
   totalClasses: number;
   coursePicture: string;
   enrollment: boolean;
   waitList: boolean;
};

export type TAdminTableClassScheduleData = {
   courseId: string;
   courseName: string;
   seriesNumber: number;
   startTime: string;
   endTime: string;
   duration: number;
   complete: boolean;
   inProgress: boolean;
   address: string;
   remoteLink: string;
   instructors: string;
   languages: string;
};

export type TInstructorTableClassScheduleData = TAdminTableClassScheduleData;

export type TAdminTableUserManagementData = {
   userId: string;
   firstName: string;
   lastName: string;
   dob: string;
   email: string;
   phoneNumber: string;
   headShot: string;
};

export type TInstructorTableStudentManagementData =
   TAdminTableUserManagementData;

export type TAdminTableCourseData = {
   courseId: string;
   coursePicture?: string;
   courseType: string;
   courseName: string;
   briefDescription: string;
   totalClasses: number;
   startDate: string;
   active: boolean;
};

export type TAdminTableBundleData = {
   bundleId: string;
   bundlePicture?: string;
   courseType: string;
   bundleName: string;
   briefDescription: string;
   totalClasses: number;
   startDate: string;
   active: boolean;
   complete: boolean;
};

export type TAdminTableCourseAndBundleData = {
   id: string;
   picture?: string;
   name: string;
   type: 'bundle' | 'course';
   startDate: string;
   totalClasses: number;
   active: boolean;
   complete: boolean;
   briefDescription?: string;
};

export type TAdminTableCertficateData = {
   userId: string;
   headShot: string;
   firstName: string;
   lastName: string;
   certificateNumber: string;
   certificateName: string;
   completionDate: string;
   expirationDate: string;
};

export type TAdminTableTransactionData = {
   userId: string;
   headShot?: string;
   firstName?: string;
   lastName?: string;
   transactionId: string;
   transactionDate: string;
   amount: number;
   void: boolean;
};

export type TQuizQuestionChoiceData = {
   description: string;
   choicePosition: number;
   active: boolean;
   isCorrect: boolean;
};

export type TQuizQuestionData = {
   questionNumber: number;
   description: string;
   pointValue: number;
   answerType: string;
   active: boolean;
   choices: TQuizQuestionChoiceData[];
};

export type TQuizCreationData = {
   formName: string;
   passingPoints: number;
   active: boolean;
   questions: TQuizQuestionData[];
   attempts: number;
   duration: number;
};

export type TQuizUpdateData = {
   formId: string;
   formName: string;
   passingPoints: number;
   active: boolean;
   questions: TQuizQuestionData[];
   attempts: number;
   duration: number;
};

export type TSurveyQuestionChoiceData = {
   description: string;
   choicePosition: number;
   active: boolean;
};

export type TSurveyQuestionData = {
   questionNumber: number;
   description: string;
   answerType: string;
   active: boolean;
   choices?: TSurveyQuestionChoiceData[];
};

export type TSurveyCreationData = {
   formName: string;
   active: boolean;
   questions: TSurveyQuestionData[];
};

export type TSurveyUpdateData = {
   formId: string;
   formName: string;
   active: boolean;
   questions: TSurveyQuestionData[];
};

export type TAdminTableFormData = {
   formId: string;
   formName: string;
   formType: string;
   active: string;
};

export type TAdminFormQuizQuestionChoice = {
   description: string;
   active: boolean;
   isCorrect: boolean;
};

export type TAdminFormQuizQuestion = {
   questionId: string;
   description: string;
   pointValue?: number;
   answerType: string;
   active: boolean;
   choices?: TAdminFormQuizQuestionChoice[];
};

export type TCourseDetailsData = {
   courseId: string;
   coursePicture?: string;
   courseType: string;
   courseName: string;
   briefDescription: string;
   description: string;
   instructionTypes: string[];
   totalClasses: number;
   startDate: string;
   active: boolean;
   languages: string[];
   maxStudents: number;
   isFull: boolean;
   waitlist: boolean;
   instructors: TUserData[];
   price: number;
   prerequisites: TAdminTableCourseData[];
   phoneNumber: string;
   email: string;
   complete: boolean;
   enrollable: boolean;
   allowCash: boolean;
};

export type TBundleDetailsData = {
   bundleId: string;
   bundleName: string;
   price: number;
   active: boolean;
   maxStudents: number;
   isFull: boolean;
   waitlist: boolean;
   languages: string[];
   instructionTypes: string[];
   courses: TAdminTableCourseData[];
   complete: boolean;
   enrollable: boolean;
   allowCash: boolean;
};

export type TBundleCreationData = {
   bundleId?: string;
   bundleName: string;
   active: boolean;
   maxStudents?: number;
   waitlist: boolean;
   price: number;
   allowCash: boolean;
   description?: string;
   enrollable?: boolean;
   briefDescription?: string;
   courseIds: string[];
};

export type TCourseUpdateDetailsData = {
   courseId: string;
   courseName: string;
   courseCode?: string;
   coursePicture: string;
   briefDescription: string;
   description: string;
   languages: string[];
   price: number;
   instructionTypes: string[];
   remoteLink: string;
   phoneNumber: string;
   email: string;
   address: string;
   active: boolean;
   maxStudents: number;
   enrollable: boolean;
   allowWaitList: boolean;
   waitlistLimit: number;
   allowCash: boolean;
   instructors: TCourseUpdateDetailsInstructor[];
   prerequisites: TCourseUpdateDetailsPrerequisite[];
};
export interface TCourseUpdateDetailsInstructor {
   userId: string;
   firstName: string;
   lastName: string;
}

export interface TCourseUpdateDetailsPrerequisite {
   courseId: string;
   courseName: string;
}

export interface TBundleUpdateDetailsData {
   bundleId: string;
   bundleName: string;
   active: boolean;
   maxStudents: number;
   waitList: boolean;
   waitlistLimit: number;
   price: number;
   allowCash: boolean;
   enrollable: boolean;
   courses: TBundleUpdateDetailsCourse[];
}

export interface TBundleUpdateDetailsCourse {
   courseId: string;
   courseName: string;
}

export interface TFormQuizDetails {
   formId: string;
   formName: string;
   active: boolean;
   passingPoints: number;
   questionsCount: number;
   questions: TAdminFormQuizDetailsQuestion[] | false;
   attempts: number;
   duration: number;
}

export interface TAdminFormQuizDetailsQuestion {
   questionId: string;
   questionNumber: number;
   description: string;
   pointValue: number;
   answerType: string;
   active: boolean;
   choices: TAdminFormQuizDetailsQuestionChoice[];
}

export interface TAdminFormQuizDetailsQuestionChoice {
   description: string;
   choicePosition: number;
   active: boolean;
   isCorrect: boolean;
}

export interface TFormSurveyDetails {
   formId: string;
   formName: string;
   active: boolean;
   questionsCount: number;
   questions: TAdminFormSurveyDetailsQuestion[] | false;
}

export interface TAdminFormSurveyDetailsQuestion {
   questionId: string;
   questionNumber: number;
   description: string;
   pointValue: number;
   answerType: string;
   active: boolean;
   choices: TAdminFormSurveyDetailsQuestionChoice[];
}

export interface TAdminFormSurveyDetailsQuestionChoice {
   description: string;
   choicePosition: number;
   active: boolean;
   isCorrect: boolean;
}

export type TQuizSurveyDetailsQuestion =
   | TAdminFormQuizDetailsQuestion
   | TAdminFormSurveyDetailsQuestion;

export type TStudentTableScheduleData = {
   courseId: string;
   courseName: string;
   seriesNumber: number;
   startTime: string;
   endTime: string;
   duration: number;
   complete: boolean;
   inProgress: boolean;
   address: string;
   remoteLink: string;
   instructors: string;
   languages: string;
};

export type TInstructorTableScheduleData = TStudentTableScheduleData;

export type TStudentTableCourseData = {
   coursePicture: string;
   courseId: string;
   courseName: string;
   briefDescription: string;
   totalClasses: number;
   courseType: string;
   complete: boolean;
   startDate: string;
};

export type TInstructorTableCourseData = TStudentTableCourseData;

export type TStudentTableBundleData = {
   bundlePicture: string;
   bundleId: string;
   bundleName: string;
   active: boolean;
   complete: boolean;
   totalClasses: number;
   courseType: string;
   startDate: string;
};

export type TStudentTableCertificateData = {
   userId: string;
   certificateName: string;
   certificateNumber: string;
   student: string;
   instructor: string;
   completionDate: string;
   expirationDate: string;
};

export type TStudentTableTransactionData = {
   userId: string;
   transactionId: string;
   transactionDate: string;
   amount: number;
   void: boolean;
};

export type TBulkImportsStudent = TUserData & {
   failed: boolean;
   reason?: string;
   height: string;
};

export type TBulkImportsCourse = {
   failed: boolean;
   reason: any;
   "Today's Date": string;
   'ID #': string;
   'Course Name': string;
   Language: string;
   'Start Date': string;
   'Start Time': string;
   'End Time': string;
   'Online Class Link': any;
   Password: any;
   Street: string;
   'Rm/Fl': string;
   City: string;
   State: string;
   ZIP: number;
   'Instructor Name': string;
   Price: string;
   'Private?': any;
   Code: string;
   courseIndex: number;
};

export type TCourseContentData = {
   contentId: string;
   contentName: string;
   published: boolean;
};

export type TScheduleDetailsData = {
   courseName: string;
   courseId: string;
   seriesNumber: number;
   startTime: string;
   endTime: string;
   remoteLink: string | null;
   address: string | null;
   duration: number;
   instructors: {
      userId: string;
      firstName: string;
      lastName: string;
   }[];
   complete: boolean;
   inProgress: boolean;
   canStart: boolean;
   signedIn: boolean;
   absent: boolean;
};

export type TCreateTransactionData = {
   userId: string;
   description: string;
   courseId?: string;
   bundleId?: string;
   price: number;
   notes?: string;
   amount: number;
   transactionId?: string;
};

export interface TAdminCourseDetailsManageStudent {
   userId: string;
   headShot: string;
   firstName: string;
   lastName: string;
   phoneNumber: string;
   email: string;
   dob: string;
   registrationStatus: string;
   paid: boolean;
   usingCash: boolean;
   notes: string;
   transaction: string;
   certificate: boolean;
   quizzes: TAdminCourseDetailsManageStudentQuizzes;
   surveys: TAdminCourseDetailsManageStudentSurveys;
   signInSheet: TAdminCourseDetailsManageStudentSignInSheet;
}

export interface TAdminBundleDetailsManageStudent {
   userId: string;
   headShot: string;
   firstName: string;
   lastName: string;
   phoneNumber: string;
   email: string;
   dob: string;
   registrationStatus: string;
   paid: boolean;
   usingCash: boolean;
   notes: string;
   transaction: string;
}

export interface TAdminCourseDetailsManageStudentTable {
   userId: string;
   headShot: string;
   firstName: string;
   lastName: string;
   phoneNumber: string;
   email: string;
   dob: string;
   registrationStatus: string;
   paid: boolean;
   usingCash: boolean;
   notes: string;
   transaction: string;
   certificate: boolean;
   quizzes: string;
   surveys: string;
   signInSheet: string;
}

export interface TAdminCourseDetailsManageStudentQuizzes {
   taken: number;
   total: number;
   records: TAdminCourseDetailsManageStudentQuizzesRecord[];
}

export interface TAdminCourseDetailsManageStudentQuizzesRecord {
   quizId: string;
   quizName: string;
   passed: boolean;
   score: number;
}

export interface TAdminCourseDetailsManageStudentSurveys {
   taken: number;
   total: number;
   records: TAdminCourseDetailsManageStudentSurveysRecord[];
}

export interface TAdminCourseDetailsManageStudentSurveysRecord {
   surveyId: string;
   surveyName: string;
}

export interface TAdminCourseDetailsManageStudentSignInSheet {
   amount: number;
   total: number;
   records: TAdminCourseDetailsManageStudentSignInSheetRecord[];
}

export interface TAdminCourseDetailsManageStudentSignInSheetRecord {
   status: string;
   comments: string;
   seriesNumber: number;
}

export interface TAdminCertificatesGeneratePostPayload {
   userIds: string[];
   courseId: string;
   expirationDate?: string;
   uploadCertificates?: boolean;
   notifyUsers?: boolean;
}

export type TTransaction = {
   transactionId: string;
   transactionDate: string;
   description: string;
   void: boolean;
   usingCash: boolean;
   price: number;
   amount: number;
   notes: string;
   payer: {
      userId: string;
      firstName: string;
      lastName: string;
   };
   course?: {
      courseId: string;
      courseName: string;
      coursePrice: number;
      startDate: string;
      address?: string;
      remoteLink?: string;
      instructors: {
         userId: string;
         firstName: string;
         lastName: string;
      }[];
      schedule: {
         courseId: string;
         seriesNumber: number;
         startTime: string;
         endTime: string;
      }[];
   };
   bundle?: {
      bundleId: string;
      bundleName: string;
      bundlePrice: number;
      startDate: string;
      schedule: {
         courseId: string;
         courseName: string;
         seriesNumber: number;
         startTime: string;
         endTime: string;
      }[];
      courses: {
         courseId: string;
         courseName: string;
      }[];
   };
};

export type TImportStudent = {
   userId: string;
   firstName: string;
   lastName: string;
   email: string;
   phoneNumber: string;
   state: string;
   city: string;
   address: string;
   gender: string;
   eyeColor: string;
   dob: string;
   zipcode: string;
   height: string;
   headShot?: string;
};

export interface TStudentFormQuizStarted {
   formId: string;
   formName: string;
   active: boolean;
   passingPoints: number;
   questionsCount: number;
   questions: TStudentFormQuizStartedQuestion[];
   attempts: number;
   duration: number;
}

export interface TStudentFormQuizStartedQuestion {
   questionId: string;
   questionNumber: number;
   description: string;
   pointValue: number;
   answerType: string;
   active: boolean;
   choices: TStudentFormQuizStartedQuestionChoice[];
}

export interface TStudentFormQuizStartedQuestionChoice {
   description: string;
   choicePosition: number;
   active: boolean;
}

export interface TStudentFormStartedAnswer {
   questionId: string;
   questionNumber: number;
   description: any;
   answerType: string;
   answer: {
      choicePosition: number;
      description: string;
      response?: string;
   };
}

export interface TStudentFormSurveyStarted {
   formId: string;
   formName: string;
   active: boolean;
   questions: TStudentFormSurveyStartedQuestion[];
}

export interface TStudentFormSurveyStartedQuestion {
   questionId: string;
   questionNumber: number;
   description: string;
   answerType: string;
   active: boolean;
   choices: TStudentFormSurveyStartedQuestionChoice[];
}

export interface TStudentFormSurveyStartedQuestionChoice {
   description: string;
   choicePosition: number;
   active: boolean;
}

export interface TStudentFormQuizStartedSubmitResponse {
   passing: boolean;
   retake: number;
   score: number;
   neededScore: number;
}

export interface TInstructorFormData {
   formId: string;
   formName: string;
   formType: 'quiz' | 'survey';
   active: boolean;
   available: boolean;
   isComplete: boolean;
   duration: number;
}

export interface TInstructorStudentsData {
   userId: string;
   headShot?: string | null;
   firstName: string;
   lastName: string;
   signIn?: string;
   signOut?: string;
   instructorSignIn?: boolean;
   instructorSignOut?: boolean;
   quiz: {
      passed?: boolean | null;
      retries?: number;
   };
   survey?: boolean;
   notes?: string | null;
}
