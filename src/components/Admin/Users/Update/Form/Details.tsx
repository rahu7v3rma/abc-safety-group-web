import DateInput from '@/components/ui/DateInput';
import DatePickerInputHook from '@/components/ui/DatePickerInputHook';
import DropdownHook from '@/components/ui/DropdownHook';
import HeightInput from '@/components/ui/HeightInput';
import Input from '@/components/ui/Input';
import InputNumber from '@/components/ui/InputNumber';
import { USStates, eyeColors } from '@/lib/constants';
import { FC } from 'react';
import { UseFormReturn, useController } from 'react-hook-form';
import { AdminUserUpdateSchemaType } from './Schema';

interface AdminUserUpdateDetailsProps {
   form: UseFormReturn<AdminUserUpdateSchemaType, any, any>;
}

const AdminUserUpdateDetails: FC<AdminUserUpdateDetailsProps> = ({
   form: {
      control,
      formState: { errors },
      trigger,
   },
}) => {
   const {
      field: { value: firstNameValue, onChange: firstNameOnChange },
   } = useController({ name: 'firstName', control });
   const {
      field: { value: lastNameValue, onChange: lastNameOnChange },
   } = useController({ name: 'lastName', control });
   const {
      field: { value: middleNameValue, onChange: middleNameOnChange },
   } = useController({ name: 'middleName', control });
   const {
      field: { value: suffixValue, onChange: suffixOnChange },
   } = useController({ name: 'suffix', control });
   const {
      field: { value: emailValue, onChange: emailOnChange },
   } = useController({ name: 'email', control });
   const {
      field: { value: phoneNumberValue, onChange: phoneNumberOnChange },
   } = useController({ name: 'phoneNumber', control });
   const {
      field: { value: stateValue, onChange: stateOnChange },
   } = useController({ name: 'state', control });
   const {
      field: { value: cityValue, onChange: cityOnChange },
   } = useController({ name: 'city', control });
   const {
      field: { value: addressValue, onChange: addressOnChange },
   } = useController({ name: 'address', control });
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
      field: { value: heightValue, onChange: heightOnChange },
   } = useController({ name: 'height', control });
   const {
      field: { value: birthValue, onChange: dobOnChange },
   } = useController({ name: 'dob', control });
   const {
      field: { value: passwordValue, onChange: passwordOnChange },
   } = useController({ name: 'password', control });

   const {
      field: {
         value: textNotificationsValue,
         onChange: textNotificationsOnChange,
      },
   } = useController({ name: 'textNotifications', control });
   const {
      field: { value: expirationDateValue, onChange: expirationDateOnChange },
   } = useController({ name: 'expirationDate', control });
   return (
      <>
         <div className={'grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-5'}>
            <Input
               type="text"
               label="First name"
               error={errors.firstName}
               value={firstNameValue}
               onChange={firstNameOnChange}
               trigger={trigger}
            />
            <Input
               type="text"
               label="Last name"
               error={errors.lastName}
               value={lastNameValue}
               onChange={lastNameOnChange}
               trigger={trigger}
            />
            <Input
               type="text"
               label="Middle name"
               required={false}
               error={errors.middleName}
               value={middleNameValue}
               onChange={middleNameOnChange}
               trigger={trigger}
            />
            <Input
               type="text"
               label="Suffix"
               required={false}
               error={errors.suffix}
               value={suffixValue}
               onChange={suffixOnChange}
               trigger={trigger}
            />
         </div>
         <Input
            type="email"
            label="Email address"
            error={errors.email}
            value={emailValue}
            onChange={emailOnChange}
            trigger={trigger}
         />
         <Input
            type="tel"
            label="Phone number"
            error={errors.phoneNumber}
            value={phoneNumberValue}
            onChange={phoneNumberOnChange}
            trigger={trigger}
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
               trigger={trigger}
            />
            <Input
               type="text"
               label="City"
               error={errors.city}
               value={cityValue}
               onChange={cityOnChange}
               trigger={trigger}
            />
         </div>
         <div className="grid grid-col-1 sm:grid-cols-3 gap-x-2.5 gap-y-5">
            <div className="sm:col-span-2">
               <Input
                  type="text"
                  label="Address"
                  error={errors.address}
                  value={addressValue}
                  onChange={addressOnChange}
                  trigger={trigger}
               />
            </div>
            <div className="sm:col-span-1">
               <InputNumber
                  label="Zip code"
                  value={zipValue}
                  onChange={zipOnChange}
                  error={errors.zipcode}
                  trigger={trigger}
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
               trigger={trigger}
            />
            <DropdownHook
               label="Eye color"
               placeholder="Select a color.."
               options={eyeColors}
               value={eyeColorValue}
               onChange={eyeColorOnChange}
               dropdownTriggerClassname="w-full"
               error={errors.eyeColor}
               trigger={trigger}
            />
         </div>
         <HeightInput
            label="Height"
            value={heightValue}
            onChange={heightOnChange}
            error={errors.height}
            trigger={trigger}
         />
         <DateInput
            label="Birth date"
            value={birthValue}
            onChange={dobOnChange}
            error={errors.dob}
            trigger={trigger}
         />
         <Input
            type="password"
            label={'New password'}
            error={errors.password}
            value={passwordValue}
            onChange={passwordOnChange}
            trigger={trigger}
            required={false}
         />
         <DatePickerInputHook
            trigger={trigger}
            label="Expiration date"
            wrapperClassName="col-span-3"
            value={expirationDateValue}
            onChange={expirationDateOnChange}
            error={errors.expirationDate}
            datePicker={{
               dateFormat: 'MMM d, yyyy',
            }}
            required={false}
            cancel={true}
            onClickCancel={() => expirationDateOnChange(null)}
         />
      </>
   );
};

export default AdminUserUpdateDetails;
