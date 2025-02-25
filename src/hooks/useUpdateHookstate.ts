import { useHookstate } from '@hookstate/core';
import { useEffect } from 'react';

export default function useUpdateHookstate<T>(
   data: T,
   disableUpdating: boolean = false
) {
   const state = useHookstate<T>(data);

   useEffect(() => {
      if (!disableUpdating) {
         state.set(data);
      }
   }, [data, disableUpdating]);

   return state;
}
