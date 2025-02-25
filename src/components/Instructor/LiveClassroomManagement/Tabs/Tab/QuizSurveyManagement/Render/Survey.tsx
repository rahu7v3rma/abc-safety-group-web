'use client';

import { DropdownOption } from '@/components/ui/DropdownHook';
import { DropdownPaginatedFetchReturn } from '@/components/ui/DropdownListPaginated';
import DropdownPaginated from '@/components/ui/DropdownPaginated';
import { fetchSurveysByCourseId } from '@/data/pagination/forms';
import { TInstructorFormData } from '@/lib/types';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import SendSurveyLinkToClassButton from '../Buttons/Survey/SendLinkToClass';
import StartQuizSurvey from '../Buttons/Survey/Start';
import StopQuizSurvey from '../Buttons/Survey/Stop';
import ViewSurveyButton from '../Buttons/Survey/View';

const RenderSurvey = () => {
   const { id: courseId } = useParams<{ id: string }>();

   const [selectedSurveyDropdown, setSelectedSurveyDropdown] = useState<
      DropdownOption | undefined
   >();

   const [selectedSurvey, setSelectedSurvey] = useState<TInstructorFormData>();

   const [surveys, setSurveys] = useState<
      DropdownPaginatedFetchReturn<TInstructorFormData>
   >({
      options: false,
      pagination: false,
      data: false,
   });

   const onChangeDropdown = useCallback(
      (option: DropdownOption) => {
         setSelectedSurveyDropdown(option);
         if (surveys.data && surveys.data.length > 0) {
            const surveysData = surveys.data;
            const selectedQuiz = surveysData.find(
               (q) => q.formId === option.value,
            );
            setSelectedSurvey(selectedQuiz);
         }
      },
      [surveys],
   );

   return (
      <div className="mt-10">
         <p className="text-xl font-semibold tracking-tight">Survey</p>
         <div className="mt-4">
            <DropdownPaginated
               fetch={(page) => fetchSurveysByCourseId(courseId, page)}
               placeholder="Select survey..."
               dropdownTriggerClassname="w-full"
               value={selectedSurveyDropdown}
               onChange={onChangeDropdown}
               setFetchReturn={setSurveys}
            />
         </div>
         {selectedSurvey && (
            <div className="mt-4 flex gap-2">
               {selectedSurvey.available ? (
                  <StopQuizSurvey
                     selectedSurvey={selectedSurvey}
                     setSelectedSurvey={setSelectedSurvey}
                  />
               ) : (
                  <StartQuizSurvey
                     selectedSurvey={selectedSurvey}
                     setSelectedSurvey={setSelectedSurvey}
                  />
               )}
               <SendSurveyLinkToClassButton selectedSurvey={selectedSurvey} />
               <ViewSurveyButton selectedSurvey={selectedSurvey} />
            </div>
         )}
      </div>
   );
};

export default RenderSurvey;
