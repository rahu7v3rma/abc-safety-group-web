'use client';

import { PaymentSuccess } from '@/components/Paypal';
import DialogPay from '@/components/ui/DialogPay';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import Textarea from '@/components/ui/TextArea';
import usePost from '@/hooks/usePost';
import { isEnvTrue } from '@/lib/environment';
import {
   removeNullOrUndefinedProperties,
   removeNullProperties,
} from '@/lib/helpers';
import { TCreateTransactionData } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, UserPlus } from 'iconoir-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
   ExpeditedRegisterCourseOrBundle,
   ExpeditedRegisterPostPayload,
   courseType,
   expeditedRegisterSchema,
   expeditedRegisterSchemaType,
   expeditedRegisterStateDefault,
   paymentType,
} from './Schema';

import DatePickerInputHook from '@/components/ui/DatePickerInputHook';
import DropdownHook from '@/components/ui/DropdownHook';
import DropdownPaginated from '@/components/ui/DropdownPaginated';
import InputNumber from '@/components/ui/InputNumber';
import {
   fetchExpeditedBundles,
   fetchExpeditedCourses,
} from '@/data/pagination/expedited';
import { format } from 'date-fns';
import BundleReceipt from './Receipt/BundleReceipt';
import CourseReceipt from './Receipt/CourseReceipt';

interface ExpeditedRegisterProps {}

const ExpeditedRegister: FC<ExpeditedRegisterProps> = () => {
   const [registerPost, registerPostLoading] = usePost<
      ExpeditedRegisterPostPayload,
      { userId: string }
   >('admin', 'expedited-register');

   const [transactionPost, transactionPostLoading] = usePost<
      TCreateTransactionData,
      any
   >('transactions', 'create');

   const [unenrollCoursePost] = usePost<
      { courseId: string; userId: string },
      any
   >('courses', 'unenroll');
   const [unenrollBundlePost] = usePost<
      { bundleId: string; userId: string },
      any
   >('courses', ['bundle', 'unenroll']);

   const [paypal, setPaypal] = useState<boolean>(false);
   const [userId, setUserId] = useState<string>('');
   const [receipt, setReceipt] = useState<boolean>(false);

   const [course, setCourse] = useState<
      false | ExpeditedRegisterCourseOrBundle
   >(false);
   const [bundle, setBundle] = useState<
      false | ExpeditedRegisterCourseOrBundle
   >(false);

   const {
      handleSubmit,
      register: registerForm,
      formState: { errors },
      control,
      reset,
      getValues,
   } = useForm<expeditedRegisterSchemaType>({
      resolver: zodResolver(expeditedRegisterSchema),
      values: expeditedRegisterStateDefault,
   });

   const {
      field: { value: firstClassDateValue, onChange: firstClassDateOnChange },
   } = useController({ name: 'firstClassDate', control });

   const {
      field: { value: courseTypeValue, onChange: courseTypeOnChange },
   } = useController({ name: 'courseType', control });

   const {
      field: { value: courseValue, onChange: courseOnChange },
   } = useController({ name: 'course', control });

   const {
      field: { value: bundleValue, onChange: bundleOnChange },
   } = useController({ name: 'bundle', control });

   const {
      field: { value: paymentTypeValue, onChange: paymentTypeOnChange },
   } = useController({ name: 'paymentType', control });

   const {
      field: { value: priceValue, onChange: priceOnChange },
   } = useController({ name: 'price', control });

   const getTransactionDescription = useCallback(
      (values: expeditedRegisterSchemaType) => {
         if (
            values.firstName &&
            values.courseType &&
            (values.course || values.bundle) &&
            values.paymentType
         ) {
            return `Expedited register enrollment for user ${
               values.firstName
            } ${values.lastName} in ${values.courseType.toLowerCase()} ${
               values.courseType === 'Course'
                  ? (values.course as any).text
                  : (values.bundle as any).text
            } using ${values.paymentType}`;
         }
         return '';
      },
      []
   );

   const CreateTransaction = useCallback(
      (
         values: expeditedRegisterSchemaType,
         userId: string,
         transactionId?: string
      ) => {
         toast.promise(
            transactionPost(
               removeNullOrUndefinedProperties({
                  userId,
                  description: getTransactionDescription(values),
                  transactionId,
                  courseId: course ? course.id : undefined,
                  bundleId: bundle ? bundle.id : undefined,
                  price: course ? course.price : bundle ? bundle.price : 0,
                  amount: values.price,
                  notes: values.notes,
               }) as TCreateTransactionData,
               {
                  success: () => {
                     setPaypal(false);
                     setReceipt(true);
                  },
               },
               {
                  throw: true,
               }
            ),
            {
               loading: 'Creating transaction',
               success: 'Transaction created',
               error: (e) => {
                  return e.message;
               },
            }
         );
      },
      [transactionPost, bundle, course, getTransactionDescription]
   );

   const Register = useCallback(
      (values: expeditedRegisterSchemaType) => {
         toast.promise(
            registerPost(
               removeNullProperties({
                  firstName: values.firstName,
                  lastName: values.lastName,
                  courseId:
                     values.courseType === 'Course'
                        ? (values.course as any).value
                        : null,
                  bundleId:
                     values.courseType === 'Bundle'
                        ? (values.bundle as any).value
                        : null,
                  email: values.email || null,
                  phoneNumber: values.phoneNumber,
                  notes:
                     values.paymentType === 'Cash'
                        ? values.notes || null
                        : null,
                  usingCash: values.paymentType === 'Cash',
               }) as ExpeditedRegisterPostPayload,
               {
                  success: (payload) => {
                     if (
                        paymentTypeValue === 'Credit' &&
                        isEnvTrue(process.env.NEXT_PUBLIC_ALLOW_PAYMENTS)
                     ) {
                        setPaypal(true);
                        setUserId(payload.userId);
                     } else {
                        CreateTransaction(values, payload.userId);
                     }
                  },
               },
               {
                  throw: true,
               }
            ),
            {
               loading: 'Registering...',
               success: 'Registered',
               error: (e) => {
                  return e.message;
               },
            }
         );
      },
      [registerPost, paymentTypeValue, CreateTransaction]
   );

   const PaymentSucceeded = useCallback(
      (data: PaymentSuccess) => {
         CreateTransaction(getValues(), userId, data.transactionId);
      },
      [CreateTransaction, getValues, userId]
   );

   const PaymentFailed = useCallback(() => {
      toast.error('Payment failed');
   }, []);

   const Reset = useCallback(() => {
      reset(expeditedRegisterStateDefault);
      setPaypal(false);
      setUserId('');
      courseType.set('Course');
      paymentType.set(null);
   }, [reset]);

   const Unenroll = useCallback(() => {
      if (course) {
         toast.promise(
            unenrollCoursePost(
               { courseId: course.id, userId },
               {
                  success: () => {
                     Reset();
                  },
               },
               { throw: true }
            ),
            {
               loading: 'Unenrolling...',
               success: 'Unenrolled',
               error: (e) => {
                  return e.message;
               },
            }
         );
      } else if (bundle) {
         toast.promise(
            unenrollBundlePost(
               { bundleId: bundle.id, userId },
               {
                  success: () => {
                     Reset();
                  },
               },
               { throw: true }
            ),
            {
               loading: 'Unenrolling...',
               success: 'Unenrolled',
               error: (e) => {
                  return e.message;
               },
            }
         );
      }
   }, [unenrollCoursePost, unenrollBundlePost, course, bundle, Reset, userId]);

   useEffect(() => {
      Reset();
   }, [Reset]);

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <UserPlus
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Expedited Register
            </div>
            <div className="flex items-center gap-2.5">
               <button
                  onClick={handleSubmit(Register)}
                  className="px-5 w-[8.5rem] inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
               >
                  Register
                  <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                     {registerPostLoading ? (
                        <Spinner className="h-4 w-4" />
                     ) : (
                        <Plus className="h-4 w-4" strokeWidth={2} />
                     )}
                  </span>
               </button>
               <button
                  onClick={Reset}
                  className="px-5 py-3.5 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm bg-gradient-to-b from-red-500 to-red-600 rounded-2xl shadow-inner-red"
               >
                  Reset
               </button>
            </div>
         </div>
         <div className="mt-5 h-[1px] gap-5 bg-zinc-50 rounded-2xl border border-zinc-200 p-10 flex flex-col flex-grow overflow-auto">
            <div className="max-w-lg mx-auto w-full flex flex-col gap-5">
               <div className="grid grid-cols-2 gap-5">
                  <Input
                     label="First name"
                     {...registerForm('firstName')}
                     error={errors.firstName}
                  />
                  <Input
                     label="Last name"
                     {...registerForm('lastName')}
                     error={errors.lastName}
                  />
               </div>
               <Input
                  required={false}
                  type="email"
                  label="Email"
                  {...registerForm('email')}
                  error={errors.email}
               />
               <Input
                  label="Phone number"
                  {...registerForm('phoneNumber')}
                  error={errors.phoneNumber}
               />
               <DatePickerInputHook
                  label="Start date"
                  wrapperClassName="col-span-3"
                  value={firstClassDateValue}
                  onChange={(date: Date) => {
                     firstClassDateOnChange(date);
                  }}
                  error={errors.firstClassDate}
                  datePicker={{
                     minDate: new Date(),
                     showYearDropdown: false,
                     showYearPicker: false,
                     showTimeSelect: false,
                     dateFormat: 'MMM d, yyyy',
                  }}
               />
               {!!firstClassDateValue && (
                  <div className="grid grid-cols-3 gap-5">
                     <DropdownHook
                        label="Course type"
                        value={courseTypeValue}
                        onChange={(value: 'Course' | 'Bundle') => {
                           courseTypeOnChange(value);
                           courseType.set(value);
                           setCourse(false);
                           setBundle(false);
                           courseOnChange(undefined);
                           bundleOnChange(undefined);
                           priceOnChange(0);
                        }}
                        options={['Course', 'Bundle']}
                        dropdownTriggerClassname="w-full col-span-1"
                        error={errors.courseType}
                     />
                     <div className="col-span-2 w-full">
                        {courseType.get() === 'Course' ? (
                           <DropdownPaginated
                              key={`course-${firstClassDateValue}`}
                              label="Course"
                              value={courseValue}
                              onChange={(
                                 option,
                                 optionsData?: ExpeditedRegisterCourseOrBundle[]
                              ) => {
                                 setBundle(false);
                                 if (optionsData) {
                                    const findCourse = optionsData.find(
                                       (c) => c.id === option.value
                                    );
                                    if (findCourse) {
                                       setCourse(findCourse);
                                       priceOnChange(findCourse.price);
                                    }
                                 }
                                 courseOnChange(option);
                              }}
                              fetch={(page) =>
                                 fetchExpeditedCourses(
                                    page,
                                    format(
                                       new Date(firstClassDateValue),
                                       'MM/dd/yyyy'
                                    )
                                 )
                              }
                              placeholder="Select course..."
                              dropdownTriggerClassname="w-full"
                              error={errors.course}
                           />
                        ) : (
                           <DropdownPaginated
                              key={`bundle-${firstClassDateValue}`}
                              label="Bundle"
                              value={bundleValue}
                              onChange={(
                                 option,
                                 optionsData?: ExpeditedRegisterCourseOrBundle[]
                              ) => {
                                 setCourse(false);
                                 if (optionsData) {
                                    const findBundle = optionsData.find(
                                       (b) => b.id === option.value
                                    );
                                    if (findBundle) {
                                       setBundle(findBundle);
                                       priceOnChange(findBundle.price);
                                    }
                                 }
                                 bundleOnChange(option);
                              }}
                              fetch={(page) =>
                                 fetchExpeditedBundles(
                                    page,
                                    format(
                                       new Date(firstClassDateValue),
                                       'MM/dd/yyyy'
                                    )
                                 )
                              }
                              placeholder="Select bundle..."
                              dropdownTriggerClassname="w-full"
                              error={errors.bundle}
                           />
                        )}
                     </div>
                  </div>
               )}
               {!!firstClassDateValue && (!!course || !!bundle) && (
                  <div className="grid grid-cols-2 gap-5">
                     <DropdownHook
                        label="Payment type"
                        value={paymentTypeValue}
                        placeholder="Select payment type..."
                        onChange={(value: 'Cash' | 'Credit') => {
                           paymentTypeOnChange(value);
                           paymentType.set(value);
                        }}
                        options={['Cash', 'Credit']}
                        dropdownTriggerClassname="w-full col-span-1"
                        error={errors.paymentType}
                     />
                     <InputNumber
                        iconLabel="$"
                        label="Amount paid"
                        error={errors.price}
                        value={priceValue}
                        onChange={priceOnChange}
                     />
                  </div>
               )}
               {paymentTypeValue === 'Cash' && (
                  <Textarea
                     required={false}
                     label="Notes"
                     placeholder="Note here if student gave deposit..."
                     className="min-h-[100px]"
                     {...registerForm('notes')}
                     error={errors.notes}
                  />
               )}
               <button
                  onClick={handleSubmit(Register)}
                  className="mt-10 px-5 w-full text-center outline-none hover:bg-blue-600 transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white font-semibold py-4 bg-blue-500 rounded-2xl"
               >
                  Register
               </button>
            </div>
            <DialogPay
               key={priceValue}
               title="Expedited Register Payment"
               open={paypal}
               setOpen={(value) => {
                  if (value === false && paypal === true) {
                     Unenroll();
                  }
                  setPaypal(value);
               }}
               body={{
                  id: courseValue
                     ? (courseValue as any).value
                     : bundleValue
                     ? (bundleValue as any).value
                     : '',
                  name: 'Expedited Registration',
                  price: priceValue,
               }}
               action={PaymentSucceeded}
               fail={PaymentFailed}
            />
            {receipt && course && (
               <CourseReceipt
                  open={receipt}
                  setOpen={(value) => {
                     if (value === false && receipt === true) {
                        Reset();
                     }
                     setReceipt(value);
                  }}
                  course={course}
                  values={getValues()}
               />
            )}
            {receipt && bundle && (
               <BundleReceipt
                  open={receipt}
                  setOpen={(value) => {
                     if (value === false && receipt === true) {
                        Reset();
                     }
                     setReceipt(value);
                  }}
                  bundle={bundle}
                  values={getValues()}
               />
            )}
         </div>
      </div>
   );
};

export default ExpeditedRegister;
