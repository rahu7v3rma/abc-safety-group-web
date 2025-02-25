'use client';

import RenderQuiz from './Render/Quiz';
import RenderSurvey from './Render/Survey';

const QuizSurveyManagement = () => {
   return (
      <div className="mx-auto flex w-full max-w-lg flex-col">
         <RenderQuiz />
         <RenderSurvey />
      </div>
   );
};

export default QuizSurveyManagement;
