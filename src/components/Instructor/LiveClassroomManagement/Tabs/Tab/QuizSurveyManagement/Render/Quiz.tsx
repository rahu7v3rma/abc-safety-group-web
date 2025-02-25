'use client';

import { DropdownOption } from '@/components/ui/DropdownHook';
import { DropdownPaginatedFetchReturn } from '@/components/ui/DropdownListPaginated';
import DropdownPaginated from '@/components/ui/DropdownPaginated';
import { fetchQuizzesByCourseId } from '@/data/pagination/forms';
import { TInstructorFormData } from '@/lib/types';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import StartQuizButton from '../Buttons/Quiz/Start';
import StopQuizButton from '../Buttons/Quiz/Stop';
import SendQuizLinkToClassButton from '../Buttons/Quiz/SendLinkToClass';
import ViewQuizButton from '../Buttons/Quiz/View';

const RenderQuiz = () => {
   const { id: courseId } = useParams<{ id: string }>();

   const [selectedQuizDropdown, setSelectedQuizDropdown] = useState<
      DropdownOption | undefined
   >();

   const [selectedQuiz, setSelectedQuiz] = useState<TInstructorFormData>();

   const [quizzes, setQuizzes] = useState<
      DropdownPaginatedFetchReturn<TInstructorFormData>
   >({
      options: false,
      pagination: false,
      data: false,
   });

   const onChangeDropdown = useCallback(
      (option: DropdownOption) => {
         setSelectedQuizDropdown(option);
         if (quizzes.data && quizzes.data.length > 0) {
            const quizzesData = quizzes.data;
            const selectedQuiz = quizzesData.find(
               (q) => q.formId === option.value,
            );
            setSelectedQuiz(selectedQuiz);
         }
      },
      [quizzes],
   );

   return (
      <div>
         <p className="text-xl font-semibold tracking-tight">Quiz</p>
         <div className="mt-4">
            <DropdownPaginated
               fetch={(page) => fetchQuizzesByCourseId(courseId, page)}
               placeholder="Select quiz..."
               dropdownTriggerClassname="w-full"
               value={selectedQuizDropdown}
               onChange={onChangeDropdown}
               setFetchReturn={setQuizzes}
            />
         </div>
         {selectedQuiz && (
            <div className="mt-4 flex gap-2">
               {selectedQuiz.available ? (
                  <StopQuizButton
                     selectedQuiz={selectedQuiz}
                     setSelectedQuiz={setSelectedQuiz}
                  />
               ) : (
                  <StartQuizButton
                     selectedQuiz={selectedQuiz}
                     setSelectedQuiz={setSelectedQuiz}
                  />
               )}
               <SendQuizLinkToClassButton selectedQuiz={selectedQuiz} />
               <ViewQuizButton selectedQuiz={selectedQuiz} />
            </div>
         )}
      </div>
   );
};

export default RenderQuiz;
