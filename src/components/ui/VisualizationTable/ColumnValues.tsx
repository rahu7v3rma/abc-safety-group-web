'use client';

import { State } from '@hookstate/core';
import { FC, ReactNode, useMemo } from 'react';

import useSelectable from '@/hooks/useSelectable';
import { TVisualizationTableColumnsState } from '@/lib/types';
import * as RDropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { Check, MoreHoriz, Xmark } from 'iconoir-react';
import { TVisualizationTableComponentSchemaType } from '.';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

interface VisualizationTableColumnValuesProps {
   data: State<any[], {}>;
   columnsState: State<TVisualizationTableColumnsState, {}>;
   schema: State<TVisualizationTableComponentSchemaType, {}>;
   selectable: false | ReturnType<typeof useSelectable<any>>;
   actionsClassName?: string;
}

const VisualizationTableColumnValues: FC<
   VisualizationTableColumnValuesProps
> = ({ data, columnsState, schema, selectable, actionsClassName }) => {
   const schemaNoProxy = schema.get({ noproxy: true });

   const rootRender = schemaNoProxy
      ? schemaNoProxy.__root?.render ?? false
      : false;
   const rootActions = schemaNoProxy
      ? schemaNoProxy.__root?.actions ?? false
      : false;
   const rootCustomActions = schemaNoProxy
      ? schemaNoProxy.__root?.customActions ?? false
      : false;

   function renderType(value: any, allowNull: boolean) {
      if (Array.isArray(value)) {
         return value.join(', ');
      } else if (typeof value === 'boolean') {
         if (value == true) {
            return <Check className="h-6 w-6 text-green-600" strokeWidth={2} />;
         } else if (value == false) {
            return <Xmark className="h-6 w-6 text-red-600" strokeWidth={2} />;
         }
      } else if (
         !allowNull &&
         (value === null ||
            value === undefined ||
            (typeof value === 'string' && !value.length))
      ) {
         return <span className="font-medium italic">None</span>;
      }
      return value;
   }

   function renderValues(values: State<any>, rowIndex: number) {
      const render = Object.entries(values.value)
         .map(([column, value], rowIndex) => {
            if (schemaNoProxy) {
               const keySchema = schemaNoProxy[column];
               if (keySchema) {
                  if (keySchema.hidden) return false;
                  if (keySchema.render)
                     return [
                        column,
                        keySchema.render(value, values.value, rowIndex),
                     ];
               }
            }
            return [column, value];
         })
         .filter((v) => v !== false) as [string, any];

      return render.map(([column, value], valueIndex) => {
         const inline = schema.value
            ? schema.value[column]?.inline ?? false
            : false;
         const allowNull = schema.value
            ? schema.value[column]?.allowNull ?? false
            : false;

         const state = columnsState.get()[column];

         return (
            <div
               key={`${rowIndex}-${valueIndex}`}
               className="px-6 py-5 -mb-px flex items-center flex-shrink-0 flex-grow-0 font-medium tracking-tight"
               style={{
                  width: inline || (state ? state.width : 0),
               }}
            >
               <div className="w-full truncate">
                  {renderType(value, allowNull)}
               </div>
            </div>
         );
      });
   }

   function handleChecked(checked: boolean, values: any, rowIndex: number) {
      if (selectable) {
         const [_, selectionMethods] = selectable;

         if (!checked) {
            selectionMethods.addSelection(values, rowIndex);
         } else {
            selectionMethods.removeSelection(rowIndex);
         }
      }
   }

   const isChecked = useMemo(
      () => (data: any) => {
         if (selectable) {
            const [_, { isSelected }] = selectable;
            return isSelected(data.get());
         }
         return false;
      },
      [selectable]
   );

   const container = (
      children: ReactNode,
      values: State<any, {}>,
      rowIndex: number,
      border = true,
      selects = true,
      actions = true
   ) => {
      function isDisabled() {
         if (selectable) {
            const [_, { isSelectable }] = selectable;
            return !isSelectable(rowIndex);
         }
         return true;
      }

      function getRootActions() {
         if (rootActions) {
            return rootActions(values.value, rowIndex);
         }
         return false;
      }

      function getRootCustomActions() {
         if (rootCustomActions && rootCustomActions.length) {
            const newRootCustomActions = rootCustomActions.filter(
               (customAction) => {
                  const value = customAction(values.value);
                  if (value === null) {
                     return false;
                  }
                  return true;
               }
            );

            return newRootCustomActions.length ? newRootCustomActions : false;
         }
         return false;
      }

      const RootActions = getRootActions();
      const RootCustomActions = getRootCustomActions();

      return (
         <div
            className={clsx(
               'inline-flex items-center group flex-grow',
               border && 'border-b border-zinc-200',
               isChecked(values) && 'bg-zinc-100'
            )}
         >
            {selects && selectable && (
               <div className="ml-6">
                  <Checkbox
                     disabled={isDisabled()}
                     onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleChecked(
                           isChecked(values),
                           values.value,
                           rowIndex
                        );
                     }}
                     checked={isChecked(values)}
                     className="h-6 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:border-zinc-300 w-6 flex-shrink-0 flex-grow-0"
                     checkClassName="w-5 h-5"
                  />
               </div>
            )}
            {children}
            {!!actions &&
            (RootActions !== false || RootCustomActions !== false) ? (
               <div
                  className={clsx(
                     'sticky flex items-center pointer-events-none px-5 h-full right-0 transition duration-200 ease-linear z-50',
                     actionsClassName ?? 'bg-white',
                     isChecked(values) && '!bg-zinc-100 hover:!bg-zinc-100'
                  )}
               >
                  {RootCustomActions !== false &&
                     RootCustomActions.map(
                        (CustomAction, customActionIndex) => (
                           <>{CustomAction(values.value)}</>
                        )
                     )}
                  {RootActions !== false && (
                     <Dropdown
                        trigger={
                           <button className="pointer-events-auto bg-zinc-100 border border-zinc-200 outline-none rounded-xl data-[state=open]:bg-zinc-200 py-2 transition duration-200 ease-linear hover:bg-zinc-200 px-2">
                              <MoreHoriz className="h-5 w-5" strokeWidth={2} />
                           </button>
                        }
                     >
                        {Object.keys(RootActions).map((action) => (
                           <RDropdownMenu.Item
                              key={action}
                              onClick={RootActions[action]}
                              className={clsx(
                                 'text-sm font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center px-4 py-2.5 relative select-none outline-none text-zinc-500 data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600'
                              )}
                           >
                              {action}
                           </RDropdownMenu.Item>
                        ))}
                     </Dropdown>
                  )}
               </div>
            ) : null}
         </div>
      );
   };

   return data.map((values, rowIndex) => (
      <div key={rowIndex} className={clsx('flex')}>
         {rootRender
            ? container(
                 rootRender(
                    container(
                       renderValues(values, rowIndex),
                       values,
                       rowIndex,
                       false,
                       true,
                       false
                    ),
                    values.value,
                    rowIndex
                 ),
                 values,
                 rowIndex,
                 true,
                 false
              )
            : container(renderValues(values, rowIndex), values, rowIndex)}
      </div>
   ));
};

export default VisualizationTableColumnValues;
