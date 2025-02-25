'use client';

import { NewTab, Plus } from 'iconoir-react';
import { FC, useState } from 'react';
import { quizSurveySchemaType } from './Editor';
import QuestionDialog, { questionDialogSchemaType } from './QuestionDialog';

import { TQuizSurveyDetailsQuestion } from '@/lib/types';

interface AddQuestionProps {
   addQuestion: (question: TQuizSurveyDetailsQuestion) => void;
   formType: quizSurveySchemaType['formType'];
}

const AddQuestion: FC<AddQuestionProps> = ({ addQuestion, formType }) => {
   const [dialogOpen, setDialogOpen] = useState<boolean>(false);

   function Save(values: questionDialogSchemaType) {
      addQuestion({
         questionId: `${Date.now()}`,
         ...values,
         answerType: values.answerType.value,
         active: true,
      } as TQuizSurveyDetailsQuestion);
   }

   return (
      <QuestionDialog
         dialogOpen={dialogOpen}
         setDialogOpen={setDialogOpen}
         dialogTrigger={
            <button
               onClick={() => setDialogOpen(true)}
               type="submit"
               className="flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 w-full py-[1.25rem] text-white font-semibold tracking-tight rounded-2xl"
            >
               Add question
               <Plus className="ml-2.5 h-6 w-6" strokeWidth={2} />
            </button>
         }
         Icon={NewTab}
         title="Add question"
         formType={formType}
         Save={Save}
      />
   );
};

export default AddQuestion;
