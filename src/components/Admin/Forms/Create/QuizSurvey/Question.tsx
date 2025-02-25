'use client';

import { Circle, EditPencil, LineSpace, Trash } from 'iconoir-react';
import { FC, useState } from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

import EditQuestion from './EditQuestion';
import { quizSurveySchemaType } from './Editor';
import enums from '@/lib/enums';
import {
   TAdminFormQuizQuestion,
   TQuizSurveyDetailsQuestion,
} from '@/lib/types';

interface QuestionProps extends TAdminFormQuizQuestion {
   formType: quizSurveySchemaType['formType'];
   provided: DraggableProvided;
   questionIndex: number;
   removeQuestion: (questionIndex: number) => void;
   editQuestion: (
      questionIndex: number,
      question: Omit<TQuizSurveyDetailsQuestion, 'questionId'>
   ) => void;
   snapshot: DraggableStateSnapshot;
}

const Question: FC<QuestionProps> = ({
   formType,
   provided,
   questionIndex,
   removeQuestion,
   editQuestion,
   snapshot,
   ...question
}) => {
   const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

   function getStyle(style: any, snapshot: DraggableStateSnapshot) {
      const transition = 'all linear 100ms';

      if (!snapshot.isDropAnimating) {
         if (snapshot.isDragging) {
            const scale = `scale(1.05)`;

            return {
               ...style,
               transform: `${style.transform} ${scale}`,
               transition,
            };
         } else {
            return style;
         }
      }
      const { moveTo } = snapshot.dropAnimation!;
      const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
      const scale = 'scale(1)';

      return {
         ...style,
         transform: `${translate} ${scale}`,
         transition,
      };
   }

   return (
      <>
         <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getStyle(provided.draggableProps.style, snapshot)}
            className="flex my-2.5 items-center cursor-grab"
         >
            <p className="pr-8 text-zinc-500 font-medium">
               {questionIndex + 1}
            </p>
            <div className="py-6 pl-4 pr-5 flex-1 flex overflow-auto items-start rounded-3xl bg-white shadow border border-zinc-100">
               <div className="mr-5 text-zinc-400">
                  <LineSpace className="h-6 w-6" strokeWidth={1.5} />
               </div>
               <div className="flex-1 overflow-auto break-words">
                  <p className="font-medium">{question.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                     <div className="flex items-center gap-2.5">
                        <p className="text-sm bg-blue-500/10 py-1 px-2.5 rounded-lg inline-block text-blue-500 tracking-tight font-medium">
                           {enums[question.answerType]}
                        </p>
                        {question.pointValue && (
                           <p className="text-sm inline-flex items-center bg-green-500/10 py-1 px-2.5 rounded-lg text-green-500 tracking-tight font-medium">
                              <Circle
                                 className="h-3 w-3 mr-1.5"
                                 strokeWidth={2}
                              />
                              {question.pointValue}
                           </p>
                        )}
                     </div>
                     <div className="flex items-center gap-2.5">
                        <button
                           type="button"
                           onClick={() => setEditDialogOpen(true)}
                           className="bg-blue-500 transition duration-200 ease-linear hover:bg-blue-600 py-2.5 text-white px-2.5 rounded-xl"
                        >
                           <EditPencil className="h-4 w-4" strokeWidth={2} />
                        </button>
                        <button
                           type="button"
                           onClick={() => removeQuestion(questionIndex)}
                           className="bg-red-500 transition duration-200 ease-linear hover:bg-red-600 py-2.5 text-white px-2.5 rounded-xl"
                        >
                           <Trash className="h-4 w-4" strokeWidth={2} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <EditQuestion
            dialogOpen={editDialogOpen}
            setDialogOpen={setEditDialogOpen}
            questionIndex={questionIndex}
            question={question}
            editQuestion={editQuestion}
            formType={formType}
         />
      </>
   );
};

export default Question;
