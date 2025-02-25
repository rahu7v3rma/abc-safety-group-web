'use client';

import Confirmation from '@/components/ui/Confirmation';
import Note from '@/components/ui/Note';
import Spinner from '@/components/ui/Spinner';
import Tooltip from '@/components/ui/Tooltip';
import usePost from '@/hooks/usePost';
import enums from '@/lib/enums';
import { alphabet } from '@/lib/helpers';
import {
   TStudentFormQuizStarted,
   TStudentFormQuizStartedQuestion,
   TStudentFormQuizStartedQuestionChoice,
   TStudentFormQuizStartedSubmitResponse,
   TStudentFormStartedAnswer,
   TWithOTT,
} from '@/lib/types';
import clsx from 'clsx';
import { Check, Circle, PageFlip, Timer, TimerOff, Xmark } from 'iconoir-react';
import {
   Dispatch,
   FC,
   SetStateAction,
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from 'react';
import Countdown, {
   CountdownApi,
   CountdownRenderProps,
   CountdownTimeDelta,
   zeroPad,
} from 'react-countdown';
import { toast } from 'sonner';
import QuizResults from './Results';

const QuizCountdown = ({
   minutes,
   seconds,
   completed,
   countdownAPI,
   setCompleted,
}: CountdownRenderProps & {
   countdownAPI: CountdownApi | null;
   setCompleted: Dispatch<SetStateAction<boolean>>;
}) => {
   useEffect(() => {
      if (completed) {
         setCompleted(completed);
      }
   }, [completed, setCompleted]);

   return (
      <p
         className={clsx(
            'text-xl font-medium tabular-nums',
            minutes < 1
               ? seconds <= 10
                  ? 'text-red-500'
                  : 'text-orange-500'
               : 'text-black',
            countdownAPI &&
               (countdownAPI.isPaused() ||
                  countdownAPI.isCompleted() ||
                  countdownAPI.isStopped())
               ? '!text-zinc-600'
               : '!text-black'
         )}
      >
         {zeroPad(minutes)}:{zeroPad(seconds)}
      </p>
   );
};

interface QuizStartedProps {
   responseId: string;
   quiz: TStudentFormQuizStarted;
   courseId: string;
   seriesNumber: number;
   quizId: string;
   external?: boolean;
}

const QuizStarted: FC<TWithOTT<QuizStartedProps>> = ({
   responseId,
   quiz,
   courseId,
   seriesNumber,
   quizId,
   external,
   ott,
}) => {
   const startDate = useRef(Date.now());
   const [duration, setDuration] = useState<false | number>(false);
   const [countdownAPI, setCountdownAPI] = useState<CountdownApi | null>(null);

   const [completed, setCompleted] = useState<boolean>(false);

   const [answers, setAnswers] = useState<TStudentFormStartedAnswer[]>([]);

   const [submitConfirmation, setSubmitConfirmation] = useState<boolean>(false);
   const [submitQuiz, submitQuizLoading] = usePost<
      { responseId: string; questions: TStudentFormStartedAnswer[] },
      TStudentFormQuizStartedSubmitResponse
   >('forms', ['quiz', 'submit', courseId, seriesNumber.toString(), quizId]);

   const [results, setResults] = useState<
      false | TStudentFormQuizStartedSubmitResponse
   >(false);

   const SubmitQuiz = useCallback(() => {
      toast.promise(
         submitQuiz(
            {
               responseId,
               questions: answers,
            },
            {
               success: (data) => {
                  setResults(data);
               },
            },
            {
               throw: true,
               ott,
            }
         ),
         {
            loading: 'Submitting quiz...',
            success: 'Quiz submitted!',
            error: (e) => {
               return e.message;
            },
         }
      );
   }, [responseId, submitQuiz, answers]);

   function toggleAnswer(
      question: TStudentFormQuizStartedQuestion,
      choice: TStudentFormQuizStartedQuestionChoice
   ) {
      const findQuestion = answers.find((answer) => {
         return answer.questionId === question.questionId;
      });

      if (findQuestion) {
         setAnswers((currentAnswers) => [
            ...currentAnswers.filter((answer) => {
               if (answer.questionId === question.questionId) {
                  return false;
               }
               return true;
            }),
            {
               questionId: question.questionId,
               questionNumber: question.questionNumber,
               description: question.description,
               answerType: question.answerType,
               answer: {
                  choicePosition: choice.choicePosition,
                  description: choice.description,
               },
            },
         ]);
      } else {
         setAnswers((currentAnswers) => [
            ...currentAnswers,
            {
               questionId: question.questionId,
               questionNumber: question.questionNumber,
               description: question.description,
               answerType: question.answerType,
               answer: {
                  choicePosition: choice.choicePosition,
                  description: choice.description,
               },
            },
         ]);
      }
   }

   const isAnswer = useCallback(
      (
         question: TStudentFormQuizStartedQuestion,
         choice: TStudentFormQuizStartedQuestionChoice
      ) => {
         const findQuestion = answers.find((answer) => {
            return (
               answer.questionId === question.questionId &&
               choice.choicePosition === answer.answer.choicePosition
            );
         });

         return !!findQuestion;
      },
      [answers]
   );

   const questionsAnswered = useMemo(() => {
      return quiz.questions
         .map((question) => {
            const findAnswer = answers.find(
               (answer) => answer.questionId === question.questionId
            );
            return !!findAnswer;
         })
         .filter((v) => v === true).length;
   }, [quiz, answers]);

   function setRef(countdown: Countdown | null): void {
      if (countdown) {
         setCountdownAPI(countdown.getApi());
      }
   }

   useEffect(() => {
      if (countdownAPI && (completed || results)) {
         if (!countdownAPI.isPaused()) {
            countdownAPI.pause();
         }
      }
   }, [countdownAPI, completed, results]);

   const updateDuration = useCallback(
      (tick: CountdownTimeDelta) => {
         if (!duration) {
            setDuration(quiz.duration * 60000 - tick.total);
         }
      },
      [quiz, duration, setDuration]
   );

   return (
      <div className="flex flex-1 flex-col">
         <div className="flex items-center justify-between">
            <div className="inline-flex items-center text-xl font-semibold tracking-tight">
               <PageFlip
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               {quiz.formName}
            </div>
            <div className="inline-flex items-center">
               <Tooltip content={'Time left'} open={!completed && !results}>
                  {completed || results ? (
                     <TimerOff
                        className="mr-3 h-6 w-6 text-zinc-400"
                        strokeWidth={2}
                     />
                  ) : (
                     <Timer
                        className="mr-3 h-6 w-6 text-zinc-400"
                        strokeWidth={2}
                     />
                  )}
               </Tooltip>
               <Countdown
                  onStop={updateDuration}
                  onPause={updateDuration}
                  onComplete={updateDuration}
                  ref={setRef}
                  date={startDate.current + quiz.duration * 60000}
                  renderer={(props) => (
                     <QuizCountdown
                        countdownAPI={countdownAPI}
                        setCompleted={setCompleted}
                        {...props}
                     />
                  )}
               />
            </div>
         </div>
         <div className="mt-5 flex h-[1px] flex-grow flex-col gap-5 overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-10">
            {!!results ? (
               <QuizResults quiz={quiz} results={results} duration={duration} />
            ) : (
               <div className="mx-auto w-full max-w-xl">
                  <Note text="Quiz taking is in progress, do not exit, your changes will not be saved!" />
                  <div className="mt-10 flex flex-col gap-8">
                     {quiz.questions.map((question) => (
                        <div
                           key={question.questionNumber}
                           className="w-full rounded-3xl border border-zinc-100 bg-white px-10 py-8 shadow"
                        >
                           <div className="flex flex-wrap gap-2.5">
                              <p className="inline-block rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                                 Question {question.questionNumber + 1}
                              </p>
                              <p className="inline-block rounded-lg bg-blue-500/10 px-2 py-1 text-sm font-medium tracking-tight text-blue-500">
                                 {enums[question.answerType]}
                              </p>
                              <p className="inline-flex items-center rounded-lg bg-green-500/10 px-2.5 py-1 text-sm font-medium tracking-tight text-green-500">
                                 <Circle
                                    className="mr-1.5 h-3 w-3"
                                    strokeWidth={2}
                                 />
                                 {question.pointValue}
                              </p>
                           </div>
                           <p className="mt-5 text-lg font-medium tracking-tight">
                              {question.description}
                           </p>
                           <div className="mt-8 flex flex-col gap-2.5">
                              {question.choices.map((choice) => (
                                 <div
                                    key={choice.choicePosition}
                                    className="flex gap-2.5"
                                 >
                                    <button
                                       disabled={!!completed}
                                       type="button"
                                       onClick={() =>
                                          toggleAnswer(question, choice)
                                       }
                                       className={clsx(
                                          'group flex w-16 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-100 py-3.5 font-medium transition duration-200 ease-linear',
                                          isAnswer(question, choice)
                                             ? clsx(
                                                  'border-blue-500',
                                                  !completed &&
                                                     'hover:border-red-500 hover:bg-red-500/10'
                                               )
                                             : !completed &&
                                                  'hover:border-blue-500 hover:bg-blue-500/10'
                                       )}
                                    >
                                       <span
                                          className={clsx(
                                             'inline-block',
                                             isAnswer(question, choice) &&
                                                'font-medium text-blue-500',
                                             !completed && 'group-hover:hidden'
                                          )}
                                       >
                                          {alphabet[choice.choicePosition]}
                                       </span>
                                       <span
                                          className={clsx(
                                             'hidden',
                                             isAnswer(question, choice)
                                                ? 'text-red-500'
                                                : 'text-blue-500',
                                             !completed &&
                                                'group-hover:inline-block'
                                          )}
                                       >
                                          {isAnswer(question, choice) ? (
                                             <Xmark
                                                className="h-6 w-6"
                                                strokeWidth={2}
                                             />
                                          ) : (
                                             <Check
                                                className="h-6 w-6"
                                                strokeWidth={2}
                                             />
                                          )}
                                       </span>
                                    </button>
                                    <p
                                       className={clsx(
                                          'flex flex-1 items-center break-all rounded-xl border px-4 text-base font-medium outline-none transition duration-200 ease-linear',
                                          isAnswer(question, choice)
                                             ? 'border-blue-500 bg-blue-500 text-white'
                                             : 'border-zinc-300 bg-zinc-50 text-black'
                                       )}
                                    >
                                       {choice.description}
                                    </p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
                  <Confirmation
                     title="Submit quiz"
                     description={
                        questionsAnswered < quiz.questions.length
                           ? `You answered ${questionsAnswered} out of ${quiz.questions.length} questions.`
                           : 'You answered all questions.'
                     }
                     open={submitConfirmation}
                     setDialogOpen={setSubmitConfirmation}
                     severe={true}
                     action={SubmitQuiz}
                     zIndex={10006}
                  >
                     <button
                        disabled={submitQuizLoading}
                        onClick={() => setSubmitConfirmation(true)}
                        className="mt-10 flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 text-center font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-75"
                     >
                        Submit
                        {!!submitQuizLoading && (
                           <Spinner className="ml-2.5 h-5 w-5" />
                        )}
                     </button>
                  </Confirmation>
               </div>
            )}
         </div>
      </div>
   );
};

export default QuizStarted;
