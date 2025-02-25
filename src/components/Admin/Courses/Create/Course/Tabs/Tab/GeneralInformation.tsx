'use client';

import { removeNullProperties } from '@/lib/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { hookstate } from '@hookstate/core';
import clsx from 'clsx';
import { NavArrowRight } from 'iconoir-react';
import {
   Dispatch,
   FC,
   SetStateAction,
   useEffect,
   useMemo,
   useState,
} from 'react';
import { useController, useForm } from 'react-hook-form';
import validator from 'validator';
import { z } from 'zod';
import { create } from 'zustand';

import DropdownList from '@/components/ui/DropdownList';
import DropdownListPaginated from '@/components/ui/DropdownListPaginated';
import Input from '@/components/ui/Input';
import InputList from '@/components/ui/InputList';
import InputNumber from '@/components/ui/InputNumber';
import UploadInput from '@/components/ui/UploadInput';
import { fetchCourses, searchFetchCourses } from '@/data/pagination/courses';
import { fetchUsers, searchFetchUsers } from '@/data/pagination/users';

export type generalInformationFieldsCanDisable = 'duration' | 'coursePicture';

const disabledFields = hookstate<{
   [K in generalInformationFieldsCanDisable]?: boolean;
}>({
   duration: false,
   coursePicture: false,
});

export const generalInformationSchema = z.object({
   coursePicture: z
      .custom<File>()
      .optional()
      .refine(
         (v) => {
            const disabledField = disabledFields.coursePicture.value;

            if (disabledField && !v) {
               return true;
            } else if (!disabledField && (!v || v.length < 1)) {
               return false;
            }

            return true;
         },
         {
            message: 'Course picture is required',
         }
      ),
   courseName: z
      .string()
      .min(1, {
         message: 'Course name is required',
      })
      .min(2, {
         message: 'Course name too short',
      }),
   courseCode: z.string().optional(),
   description: z.string().optional(),
   briefDescription: z.string().optional(),
   prerequisites: z
      .array(
         z.object({
            text: z.string(),
            value: z.string(),
         })
      )
      .optional(),
   languages: z.array(z.string()).min(1, {
      message: 'Languages must have at least 1',
   }),
   instructors: z
      .array(
         z.object({
            text: z.string(),
            value: z.string(),
         })
      )
      .min(1, {
         message: 'Instructors must have at least 1',
      }),
   price: z
      .number({ errorMap: () => ({ message: 'Price is required' }) })
      .optional(),
   instructionTypes: z
      .array(z.string())
      .min(1, { message: 'Instruction type must have at least 1' }),
   remoteLink: z
      .string()
      .optional()
      .refine(
         (v) => {
            const instructionTypes =
               useGeneralInformation.getState().data.instructionTypes;

            if (instructionTypes.includes('Remote') && !v) {
               return false;
            }
            return true;
         },
         { message: 'Remote link is required' }
      )
      .refine(
         (v) => {
            const instructionTypes =
               useGeneralInformation.getState().data.instructionTypes;

            if (
               instructionTypes.includes('Remote') &&
               v &&
               !validator.isURL(v)
            ) {
               return false;
            }
            return true;
         },
         { message: 'Remote link is invalid' }
      ),
   phoneNumber: z
      .string()
      .refine((input) => input.trim().length === 10 && !isNaN(Number(input)), {
         message: 'Phone number is invalid',
      }),
   email: z
      .string()
      .min(1, {
         message: 'Email address is required',
      })
      .email({
         message: 'Email is invalid',
      }),
   address: z
      .string()
      .optional()
      .refine(
         (v) => {
            const instructionTypes =
               useGeneralInformation.getState().data.instructionTypes;

            if (instructionTypes.includes('In-Person') && !v) {
               return false;
            }
            return true;
         },
         { message: 'Address is required' }
      ),
   duration: z.coerce
      .number()
      .optional()
      .refine(
         (v) => {
            const disabledField = disabledFields.duration.value;

            if (disabledField && !v) {
               return true;
            } else if (!disabledField && (!v || v < 1)) {
               return false;
            }

            return true;
         },
         {
            message: 'Duration is required',
         }
      ),
   maxStudents: z.coerce.number().min(1, {
      message: 'Maximum students is required',
   }),
   enrollable: z.boolean(),
   waitlist: z.boolean().optional(),
   waitlistLimit: z.coerce
      .number()
      .optional()
      .refine(
         (v) => {
            const waitlist = useGeneralInformation.getState().data.waitlist;
            if (waitlist && (!v || v < 1)) {
               return false;
            }
            return true;
         },
         { message: 'Waitlist limit is required' }
      ),
   allowCash: z.boolean(),
});

export type generalInformationSchemaType = z.infer<
   typeof generalInformationSchema
>;

export const generalInformationStateDefault: generalInformationSchemaType = {
   courseName: '',
   courseCode: '',
   description: '',
   briefDescription: '',
   languages: ['English'],
   instructors: [],
   price: 0,
   instructionTypes: [],
   phoneNumber: '',
   email: '',
   duration: 0,
   maxStudents: 20,
   enrollable: true,
   waitlist: true,
   waitlistLimit: 20,
   allowCash: false,
   address: '',
   prerequisites: [],
   remoteLink: '',
};

export const useGeneralInformation = create<
   { data: generalInformationSchemaType } & { reset: () => void }
>()((set, get) => ({
   data: {
      ...generalInformationStateDefault,
   },
   reset: () => {
      set({
         data: generalInformationStateDefault,
      });
   },
}));

interface CourseGeneralInformationProps {
   tab?: number;
   setTab?: Dispatch<SetStateAction<number>>;
   defaultValues?: generalInformationSchemaType;
   disabled?: generalInformationFieldsCanDisable[];
}

const CourseGeneralInformation: FC<CourseGeneralInformationProps> = ({
   tab,
   setTab,
   defaultValues,
   disabled,
}) => {
   const [changed, setChanged] = useState<boolean>(false);
   const generalInformation = useGeneralInformation((state) => state.data);

   const {
      handleSubmit,
      register: registerForm,
      formState: { errors },
      control,
      watch,
      trigger,
      reset,
   } = useForm<generalInformationSchemaType>({
      resolver: zodResolver(generalInformationSchema),
      values:
         !changed && defaultValues
            ? {
                 ...generalInformation,
                 ...removeNullProperties(defaultValues),
              }
            : generalInformation,
   });

   useEffect(() => {
      if (disabled) {
         const d = Object.fromEntries(disabled.map((field) => [field, true]));
         disabledFields.set(d);
      } else {
         disabledFields.set({});
      }
   }, [disabled]);

   useEffect(() => {
      const subscription = watch((value) => {
         if (!changed) setChanged(true);
         useGeneralInformation.setState({
            data: value as generalInformationSchemaType,
         });
      });
      return () => subscription.unsubscribe();
   }, [watch, changed]);

   const {
      field: { value: coursePictureValue, onChange: coursePictureOnChange },
   } = useController({ name: 'coursePicture', control });

   const {
      field: { value: prerequisitesValue, onChange: prerequisitesOnChange },
   } = useController({ name: 'prerequisites', control });

   const {
      field: { value: languagesValue, onChange: languagesOnChange },
   } = useController({ name: 'languages', control });

   const {
      field: { value: instructorsValue, onChange: instructorsOnChange },
   } = useController({ name: 'instructors', control });

   const {
      field: { value: priceValue, onChange: priceOnChange },
   } = useController({ name: 'price', control });

   const {
      field: {
         value: instructionTypesValue,
         onChange: instructionTypesOnChange,
      },
   } = useController({ name: 'instructionTypes', control });

   const {
      field: { value: durationValue, onChange: durationOnChange },
   } = useController({ name: 'duration', control });

   const {
      field: { value: maxStudentsValue, onChange: maxStudentsOnChange },
   } = useController({ name: 'maxStudents', control });

   const {
      field: { value: waitlistLimitValue, onChange: waitlistLimitOnChange },
   } = useController({ name: 'waitlistLimit', control });

   const hasErrors = useMemo(
      () => Object.values(errors).some((v) => !!v),
      [errors]
   );

   function isDisabled(field: generalInformationFieldsCanDisable) {
      return disabled && disabled.includes(field);
   }

   function Continue() {
      if (tab !== undefined && !!setTab) {
         setTab(tab + 1);
      }
   }

   return (
      <form onSubmit={handleSubmit(Continue)} className="flex flex-col gap-7">
         {!isDisabled('coursePicture') && (
            <UploadInput
               asFile={true}
               trigger={trigger}
               label="Course picture"
               accept=".png,.jpg,.jpeg"
               value={coursePictureValue}
               onChange={coursePictureOnChange}
               error={errors.coursePicture}
               router="courses"
            />
         )}
         <Input
            trigger={trigger}
            label="Course name"
            {...registerForm('courseName')}
            error={errors.courseName}
         />
         <Input
            required={false}
            trigger={trigger}
            label="Course code"
            {...registerForm('courseCode')}
            error={errors.courseCode}
         />
         <Input
            trigger={trigger}
            label="Brief description"
            required={false}
            {...registerForm('briefDescription')}
            error={errors.briefDescription}
         />
         <Input
            trigger={trigger}
            label="Description"
            required={false}
            {...registerForm('description')}
            error={errors.description}
         />
         <DropdownListPaginated
            trigger={trigger}
            label="Prerequisites"
            required={false}
            values={prerequisitesValue || []}
            onChange={prerequisitesOnChange}
            fetch={fetchCourses}
            searchFetch={searchFetchCourses}
            placeholder="Select course..."
            error={errors.prerequisites}
         />
         <InputList
            trigger={trigger}
            label="Languages"
            values={languagesValue}
            onChange={languagesOnChange}
            placeholder="Type a language..."
            error={errors.languages}
         />
         <DropdownListPaginated
            trigger={trigger}
            label="Instructors"
            values={instructorsValue || []}
            onChange={instructorsOnChange}
            fetch={(page) => fetchUsers(page, 'instructor')}
            searchFetch={(query, page) =>
               searchFetchUsers(query, page, 'instructor')
            }
            placeholder="Select instructor..."
            dropdownTriggerClassname="w-56"
            error={errors.instructors}
         />
         <DropdownList
            trigger={trigger}
            label="Instruction type"
            values={instructionTypesValue}
            options={['In-Person', 'Remote']}
            onChange={instructionTypesOnChange}
            placeholder="Select a type..."
            error={errors.instructionTypes}
         />
         {instructionTypesValue.includes('Remote') && (
            <Input
               trigger={trigger}
               label="Remote link"
               {...registerForm('remoteLink')}
               error={errors.remoteLink}
            />
         )}
         {instructionTypesValue.includes('In-Person') && (
            <Input
               trigger={trigger}
               label="Address"
               {...registerForm('address')}
               error={errors.address}
            />
         )}
         <Input
            trigger={trigger}
            label="Phone number"
            {...registerForm('phoneNumber')}
            error={errors.phoneNumber}
         />
         <Input
            trigger={trigger}
            type="email"
            label="Email address"
            {...registerForm('email')}
            error={errors.email}
         />
         <div
            className={clsx(
               'grid gap-5',
               isDisabled('duration') ? 'grid-cols-2' : 'grid-cols-3'
            )}
         >
            {!isDisabled('duration') && (
               <InputNumber
                  trigger={trigger}
                  iconLabel="m"
                  label="Duration"
                  value={durationValue}
                  onChange={durationOnChange}
                  error={errors.duration}
               />
            )}
            <InputNumber
               trigger={trigger}
               iconLabel="$"
               label="Price"
               value={priceValue}
               onChange={priceOnChange}
               error={errors.price}
            />
         </div>
         {tab !== undefined && !!setTab && (
            <button
               disabled={hasErrors}
               type="submit"
               className="mt-10 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
            >
               Series Settings
               <NavArrowRight className="ml-2.5 h-5 w-5" strokeWidth={2} />
            </button>
         )}
      </form>
   );
};

export default CourseGeneralInformation;
