import { useHookstate } from '@hookstate/core';
import { format } from 'date-fns';
import { Calendar } from 'iconoir-react';
import { Dispatch, FC, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import Dialog from '../Dialog';

interface StartTimeSearchProps {
   showSearch: boolean;
   setShowSearch: Dispatch<SetStateAction<boolean>>;
   action: (startTime: string) => void;
   cancel?: any;
}

const StartTimeSearch: FC<StartTimeSearchProps> = ({
   showSearch,
   setShowSearch,
   action,
   cancel,
}) => {
   const startTime = useHookstate(new Date());

   function Cancel() {
      startTime.set(new Date());

      if (cancel) cancel();

      setShowSearch(false);
   }

   return (
      <Dialog
         open={showSearch}
         onOpenChange={(open) => {
            setShowSearch(open);
         }}
         zIndex={10001}
         contentClassName="max-w-[450px] w-full"
      >
         <div className="inline-flex text-xl font-semibold tracking-tight items-center">
            <Calendar className="mr-4 h-7 w-7 text-blue-500" strokeWidth={2} />
            Start Time Search
         </div>
         <div className="mt-5 flex justify-center items-start gap-5">
            <DatePicker
               showPopperArrow={false}
               selected={startTime.get()}
               onChange={(date) => {
                  if (date) startTime.set(date);
               }}
               customInput={false}
               showTimeSelect={true}
               dateFormat="MMM d, yyyy h:mm aa"
               inline
            />
         </div>
         <div className="mt-10 gap-x-2.5  w-full flex items-center justify-end">
            <button
               onClick={Cancel}
               className="py-3 px-6 font-medium rounded-xl bg-zinc-500 transition duration-200 ease-linear hover:bg-zinc-600 text-white"
            >
               Cancel
            </button>
            <button
               onClick={() => {
                  action(format(startTime.get(), 'MM/dd/yyyy hh:mm a'));
                  setShowSearch(false);
               }}
               className="py-3 px-6 font-medium rounded-xl bg-blue-500 transition duration-200 ease-linear hover:bg-blue-600 text-white"
            >
               Search
            </button>
         </div>
      </Dialog>
   );
};

export default StartTimeSearch;
