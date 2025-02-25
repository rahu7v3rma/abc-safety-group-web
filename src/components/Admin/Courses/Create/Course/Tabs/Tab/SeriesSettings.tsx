'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { NavArrowRight } from 'iconoir-react';
import {
   Dispatch,
   FC,
   SetStateAction,
   useEffect,
   useMemo,
   useRef,
} from 'react';
import { useController, useForm } from 'react-hook-form';
import z from 'zod';
import { create } from 'zustand';

import CheckboxListHook from '@/components/ui/CheckboxListHook';
import DatePickerInputHook from '@/components/ui/DatePickerInputHook';
import DatePickerInputList from '@/components/ui/DatePickerInputList';
import DropdownList from '@/components/ui/DropdownList';
import InputNumber from '@/components/ui/InputNumber';
import InputNumberList from '@/components/ui/InputNumberList';
import OptionsHook from '@/components/ui/OptionsHook';

export const seriesSettingsSchema = z.object({
   firstClassDtm: z.date({
      errorMap: () => ({ message: 'First class date is required' }),
   }),
   classesInSeries: z.coerce.number().min(1, {
      message: 'Total classes must be at least 1',
   }),
   frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly'], {
      errorMap: () => ({ message: 'Frequency is required' }),
   }),
   classFrequency: z
      .object({
         days: z.object({
            frequency: z.coerce
               .number()
               .optional()
               .refine(
                  (v) => {
                     const frequency =
                        useSeriesSettings.getState().data.frequency;
                     if (frequency && frequency === 'Daily' && (!v || v < 1)) {
                        return false;
                     }
                     return true;
                  },
                  { message: 'Frequency days must be at least 1' }
               ),
         }),
         weeks: z.object({
            frequency: z.coerce
               .number()
               .optional()
               .refine(
                  (v) => {
                     const frequency =
                        useSeriesSettings.getState().data.frequency;
                     if (frequency && frequency === 'Weekly' && (!v || v < 1)) {
                        return false;
                     }
                     return true;
                  },
                  { message: 'Frequency weeks must be at least 1' }
               ),
            days: z
               .array(z.string())
               .optional()
               .refine(
                  (v) => {
                     const frequency =
                        useSeriesSettings.getState().data.frequency;
                     if (
                        frequency &&
                        frequency === 'Weekly' &&
                        (!v || !v.length)
                     ) {
                        return false;
                     }
                     return true;
                  },
                  { message: 'Frequency week days is required' }
               ),
         }),
         months: z.object({
            frequency: z.coerce
               .number()
               .optional()
               .refine(
                  (v) => {
                     const frequency =
                        useSeriesSettings.getState().data.frequency;
                     const classFrequency =
                        useSeriesSettings.getState().data.classFrequency;

                     if (
                        frequency &&
                        frequency === 'Monthly' &&
                        (!classFrequency ||
                           !classFrequency.months.months ||
                           !classFrequency.months.months.length) &&
                        (!v || v < 1)
                     ) {
                        return false;
                     }
                     return true;
                  },
                  { message: 'Frequency months must be at least 1' }
               )
               .refine(
                  (v) => {
                     const classFrequency =
                        useSeriesSettings.getState().data.classFrequency;

                     if (
                        v &&
                        classFrequency &&
                        classFrequency.months.months &&
                        classFrequency.months.months.length
                     ) {
                        return false;
                     }
                     return true;
                  },
                  {
                     message:
                        'Frequence months cannot be set if months is selected',
                  }
               ),
            months: z
               .array(z.string())
               .optional()
               .refine(
                  (v) => {
                     const frequency =
                        useSeriesSettings.getState().data.frequency;
                     const classFrequency =
                        useSeriesSettings.getState().data.classFrequency;

                     if (
                        frequency &&
                        frequency === 'Monthly' &&
                        (!classFrequency || !classFrequency.months.frequency) &&
                        (!v || v.length < 1)
                     ) {
                        return false;
                     }
                     return true;
                  },
                  {
                     message:
                        'Months must be selected if no frequency is given',
                  }
               )
               .refine(
                  (v) => {
                     const classFrequency =
                        useSeriesSettings.getState().data.classFrequency;

                     if (
                        v &&
                        v.length &&
                        classFrequency &&
                        classFrequency.months.frequency
                     ) {
                        return false;
                     }
                     return true;
                  },
                  {
                     message: 'Months cannot be set if frequency is given',
                  }
               ),
            days: z
               .array(
                  z
                     .number()
                     .min(1, {
                        message: 'Frequency month days must be 1 or greater',
                     })
                     .max(31, {
                        message: 'Frequency month days must be 31 or less',
                     })
               )
               .optional()
               .refine(
                  (v) => {
                     const frequency =
                        useSeriesSettings.getState().data.frequency;

                     if (
                        frequency &&
                        frequency === 'Monthly' &&
                        (!v || v.length < 1)
                     ) {
                        return false;
                     }
                     return true;
                  },
                  {
                     message: 'Frequency month days must have at least 1',
                  }
               ),
         }),
         years: z.object({
            frequency: z.coerce
               .number()
               .optional()
               .refine(
                  (v) => {
                     const frequency =
                        useSeriesSettings.getState().data.frequency;
                     if (frequency && frequency === 'Yearly' && (!v || v < 1)) {
                        return false;
                     }
                     return true;
                  },
                  { message: 'Frequency years must be at least 1' }
               ),
            days: z
               .array(z.date())
               .min(1, { message: 'Frequency year days must have at least 1' })
               .optional()
               .refine(
                  (v) => {
                     const frequency =
                        useSeriesSettings.getState().data.frequency;
                     if (
                        frequency &&
                        frequency === 'Yearly' &&
                        (!v || v.length < 1)
                     ) {
                        return false;
                     }
                     return true;
                  },
                  {
                     message: 'Frequency year days must have at least 1',
                  }
               ),
         }),
      })
      .optional(),
});

export type seriesSettingsSchemaType = z.infer<typeof seriesSettingsSchema>;
export type seriesSettingsSchemaTypeRewrite = Omit<
   seriesSettingsSchemaType,
   'firstClassDtm' | 'frequency'
> & {
   firstClassDtm?: Date;
   frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
};

export const seriesSettingsStateDefault: seriesSettingsSchemaTypeRewrite = {
   classesInSeries: 0,
};

export const useSeriesSettings = create<
   { data: seriesSettingsSchemaTypeRewrite } & { reset: () => void }
>()((set, get) => ({
   data: {
      ...seriesSettingsStateDefault,
   },
   reset: () => {
      set({
         data: seriesSettingsStateDefault,
      });
   },
}));

interface CourseSeriesSettingsProps {
   tab: number;
   setTab: Dispatch<SetStateAction<number>>;
}

const CourseSeriesSettings: FC<CourseSeriesSettingsProps> = ({
   tab,
   setTab,
}) => {
   const seriesSettings = useSeriesSettings((state) => state.data);

   const formRef = useRef<HTMLFormElement>(null);

   const {
      handleSubmit,
      register: registerForm,
      formState: { errors },
      control,
      watch,
      trigger,
   } = useForm<seriesSettingsSchemaType>({
      resolver: zodResolver(seriesSettingsSchema),
      values: seriesSettings as seriesSettingsSchemaType,
   });

   useEffect(() => {
      const subscription = watch((value) => {
         useSeriesSettings.setState({
            data: value as seriesSettingsSchemaType,
         });
      });
      return () => subscription.unsubscribe();
   }, [watch]);

   const {
      field: { value: firstClassDtmValue, onChange: firstClassDtmOnChange },
   } = useController({ name: 'firstClassDtm', control });

   const {
      field: { value: classesInSeriesValue, onChange: classesInSeriesOnChange },
   } = useController({ name: 'classesInSeries', control });

   const {
      field: { value: frequencyValue, onChange: frequencyOnChange },
   } = useController({ name: 'frequency', control });

   const {
      field: { value: frequencyDaysValue, onChange: frequencyDaysOnChange },
   } = useController({ name: 'classFrequency.days.frequency', control });

   const {
      field: { value: frequencyWeeksValue, onChange: frequencyWeeksOnChange },
   } = useController({ name: 'classFrequency.weeks.frequency', control });

   const {
      field: {
         value: frequencyWeekDaysValue,
         onChange: frequencyWeekDaysOnChange,
      },
   } = useController({ name: 'classFrequency.weeks.days', control });

   const {
      field: { value: frequencyMonthsValue, onChange: frequencyMonthsOnChange },
   } = useController({ name: 'classFrequency.months.frequency', control });

   const {
      field: {
         value: frequencyMonthMonthsValue,
         onChange: frequencyMonthMonthsOnChange,
      },
   } = useController({ name: 'classFrequency.months.months', control });

   const {
      field: {
         value: frequencyMonthDaysValue,
         onChange: frequencyMonthDaysOnChange,
      },
   } = useController({ name: 'classFrequency.months.days', control });

   const {
      field: { value: frequencyYearsValue, onChange: frequencyYearsOnChange },
   } = useController({ name: 'classFrequency.years.frequency', control });

   const {
      field: {
         value: frequencyYearsDaysValue,
         onChange: frequencyYearsDaysOnChange,
      },
   } = useController({ name: 'classFrequency.years.days', control });

   const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
   ];

   const hasErrors = useMemo(
      () => Object.values(errors).some((v) => !!v),
      [errors]
   );

   function Continue() {
      setTab(tab + 1);
   }

   return (
      <form
         ref={formRef}
         onSubmit={handleSubmit(Continue)}
         className="flex flex-col"
      >
         <div className="grid grid-cols-5 gap-5">
            <DatePickerInputHook
               trigger={trigger}
               label="First class date"
               wrapperClassName="col-span-3"
               value={firstClassDtmValue}
               onChange={firstClassDtmOnChange}
               error={errors.firstClassDtm}
               datePicker={{
                  showYearDropdown: true,
                  showTimeSelect: true,
                  dateFormat: 'MMM d, yyyy h:mm aa',
                  scrollableYearDropdown: true,
               }}
            />
            <InputNumber
               trigger={trigger}
               label="Total classes"
               wrapperClassName="col-span-2"
               value={classesInSeriesValue}
               onChange={classesInSeriesOnChange}
               error={errors.classesInSeries}
            />
         </div>
         <OptionsHook
            trigger={trigger}
            wrapperClassName="mt-10"
            label="Frequency"
            values={['Daily', 'Weekly', 'Monthly', 'Yearly']}
            value={frequencyValue}
            onChange={frequencyOnChange}
            error={errors.frequency}
         />
         {frequencyValue && (
            <div className="mt-5 bg-white border border-zinc-200 w-full rounded-3xl p-10">
               {frequencyValue === 'Daily' ? (
                  <InputNumber
                     trigger={trigger}
                     key="daily"
                     label="Every N Days"
                     iconLabel="N"
                     className="w-44"
                     value={frequencyDaysValue}
                     onChange={frequencyDaysOnChange}
                     error={errors.classFrequency?.days?.frequency}
                  />
               ) : frequencyValue === 'Weekly' ? (
                  <>
                     <InputNumber
                        trigger={trigger}
                        key="weekly"
                        label="Every N Weeks"
                        iconLabel="N"
                        className="w-44"
                        value={frequencyWeeksValue}
                        onChange={frequencyWeeksOnChange}
                        error={errors.classFrequency?.weeks?.frequency}
                     />
                     <CheckboxListHook
                        trigger={trigger}
                        wrapperClassName="mt-10"
                        options={[
                           'Monday',
                           'Tuesday',
                           'Wednesday',
                           'Thursday',
                           'Friday',
                        ]}
                        values={frequencyWeekDaysValue}
                        onChange={frequencyWeekDaysOnChange}
                        error={errors.classFrequency?.weeks?.days}
                     />
                  </>
               ) : frequencyValue === 'Monthly' ? (
                  <>
                     <InputNumber
                        trigger={trigger}
                        key="monthly"
                        label="Every N Months"
                        iconLabel="N"
                        className="w-44"
                        value={frequencyMonthsValue}
                        onChange={frequencyMonthsOnChange}
                        error={errors.classFrequency?.months?.frequency}
                     />
                     <DropdownList
                        trigger={trigger}
                        label="Months"
                        placeholder="Select a month..."
                        wrapperClassName="mt-5"
                        options={months}
                        values={frequencyMonthMonthsValue}
                        onChange={frequencyMonthMonthsOnChange}
                        error={errors.classFrequency?.months?.months}
                     />
                     <InputNumberList
                        trigger={trigger}
                        label="Month days"
                        placeholder="1-31"
                        wrapperClassName="mt-5"
                        values={frequencyMonthDaysValue}
                        onChange={frequencyMonthDaysOnChange}
                        error={errors.classFrequency?.months?.days}
                     />
                  </>
               ) : (
                  frequencyValue === 'Yearly' && (
                     <>
                        <InputNumber
                           trigger={trigger}
                           key="yearly"
                           label="Every N Years"
                           iconLabel="N"
                           className="w-44"
                           value={frequencyYearsValue}
                           onChange={frequencyYearsOnChange}
                           error={errors.classFrequency?.years?.frequency}
                        />
                        <DatePickerInputList
                           trigger={trigger}
                           label="Days of the year"
                           wrapperClassName="mt-5"
                           values={frequencyYearsDaysValue}
                           onChange={frequencyYearsDaysOnChange}
                           error={errors.classFrequency?.years?.days}
                           datePicker={{
                              dateFormat: 'MMM do',
                              dateFormatCalendar: 'MMMM',
                           }}
                        />
                     </>
                  )
               )}
            </div>
         )}
         <button
            disabled={hasErrors}
            type="submit"
            className="mt-10 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
         >
            Certification
            <NavArrowRight className="ml-2.5 h-5 w-5" strokeWidth={2} />
         </button>
      </form>
   );
};

export default CourseSeriesSettings;
