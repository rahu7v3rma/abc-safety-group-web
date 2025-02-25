'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import { PenTablet } from 'iconoir-react';

import QuestionDialog, { questionDialogSchemaType } from './QuestionDialog';
import enums from '@/lib/enums';
import { quizSurveySchemaType } from './Editor';

import {
   TAdminFormQuizQuestion,
   TQuizSurveyDetailsQuestion,
} from '@/lib/types';

interface EditQuestionProps {
   dialogOpen: boolean;
   setDialogOpen: Dispatch<SetStateAction<boolean>>;
   questionIndex: number;
   question: TAdminFormQuizQuestion;
   editQuestion: (
      questionIndex: number,
      question: Omit<TQuizSurveyDetailsQuestion, 'questionId'>
   ) => void;
   formType: quizSurveySchemaType['formType'];
}

const EditQuestion: FC<EditQuestionProps> = ({
   dialogOpen,
   setDialogOpen,
   questionIndex,
   question,
   editQuestion,
   formType,
}) => {
   function Save(values: questionDialogSchemaType) {
      editQuestion(questionIndex, {
         ...values,
         answerType: values.answerType.value,
         active: true,
      } as any);
   }

   return (
      <QuestionDialog
         dialogOpen={dialogOpen}
         setDialogOpen={setDialogOpen}
         Icon={PenTablet}
         title="Edit question"
         formType={formType}
         values={{
            ...question,
            answerType: {
               text: enums[question.answerType],
               value: question.answerType,
            },
         }}
         Save={Save}
      />
   );
};

export default EditQuestion;
