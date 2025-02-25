export function validateZodFile(data: any) {
   if (typeof data === 'string') {
      return true;
   }
   return typeof window === 'undefined'
      ? data instanceof Buffer
      : data instanceof File;
}
