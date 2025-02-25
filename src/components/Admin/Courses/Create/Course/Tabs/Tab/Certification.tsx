import { zodResolver } from '@hookform/resolvers/zod';
import { useController, useForm } from 'react-hook-form';
import z from 'zod';
import { create } from 'zustand';
import { useGeneralInformation } from './GeneralInformation';
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import Input from '@/components/ui/Input';
import InputNumber from '@/components/ui/InputNumber';
import clsx from 'clsx';
import { NavArrowRight } from 'iconoir-react';
import { hookstate } from '@hookstate/core';
import Checkbox from '@/components/ui/Checkbox';

const disabledFields = hookstate<Record<string, boolean>>({
   certificate: false,
});

export const certificationSchema = z.object({
   certificate: z.boolean(),
   certificateName: z.string().optional(),
   expiration: z.object({
      years: z.coerce.number().optional(),
      months: z.coerce
         .number()
         .max(11, {
            message: 'Months cannot be greater than 11',
         })
         .optional(),
   }),
});

export type certificationSchemaType = z.infer<typeof certificationSchema>;

export const certificationStateDefault: certificationSchemaType = {
   certificate: true,
   certificateName: '',
   expiration: {},
};

export const useCertification = create<
   { data: certificationSchemaType } & { reset: () => void }
>()((set, get) => ({
   data: certificationStateDefault,
   reset: () => {
      set({
         data: certificationStateDefault,
      });
   },
}));

interface CourseCertificationProps {
   tab: number;
   setTab: Dispatch<SetStateAction<number>>;
}

const Certification: FC<CourseCertificationProps> = ({ tab, setTab }) => {
   const certification = useCertification((state) => state.data);
   const generalInformation = useGeneralInformation((state) => state.data);

   const {
      handleSubmit,
      register: registerForm,
      formState: { errors },
      control,
      watch,
      trigger,
      setValue,
   } = useForm<certificationSchemaType>({
      resolver: zodResolver(certificationSchema),
      values: certification,
   });

   useEffect(() => {
      const subscription = watch((value) => {
         useCertification.setState({
            data: value as certificationSchemaType,
         });
      });
      return () => subscription.unsubscribe();
   }, [watch]);

   const {
      field: { value: certificateValue, onChange: certificateOnChange },
   } = useController({ name: 'certificate', control });

   const {
      field: { value: expirationYearsValue, onChange: expirationYearsOnChange },
   } = useController({ name: 'expiration.years', control });

   const {
      field: {
         value: expirationMonthsValue,
         onChange: expirationMonthsOnChange,
      },
   } = useController({ name: 'expiration.months', control });

   const hasErrors = useMemo(
      () => Object.values(errors).some((v) => !!v),
      [errors]
   );

   function Continue() {
      setTab(tab + 1);
   }

   return (
      <form onSubmit={handleSubmit(Continue)} className="flex flex-col gap-7">
         <div>
            <label
               htmlFor="certificate"
               className="text-black font-medium tracking-tight"
            >
               Certificate
            </label>
            <Checkbox
               id="certificate"
               name="certificate"
               checked={certificateValue}
               onCheckedChange={(checked: boolean) => {
                  disabledFields.certificate.set(!checked);
                  certificateOnChange(checked);
                  trigger();
               }}
               className="mt-5 h-8 w-8 flex-shrink-0 flex-grow-0"
               checkClassName="w-5 h-5"
            />
         </div>
         <Input
            required={false}
            trigger={trigger}
            disabled={!!disabledFields.certificate.value}
            label="Certificate name"
            placeholder={
               !disabledFields.certificate.value
                  ? `${
                       generalInformation.courseCode &&
                       generalInformation.courseCode + ', '
                    }${generalInformation.courseName}`
                  : ''
            }
            className="placeholder:text-zinc-500 placeholder:font-medium placeholder:!text-base"
            {...registerForm('certificateName')}
            error={errors.certificateName}
         />
         <div className="flex flex-col gap-5">
            <p className="font-medium text-lg tracking-tight">Expiration</p>
            <div className="grid grid-cols-2 gap-5">
               <InputNumber
                  required={false}
                  disabled={!!disabledFields.certificate.value}
                  trigger={trigger}
                  label="Years"
                  value={expirationYearsValue}
                  onChange={expirationYearsOnChange}
                  error={errors.expiration?.root}
               />
               <InputNumber
                  required={false}
                  disabled={!!disabledFields.certificate.value}
                  trigger={trigger}
                  label="Months"
                  value={expirationMonthsValue}
                  onChange={expirationMonthsOnChange}
                  error={errors.expiration?.months || errors.expiration?.root}
               />
            </div>
         </div>
         <button
            disabled={hasErrors}
            type="submit"
            className="mt-8 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition duration-200 ease-linear bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 w-full py-4 text-white font-semibold tracking-tight rounded-2xl"
         >
            Content
            <NavArrowRight className="ml-2.5 h-5 w-5" strokeWidth={2} />
         </button>
      </form>
   );
};

export default Certification;
