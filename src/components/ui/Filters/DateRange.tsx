import { useHookstate } from '@hookstate/core';
import { Calendar } from 'iconoir-react';
import { Dispatch, FC, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import Dialog from '../Dialog';

interface DateRangeFilterProps {
   showFilter: boolean;
   setShowFilter: Dispatch<SetStateAction<boolean>>;
   start?: boolean;
   end?: boolean;
   action: (startDate: Date, endDate: Date) => void;
   cancel?: any;
}

const DateRangeFilter: FC<DateRangeFilterProps> = ({
   showFilter,
   setShowFilter,
   start = true,
   end = true,
   action,
   cancel,
}) => {
   const dates = useHookstate({
      start: new Date(),
      end: new Date(),
   });

   function Cancel() {
      dates.start.set(new Date());
      dates.end.set(new Date());

      if (cancel) cancel();

      setShowFilter(false);
   }

   return (
      <Dialog
         open={showFilter}
         onOpenChange={(open) => {
            if (!open) Cancel();
            setShowFilter(open);
         }}
         zIndex={10001}
         contentClassName="max-w-[600px] w-full"
      >
         <div className="inline-flex text-xl font-semibold tracking-tight items-center">
            <Calendar className="mr-4 h-7 w-7 text-blue-500" strokeWidth={2} />
            Date Range Filter
         </div>
         <div className="mt-5 flex justify-center items-start gap-5">
            {!!start && (
               <div className="flex flex-col gap-2.5">
                  <p className="text-blue-500 font-medium">Start Date</p>
                  <DatePicker
                     showPopperArrow={false}
                     selected={dates.start.get()}
                     onChange={(date) => {
                        if (date) {
                           dates.start.set(date);
                           if (dates.end.value < date) {
                              dates.end.set(date);
                           }
                        }
                     }}
                     customInput={false}
                     showTimeInput={false}
                     inline
                  />
               </div>
            )}
            {!!end && (
               <div className="flex flex-col gap-2.5">
                  <p className="text-blue-500 font-medium">End Date</p>
                  <DatePicker
                     showPopperArrow={false}
                     selected={dates.end.get()}
                     onChange={(date) => {
                        if (date) dates.end.set(date);
                     }}
                     customInput={false}
                     showTimeInput={false}
                     minDate={dates.start.get()}
                     inline
                  />
               </div>
            )}
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
                  action(dates.start.value, dates.end.value);
                  setShowFilter(false);
               }}
               className="py-3 px-6 font-medium rounded-xl bg-blue-500 transition duration-200 ease-linear hover:bg-blue-600 text-white"
            >
               Filter
            </button>
         </div>
      </Dialog>
   );
};

export default DateRangeFilter;
