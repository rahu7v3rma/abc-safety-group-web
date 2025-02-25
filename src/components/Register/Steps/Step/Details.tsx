'use client';

import Button from '@/components/ui/Button';
import DateInput from '@/components/ui/DateInput';
import DatePickerInputHook from '@/components/ui/DatePickerInputHook';
import DropdownHook from '@/components/ui/DropdownHook';
import HeightInput from '@/components/ui/HeightInput';
import Input from '@/components/ui/Input';
import InputNumber from '@/components/ui/InputNumber';
import { USStates, eyeColors } from '@/lib/constants';
import clsx from 'clsx';
import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { UseFormReturn, useController } from 'react-hook-form';
import { registerInformationSchemaType } from '../../Form';
import { steps } from '../Steps';

interface RegisterStepDetailsProps {
   enableSteps?: boolean;
   step?: number;
   setStep?: Dispatch<SetStateAction<number>>;
   form: UseFormReturn<registerInformationSchemaType, any, any>;
   newPassword?: boolean;
   stepError:
      | {
           step: number;
           message: string;
        }
      | false;
   expirationDate?: boolean;
}

const RegisterStepDetails: FC<RegisterStepDetailsProps> = ({
   enableSteps = false,
   step,
   setStep,
   form: {
      register: registerForm,
      formState: { errors },
      control,
      trigger,
      getValues,
   },
   newPassword,
   stepError,
   expirationDate,
}) => {
   const fields = useMemo(
      () => Object.keys(getValues()) as (keyof registerInformationSchemaType)[],
      []
   );
   const fieldsNotInStep: (keyof registerInformationSchemaType)[] = [
      'headShot',
      'photoIdPhoto',
      'otherIdPhoto',
   ];
   const fieldsFiltered: (keyof registerInformationSchemaType)[] = useMemo(
      () => fields.filter((field) => !fieldsNotInStep.includes(field)),
      [fields, fieldsNotInStep]
   );

   const {
      field: { value: birthValue, onChange: dobOnChange },
   } = useController({ name: 'dob', control });
   const {
      field: { value: heightValue, onChange: heightOnChange },
   } = useController({ name: 'height', control });
   const {
      field: { value: stateValue, onChange: stateOnChange },
   } = useController({ name: 'state', control });
   const {
      field: { value: zipValue, onChange: zipOnChange },
   } = useController({ name: 'zipcode', control });
   const {
      field: { value: genderValue, onChange: genderOnChange },
   } = useController({ name: 'gender', control });
   const {
      field: { value: eyeColorValue, onChange: eyeColorOnChange },
   } = useController({ name: 'eyeColor', control });
   const {
      field: { value: expirationDateValue, onChange: expirationDateOnChange },
   } = useController({ name: 'expirationDate', control });

   const error = useMemo(() => {
      if (stepError && stepError.step === steps.indexOf('Details')) {
         return stepError.message;
      }
      return false;
   }, [stepError]);

   return (
      <>
         <div
            className={clsx(
               'grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-5'
            )}
         >
            <Input
               type="text"
               label="First name"
               error={errors.firstName}
               {...registerForm('firstName')}
            />
            <Input
               type="text"
               label="Last name"
               error={errors.lastName}
               {...registerForm('lastName')}
            />
            <Input
               type="text"
               label="Middle name"
               required={false}
               error={errors.middleName}
               {...registerForm('middleName')}
            />
            <Input
               type="text"
               label="Suffix"
               required={false}
               error={errors.suffix}
               {...registerForm('suffix')}
            />
         </div>
         <Input
            type="email"
            label="Email address"
            error={errors.email}
            {...registerForm('email')}
         />
         <Input
            type="tel"
            label="Phone number"
            error={errors.phoneNumber}
            {...registerForm('phoneNumber')}
         />
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-5">
            <DropdownHook
               label="State"
               placeholder="Select a state.."
               options={USStates.sort((a, b) => a.localeCompare(b))}
               value={stateValue}
               onChange={stateOnChange}
               dropdownTriggerClassname="w-full"
               error={errors.state}
            />
            <Input
               type="text"
               label="City"
               error={errors.city}
               {...registerForm('city')}
            />
         </div>
         <div className="grid grid-col-1 sm:grid-cols-3 gap-x-2.5 gap-y-5">
            <div className="sm:col-span-2">
               <Input
                  type="text"
                  label="Address"
                  error={errors.address}
                  {...registerForm('address')}
               />
            </div>
            <div className="sm:col-span-1">
               <InputNumber
                  label="Zip code"
                  value={zipValue}
                  onChange={zipOnChange}
                  error={errors.zipcode}
               />
            </div>
         </div>
         <div className="grid sm:grid-cols-2 gap-x-2.5 gap-y-5">
            <DropdownHook
               label="Gender"
               placeholder="Select a gender.."
               options={['Male', 'Female', 'Other']}
               value={genderValue}
               onChange={genderOnChange}
               dropdownTriggerClassname="w-full"
               error={errors.gender}
            />
            <DropdownHook
               label="Eye color"
               placeholder="Select a color.."
               options={eyeColors}
               value={eyeColorValue}
               onChange={eyeColorOnChange}
               dropdownTriggerClassname="w-full"
               error={errors.eyeColor}
            />
         </div>
         <HeightInput
            label="Height"
            value={heightValue}
            onChange={heightOnChange}
            error={errors.height}
         />
         <DateInput
            label="Birth date"
            value={birthValue}
            onChange={dobOnChange}
            error={errors.dob}
         />
         <Input
            type="password"
            label={newPassword ? 'New password' : 'Password'}
            required={!newPassword}
            error={errors.password}
            {...registerForm('password')}
         />
         {expirationDate && (
            <DatePickerInputHook
               label="Expiration date"
               value={expirationDateValue}
               onChange={expirationDateOnChange}
               error={errors.expirationDate}
               datePicker={{
                  dateFormat: 'MMM d, yyyy',
               }}
               required={false}
               cancel={true}
               onClickCancel={() => expirationDateOnChange(undefined)}
            />
         )}
         <div className="mt-2.5 flex flex-col gap-y-5">
            {enableSteps && (
               <Button
                  type="button"
                  onClick={async () => {
                     const allowed = await trigger(fieldsFiltered);
                     if (allowed && setStep && step !== undefined) {
                        setStep(step + 1);
                     }
                  }}
               >
                  Continue
               </Button>
            )}
            {!!error && (
               <div className="text-red-500 font-medium text-center">
                  {error}
               </div>
            )}
         </div>
      </>
   );
};

export default RegisterStepDetails;
