import { TAdminTableClassScheduleData, TUserData } from '@/lib/types';
import { hookstate } from '@hookstate/core';
import { z } from 'zod';

export const courseType = hookstate<'Course' | 'Bundle'>('Course');
export const paymentType = hookstate<'Cash' | 'Credit' | null>(null);

export const expeditedRegisterSchema = z.object({
   firstName: z.string().min(1, {
      message: 'First name is required',
   }),
   lastName: z.string().min(1, {
      message: 'Last name is required',
   }),
   email: z.string().refine((input) => {
      if (!input) return true;
      if (input && z.string().email().safeParse(input).success) return true;
      return false;
   }),
   phoneNumber: z
      .string()
      .refine((input) => input.trim().length === 10 && !isNaN(Number(input)), {
         message: 'Phone number is invalid',
      }),
   firstClassDate: z
      .date({
         errorMap: () => ({ message: 'First class date is required' }),
      })
      .nullable(),
   courseType: z.enum(['Course', 'Bundle'], {
      errorMap: () => ({ message: 'Course type is required' }),
   }),
   course: z
      .object({
         text: z.string(),
         value: z.string(),
      })
      .optional()
      .refine(
         (v) => {
            if (courseType.get() === 'Course' && !v) {
               return false;
            }
            return true;
         },
         { message: 'Course is required' }
      ),
   bundle: z
      .object({
         text: z.string(),
         value: z.string(),
      })
      .optional()
      .refine(
         (v) => {
            if (courseType.get() === 'Bundle' && !v) {
               return false;
            }
            return true;
         },
         { message: 'Bundle is required' }
      ),
   paymentType: z
      .enum(['Cash', 'Credit'], {
         errorMap: () => ({ message: 'Payment type is required' }),
      })
      .nullable()
      .refine(
         (v) => {
            if (!v) {
               return false;
            }
            return true;
         },
         { message: 'Payment type is required' }
      ),
   price: z.number({ errorMap: () => ({ message: 'Price is required' }) }),
   notes: z.string().optional(),
});

export type expeditedRegisterSchemaType = z.infer<
   typeof expeditedRegisterSchema
>;

export const expeditedRegisterStateDefault: expeditedRegisterSchemaType = {
   firstName: '',
   lastName: '',
   email: '',
   firstClassDate: null,
   phoneNumber: '',
   courseType: 'Course',
   paymentType: null,
   price: 0,
};

export type ExpeditedRegisterCourseOrBundle = {
   id: string;
   type: 'course' | 'bundle';
   name: string;
   schedule: TAdminTableClassScheduleData[];
   instructors: Pick<TUserData, 'firstName' | 'lastName' | 'userId'>[];
   courses: {
      courseId: string;
      courseName: string;
      briefDescription?: string | null;
   }[];
   courseName: string;
   startDate: string;
   price: number;
   remoteLink: string;
   address: string;
};

export type ExpeditedRegisterPostPayload = {
   firstName: string;
   lastName: string;
   phoneNumber: string;
   email?: string;
   courseId?: string;
   bundleId?: string;
   notes?: string;
};
