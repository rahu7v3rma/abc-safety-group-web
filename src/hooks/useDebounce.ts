import { useEffect, useState } from 'react';

export default function useDebounce<T>(
   value: T,
   delay: number,
   func: (value: T) => void
): T {
   const [debouncedValue, setDebouncedValue] = useState<T>(value);

   useEffect(() => {
      const timer = setTimeout(() => {
         if (debouncedValue !== value) func(value);
         setDebouncedValue(value);
      }, delay);

      return () => {
         clearTimeout(timer);
      };
   }, [debouncedValue, value, delay, func]);

   return debouncedValue;
}
