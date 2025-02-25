import { State, useHookstate } from '@hookstate/core';
import { useState } from 'react';

export default function useSelectable<D>(baseState: State<D[], {}>) {
   const selected = useHookstate<D[]>([]);
   const [allSelected, setAllSelected] = useState<boolean>(false);

   function addSelection(data: D, rowIndex: number) {
      selected.set((s) => [
         ...s,
         {
            ...data,
            __rowIndex: rowIndex,
         },
      ]);
   }

   function removeSelection(rowIndex: number) {
      selected.set((s) => s.filter((d: any) => d.__rowIndex !== rowIndex));
      setAllSelected(false);
   }

   function selectAll() {
      selected.set(
         JSON.parse(
            JSON.stringify(
               baseState.value.map((s: any, rowIndex) => ({
                  ...s,
                  __rowIndex: s.__rowIndex ?? rowIndex,
               }))
            )
         )
      );
      setAllSelected(true);
   }

   function removeSelectAll() {
      selected.set([]);
      setAllSelected(false);
   }

   function isSelected(data: D) {
      const find = selected.value.find((selections: any) => {
         const { __rowIndex, ...value } = selections;
         return JSON.stringify(data) === JSON.stringify(value);
      });
      return !!find;
   }

   function isSelectable(rowIndex: number) {
      const hasRowIndex = baseState.some((state) =>
         state.hasOwnProperty('__rowIndex')
      );

      if (hasRowIndex) {
         const find = baseState.find(
            (state: any) => state.__rowIndex.value === rowIndex
         );
         return !!find;
      }

      return true;
   }

   const methods = {
      addSelection,
      selectAll,
      removeSelection,
      removeSelectAll,
      isSelected,
      isSelectable,
      allSelected,
   };

   return [selected, methods] as [typeof selected, typeof methods];
}
