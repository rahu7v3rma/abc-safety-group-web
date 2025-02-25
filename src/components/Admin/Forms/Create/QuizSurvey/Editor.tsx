import { hookstate } from '@hookstate/core';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { UseFormReturn, useController } from 'react-hook-form';
import z from 'zod';
import { WarningCircle } from 'iconoir-react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import AddQuestion from './AddQuestion';
import DropdownHook from '@/components/ui/DropdownHook';
import Input from '@/components/ui/Input';
import { StrictModeDroppable } from '@/components/StrictModeDroppable';
import InputNumber from '@/components/ui/InputNumber';
import Question from './Question';
import { TQuizSurveyDetailsQuestion } from '@/lib/types';

// TODO : add questions to this instead of state
export const quizSurveySchema = z.object({
   formName: z.string().nonempty({ message: 'Form name is required' }),
   formType: z.enum(['Quiz', 'Survey'], {
      errorMap: () => ({ message: 'Form type is required' }),
   }),
   passingPoints: z.coerce
      .number()
      .optional()
      .refine(
         (v) => {
            const formType = quizSurveyState.formType.value;

            if (formType === 'Survey') {
               return true;
            } else if (
               formType === 'Quiz' &&
               (!v || parseFloat(v.toString()) < 1)
            ) {
               return false;
            }

            return true;
         },
         { message: 'Passing score is required for quiz' }
      ),

   attempts: z.coerce
      .number()
      .min(0, {
         message: 'Attempts must be 0 or more',
      })
      .default(1)
      .optional(),
   duration: z.coerce
      .number()
      .min(0, {
         message: 'Attempts must be 0 or more',
      })
      .default(1)
      .optional(),
});

export type quizSurveySchemaType = z.infer<typeof quizSurveySchema>;

export const quizSurveyStateDefault: quizSurveySchemaType = {
   formName: '',
   formType: 'Quiz',
   attempts: 1,
};
export const quizSurveyState = hookstate<quizSurveySchemaType>(
   quizSurveyStateDefault
);

interface QuizSurveyEditorProps {
   locked?: boolean;
   form: UseFormReturn<quizSurveySchemaType, any, any>;
   questions: TQuizSurveyDetailsQuestion[];
   setQuestions: Dispatch<SetStateAction<TQuizSurveyDetailsQuestion[]>>;
   scoreLow: boolean;
}

const QuizSurveyEditor: FC<QuizSurveyEditorProps> = ({
   locked,
   form: {
      register: registerForm,
      formState: { errors },
      control,
      trigger,
   },
   questions,
   setQuestions,
   scoreLow,
}) => {
   const {
      field: { value: formTypeValue, onChange: formTypeOnChange },
   } = useController({ name: 'formType', control });

   const {
      field: { value: passingPointsValue, onChange: passingPointsOnChange },
   } = useController({ name: 'passingPoints', control });

   const {
      field: { value: attemptsValue, onChange: attemptsOnChange },
   } = useController({ name: 'attempts', control });

   const {
      field: { value: durationValue, onChange: durationOnChange },
   } = useController({ name: 'duration', control });

   function Reset() {
      quizSurveyState.set(quizSurveyStateDefault);
   }

   useEffect(() => {
      Reset();
   }, []);

   function handleOnDragEnd(result: any) {
      if (!result.destination) return;

      const items = Array.from(questions);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setQuestions(items);
   }

   function addQuestion(question: TQuizSurveyDetailsQuestion) {
      setQuestions([...questions, question]);
   }

   function removeQuestion(questionIndex: number) {
      setQuestions((q) => q.filter((_, qi) => qi !== questionIndex));
   }

   function editQuestion(
      questionIndex: number,
      question: Omit<TQuizSurveyDetailsQuestion, 'questionId'>
   ) {
      setQuestions((q) =>
         q.map((cq, qi) => {
            if (qi === questionIndex) {
               return {
                  questionId: cq.questionId,
                  ...question,
               };
            }
            return cq;
         })
      );
   }

   return (
      <div className="max-w-2xl w-full flex flex-col gap-10 mx-auto">
         <div className="flex flex-col gap-8">
            <div className="grid grid-cols-3 gap-5">
               <div className="col-span-2">
                  <Input
                     trigger={trigger}
                     label="Form name"
                     {...registerForm('formName')}
                     error={errors.formName}
                  />
               </div>
               <div className="col-span-1">
                  <DropdownHook
                     disabled={locked ?? false}
                     trigger={trigger}
                     label="Form type"
                     placeholder="Select type..."
                     options={['Quiz', 'Survey']}
                     value={formTypeValue}
                     onChange={(type: quizSurveySchemaType['formType']) => {
                        if (type === 'Survey') {
                           passingPointsOnChange(undefined);
                        }
                        formTypeOnChange(type);
                        setQuestions([]);
                     }}
                     dropdownTriggerClassname="w-full"
                     error={errors.formType}
                  />
               </div>
            </div>
            <div className="grid grid-cols-3 gap-5">
               <div>
                  <InputNumber
                     trigger={trigger}
                     label="Passing score"
                     value={passingPointsValue}
                     onChange={passingPointsOnChange}
                     disabled={formTypeValue !== 'Quiz'}
                     error={errors.passingPoints}
                  />
               </div>
               <div>
                  <InputNumber
                     required={false}
                     trigger={trigger}
                     label="Attempts"
                     value={attemptsValue}
                     onChange={attemptsOnChange}
                     disabled={formTypeValue !== 'Quiz'}
                     error={errors.attempts}
                  />
               </div>
               <div>
                  <InputNumber
                     iconLabel="m"
                     required={false}
                     trigger={trigger}
                     label="Duration"
                     value={durationValue}
                     onChange={durationOnChange}
                     disabled={formTypeValue !== 'Quiz'}
                     error={errors.duration}
                  />
               </div>
            </div>
         </div>
         <AddQuestion addQuestion={addQuestion} formType={formTypeValue} />
         {!!questions.length && (
            <DragDropContext onDragEnd={handleOnDragEnd}>
               <StrictModeDroppable droppableId="questions">
                  {(provided) => (
                     <>
                        <div
                           className="flex flex-col"
                           {...provided.droppableProps}
                           ref={provided.innerRef}
                        >
                           <div className="mb-4 flex items-center justify-between">
                              <p className="tracking-tight font-medium">
                                 Questions list{' '}
                                 <span className="ml-2.5 text-blue-500 font-medium">
                                    {questions.length}
                                 </span>
                              </p>
                              {scoreLow && (
                                 <div className="text-sm text-red-500 inline-flex items-center font-medium tracking-tight">
                                    <WarningCircle
                                       className="h-5 w-5 mr-2.5"
                                       strokeWidth={2}
                                    />
                                    Score values are lower than passing score
                                 </div>
                              )}
                           </div>
                           {questions.map((question, index) => {
                              return (
                                 <Draggable
                                    key={question.questionId}
                                    draggableId={question.questionId}
                                    index={index}
                                 >
                                    {(provided, snapshot) => (
                                       <Question
                                          key={index}
                                          questionIndex={index}
                                          formType={formTypeValue}
                                          provided={provided}
                                          removeQuestion={removeQuestion}
                                          editQuestion={editQuestion}
                                          snapshot={snapshot}
                                          {...question}
                                       />
                                    )}
                                 </Draggable>
                              );
                           })}
                           {provided.placeholder}
                        </div>
                     </>
                  )}
               </StrictModeDroppable>
            </DragDropContext>
         )}
      </div>
   );
};

export default QuizSurveyEditor;
