import z from 'zod';

export const AdminUserUpdateSchema = z.object({
   headShot: z.custom<File | string>().optional(),
   photoIdPhoto: z.custom<File | string>().optional(),
   otherIdPhoto: z.custom<File | string>().optional(),
   firstName: z.string().min(1, {
      message: 'First name is required',
   }),
   middleName: z.string().optional(),
   lastName: z.string().min(1, {
      message: 'Last name is required',
   }),
   suffix: z.string().optional(),
   email: z
      .string()
      .min(1, {
         message: 'Email is required',
      })
      .email({
         message: 'Email is invalid',
      }),
   phoneNumber: z
      .string()
      .refine((input) => input.trim().length === 10 && !isNaN(Number(input)), {
         message: 'Phone number is invalid',
      }),
   state: z.string().min(1, {
      message: 'State is required',
   }),
   city: z.string().min(1, {
      message: 'City is required',
   }),
   address: z.string().min(1, {
      message: 'Address is required',
   }),
   zipcode: z.coerce
      .number()
      .optional()
      .refine(
         (v) => {
            if (!v) {
               return false;
            }
            return true;
         },
         { message: 'Zip code is required' }
      ),
   eyeColor: z.string().min(1, {
      message: 'Eye color is required',
   }),
   gender: z.string().min(1, {
      message: 'Gender is required',
   }),
   height: z.object({
      feet: z.coerce
         .number()
         .optional()
         .refine(
            (v) => {
               if (v !== 0 && !v) {
                  return false;
               }
               return true;
            },
            { message: 'Feet is required' }
         ),
      inches: z.coerce
         .number()
         .optional()
         .refine(
            (v) => {
               if (v !== 0 && !v) {
                  return false;
               }
               return true;
            },
            { message: 'Inches is required' }
         ),
   }),
   dob: z
      .string({ errorMap: () => ({ message: 'Birth date is required' }) })
      .min(1, { message: 'Birth date is required' }),
   password: z.coerce
      .string()
      .optional()
      .refine(
         (v) => {
            if (v && v.length < 4) {
               return false;
            }
            return true;
         },
         { message: 'Password too short' }
      ),
   textNotifications: z.boolean().optional(),
   expirationDate: z.date().nullable().optional(),
});

export type AdminUserUpdateSchemaType = z.infer<typeof AdminUserUpdateSchema>;

export const adminUserUpdateDefaultValues: AdminUserUpdateSchemaType = {
   firstName: '',
   lastName: '',
   email: '',
   phoneNumber: '',
   state: '',
   city: '',
   address: '',
   eyeColor: '',
   gender: '',
   height: {},
   dob: '',
};
