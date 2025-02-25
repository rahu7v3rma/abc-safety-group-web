'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Check, Plus, Trash, Xmark } from 'iconoir-react';
import {
   Dispatch,
   FC,
   ReactNode,
   SetStateAction,
   useEffect,
   useState,
} from 'react';
import { useController, useForm } from 'react-hook-form';
import z from 'zod';

import Dialog from '@/components/ui/Dialog';
import DropdownHook from '@/components/ui/DropdownHook';
import Input from '@/components/ui/Input';
import InputNumber from '@/components/ui/InputNumber';
import enums from '@/lib/enums';
import { hookstate } from '@hookstate/core';
import { quizSurveySchemaType, quizSurveyState } from './Editor';

const answerTypeState = hookstate<{ text: string; value: string } | undefined>(
   undefined
);
const formTypeState = hookstate<quizSurveySchemaType['formType'] | undefined>(
   undefined
);

export const questionDialogSchema = z.object({
   description: z.string().min(1, { message: 'Question is required' }),
   pointValue: z.coerce
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
         { message: 'Score value is required' }
      ),
   answerType: z.object(
      {
         text: z.string(),
         value: z.string(),
      },
      { errorMap: () => ({ message: 'Answer type is required' }) }
   ),
   choices: z
      .array(
         z.object({
            description: z.string(),
            active: z.boolean().default(true),
            isCorrect: z.boolean(),
         })
      )
      .optional()
      .refine(
         (choices) => {
            const answerType = answerTypeState.value;
            if (answerType) {
               if (answerType.value === 'MC') {
                  if (!choices || !choices.length) {
                     return false;
                  }
               }
            }
            return true;
         },
         { message: 'Question choices must be at least 1' }
      )
      .refine(
         (choices) => {
            const answerType = answerTypeState.value;
            const formType = formTypeState.value;
            if (answerType && formType) {
               if (answerType.value === 'MC' && formType === 'Quiz') {
                  if (choices) {
                     const someCorrect = choices.some(
                        (choice) => !!choice.isCorrect
                     );
                     if (!someCorrect) {
                        return false;
                     }
                  }
               }
            }
            return true;
         },
         { message: 'Question choices must have at least 1 correct choice' }
      ),
});

export type questionDialogSchemaType = z.infer<typeof questionDialogSchema>;

interface QuestionDialogProps {
   dialogTrigger?: ReactNode;
   dialogOpen: boolean;
   setDialogOpen: Dispatch<SetStateAction<boolean>>;
   title: string;
   values?: questionDialogSchemaType;
   formType: quizSurveySchemaType['formType'];
   Save: (values: questionDialogSchemaType) => void;
   Icon: any;
}

const QuestionDialog: FC<QuestionDialogProps> = ({
   dialogTrigger,
   dialogOpen,
   setDialogOpen,
   title,
   values,
   formType,
   Save,
   Icon,
}) => {
   const {
      handleSubmit,
      register: registerForm,
      formState: { errors },
      control,
      trigger,
      getValues,
      reset,
      watch,
   } = useForm<questionDialogSchemaType>({
      resolver: zodResolver(questionDialogSchema),
      values,
   });

   useEffect(() => {
      const subscription = watch((value, { name }) => {
         if (name === 'answerType') {
            answerTypeState.set({
               text: value.answerType!.text!,
               value: value.answerType!.value!,
            });
         }
      });
      return () => subscription.unsubscribe();
   }, [watch]);

   useEffect(() => {
      formTypeState.set(formType);
   }, [formType]);

   useEffect(() => {
      if (values) {
         answerTypeState.set({
            text: values.answerType!.text!,
            value: values.answerType!.value!,
         });
      }
   }, [values]);

   const {
      field: { value: pointValueValue, onChange: pointValueOnChange },
   } = useController({ name: 'pointValue', control });

   const {
      field: { value: answerTypeValue, onChange: answerTypeOnChange },
   } = useController({ name: 'answerType', control });

   const {
      field: { value: choicesValue, onChange: choicesOnChange },
   } = useController({ name: 'choices', control });

   const [currentChoice, setCurrentChoice] = useState<string>('');

   const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

   function getNextLetter() {
      return choicesValue ? alpha[choicesValue.length || 0] : alpha[0];
   }

   function Reset() {
      reset();
      setCurrentChoice('');
   }

   function addChoice() {
      if (currentChoice.length) {
         choicesOnChange([
            ...(choicesValue || []),
            {
               description: currentChoice,
               active: true,
               isCorrect: false,
            },
         ]);
         setCurrentChoice('');
      }
   }

   function removeChoice(choiceIndex: number) {
      if (choicesValue && choicesValue.length) {
         choicesOnChange(choicesValue.filter((_, ci) => ci !== choiceIndex));
      }
   }

   function toggleCorrect(choiceIndex: number) {
      if (choicesValue && choicesValue.length) {
         choicesOnChange(
            choicesValue.map((cc, ci) => {
               if (ci === choiceIndex) {
                  return {
                     ...cc,
                     isCorrect: !cc.isCorrect,
                  };
               }
               return {
                  ...cc,
                  isCorrect: false,
               };
            })
         );
      }
   }

   function Submit() {
      Save(getValues());
      setDialogOpen(false);
      Reset();
   }

   return (
      <Dialog
         open={dialogOpen}
         onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) Reset();
         }}
         trigger={dialogTrigger}
      >
         <form onSubmit={handleSubmit(Submit)}>
            <div className="inline-flex items-center text-xl font-semibold tracking-tight">
               <Icon className="mr-4 h-7 w-7 text-blue-500" strokeWidth={2} />
               {title}
            </div>
            <div className="mt-5 flex flex-col gap-5">
               <Input
                  trigger={trigger}
                  label="Question"
                  {...registerForm('description')}
                  error={errors.description}
               />
               <div className="grid grid-cols-2 gap-5">
                  {formType === 'Quiz' && (
                     <InputNumber
                        trigger={trigger}
                        label="Point value"
                        value={pointValueValue}
                        onChange={pointValueOnChange}
                        error={errors.pointValue}
                     />
                  )}
                  <DropdownHook
                     trigger={trigger}
                     label="Answer type"
                     value={answerTypeValue}
                     onChange={(type: any) => {
                        answerTypeOnChange(type);
                        choicesOnChange([]);
                     }}
                     options={[
                        { value: 'MC', text: enums.MC },
                        ...(formType === 'Survey'
                           ? [{ value: 'TXT', text: enums.TXT }]
                           : []),
                     ]}
                     placeholder="Select type..."
                     dropdownTriggerClassname="w-full"
                     error={errors.answerType}
                  />
               </div>
               {answerTypeValue && answerTypeValue.value === 'MC' && (
                  <>
                     <hr className="my-2.5 border-t border-zinc-200" />
                     <label
                        htmlFor="Choices"
                        className="font-medium tracking-tight"
                     >
                        <span
                           className={clsx(
                              'mr-2 text-lg font-bold text-red-500'
                           )}
                           style={{
                              verticalAlign: 'sub',
                           }}
                        >
                           *
                        </span>
                        Choices
                     </label>
                     <div className="-mt-2 flex gap-2.5">
                        <div className="flex w-16 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-100 py-3.5 font-medium">
                           {getNextLetter()}
                        </div>
                        <input
                           id="choices"
                           name="choices"
                           type="text"
                           onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                 e.preventDefault();
                                 addChoice();
                              }
                           }}
                           onInput={(e: any) =>
                              setCurrentChoice(e.target.value)
                           }
                           value={currentChoice}
                           className="flex-1 rounded-xl border border-zinc-300 px-4 py-3.5 text-sm font-medium text-zinc-700 shadow-sm outline-none transition duration-200 ease-linear placeholder:text-xs placeholder:font-normal placeholder:text-zinc-400 hover:border-zinc-400 focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500 sm:text-base placeholder:sm:text-sm"
                        />
                        <button
                           type="button"
                           onClick={() => {
                              addChoice();
                              trigger();
                           }}
                           className="flex w-16 items-center justify-center rounded-xl bg-blue-500 py-3.5 text-white"
                        >
                           <Plus className="h-5 w-5" strokeWidth={2} />
                        </button>
                     </div>
                     {!!choicesValue && !!choicesValue.length && (
                        <>
                           <div className="mt-5 flex flex-col gap-2.5">
                              {choicesValue.map((choice, choiceIndex) => (
                                 <div
                                    key={choiceIndex}
                                    className="flex gap-2.5"
                                 >
                                    <button
                                       type="button"
                                       onClick={() => {
                                          if (formType === 'Quiz') {
                                             toggleCorrect(choiceIndex);
                                             trigger();
                                          }
                                       }}
                                       className={clsx(
                                          'group flex w-16 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-100 py-3.5 font-medium transition duration-200 ease-linear',
                                          formType === 'Quiz' &&
                                             (choice.isCorrect
                                                ? 'border-green-500 hover:border-red-500 hover:bg-red-500/10'
                                                : 'hover:border-green-500 hover:bg-green-500/10')
                                       )}
                                    >
                                       <span
                                          className={clsx(
                                             'inline-block',
                                             choice.isCorrect &&
                                                'font-medium text-green-500',
                                             formType === 'Quiz' &&
                                                'group-hover:hidden'
                                          )}
                                       >
                                          {alpha[choiceIndex]}
                                       </span>
                                       {formType === 'Quiz' && (
                                          <span
                                             className={clsx(
                                                'hidden group-hover:inline-block ',
                                                choice.isCorrect
                                                   ? 'text-red-500'
                                                   : 'text-green-500'
                                             )}
                                          >
                                             {choice.isCorrect ? (
                                                <Xmark
                                                   className="h-5 w-5"
                                                   strokeWidth={2}
                                                />
                                             ) : (
                                                <Check
                                                   className="h-5 w-5"
                                                   strokeWidth={2}
                                                />
                                             )}
                                          </span>
                                       )}
                                    </button>
                                    <input
                                       type="text"
                                       onClick={() => {
                                          if (formType === 'Quiz') {
                                             toggleCorrect(choiceIndex);
                                             trigger();
                                          }
                                       }}
                                       readOnly={true}
                                       value={choice.description}
                                       className={clsx(
                                          'flex-1 cursor-pointer rounded-xl border px-4 py-3.5 text-sm font-medium  shadow-sm outline-none transition duration-200 ease-linear placeholder:text-xs sm:text-base placeholder:sm:text-sm',
                                          formType === 'Quiz'
                                             ? choice.isCorrect
                                                ? 'border-green-600 bg-green-600 text-white'
                                                : 'border-zinc-400 bg-white text-black hover:border-green-500 hover:bg-green-500/10'
                                             : 'bg-whie border-zinc-400 text-black'
                                       )}
                                    />
                                    <button
                                       type="button"
                                       onClick={() => removeChoice(choiceIndex)}
                                       className="flex w-16 items-center justify-center rounded-xl bg-red-500 py-3.5 text-white transition duration-200 ease-linear hover:bg-red-600"
                                    >
                                       <Trash
                                          className="h-5 w-5"
                                          strokeWidth={2}
                                       />
                                    </button>
                                 </div>
                              ))}
                           </div>
                           <hr className="my-2.5 border-t border-zinc-200" />
                        </>
                     )}
                     {errors.choices && (
                        <div className="mt-2 text-sm font-medium tracking-tight text-red-500">
                           {errors.choices.message}
                        </div>
                     )}
                  </>
               )}
            </div>
            <div className="mt-10 grid grid-cols-2 gap-2.5">
               <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-2xl bg-blue-500 py-4 font-semibold tracking-tight text-white transition duration-200 ease-linear hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:bg-blue-500"
               >
                  Save
               </button>
               <button
                  onClick={() => {
                     setDialogOpen(false);
                     Reset();
                  }}
                  type="button"
                  className="flex w-full items-center justify-center rounded-2xl bg-red-500 py-4 font-semibold tracking-tight text-white transition duration-200 ease-linear hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:bg-red-500"
               >
                  Cancel
               </button>
            </div>
         </form>
      </Dialog>
   );
};

export default QuestionDialog;
