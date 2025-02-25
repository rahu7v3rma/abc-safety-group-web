'use client';

import { State, useHookstate } from '@hookstate/core';
import {
   ArrowSeparateVertical,
   NavArrowLeft,
   Table2Columns,
} from 'iconoir-react';
import { FC, useEffect, useMemo, useRef } from 'react';

import VisualizationTableColumnNames from './ColumnNames';
import VisualizationTableColumnValues from './ColumnValues';
import VisualizationTableLoading from './Loading';

import useSelectable from '@/hooks/useSelectable';
import { cio, uncamelcase } from '@/lib/helpers';
import {
   APIResponsePagination,
   TVisualizationTableButtons,
   TVisualizationTableColumnsState,
   TVisualizationTableDisableds,
   TVisualizationTableFunctions,
   TVisualizationTableLoadings,
   TVisualizationTableRootSchema,
   TVisualizationTableSchema,
} from '@/lib/types';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import Dropdown from '../Dropdown';
import Tooltip from '../Tooltip';
import VisualizationTableButtonCreate from './Buttons/Create';
import VisualizationTableButtonExport from './Buttons/Export';
import VisualizationTableButtonFilter from './Buttons/Filter';
import VisualizationTableEmpty from './Empty';
import VisualizationTableError from './Error';
import VisualizationTablePagination from './Pagination';
import VisualizationTableSearch, { SearchState } from './Search';

export type TVisualizationTableComponentSchemaType =
   | (TVisualizationTableRootSchema<any, true> & TVisualizationTableSchema<any>)
   | undefined;

interface VisualizationTableProps {
   name: string;
   data: State<any[], {}>;
   pagination?: State<APIResponsePagination | false, {}>;
   schema?: TVisualizationTableComponentSchemaType;
   buttons?: (TVisualizationTableButtons | JSX.Element)[];
   error?: false | string;
   empty?: false | string;
   currentTable?: string;
   tables?: string[];
   selectable?: false | ReturnType<typeof useSelectable<any>>;
   search?: boolean | Record<string, () => void>;
   searchOptions?: readonly string[];
   searchState?: State<SearchState, {}>;
   functions?: TVisualizationTableFunctions;
   disabled?: TVisualizationTableDisableds;
   loading?: TVisualizationTableLoadings;
   reset?: () => void;
   maxHeight?: string;
   create?: Record<string, string>;
   filters?: State<string[], {}>;
   filter?: Record<string, (active: boolean) => void>;
   handleCasing?: boolean;
   filtered?: State<string | false, {}>;
   filteredReset?: () => void;
   actionsClassName?: string;
   autoHeight?: boolean;
}

const VisualizationTable: FC<VisualizationTableProps> = ({
   name,
   data,
   pagination,
   schema: schemaValue,
   buttons,
   error = false,
   empty,
   selectable = false,
   search,
   searchOptions,
   searchState,
   functions,
   disabled,
   tables,
   currentTable,
   loading,
   reset,
   maxHeight,
   create,
   filters,
   filter,
   handleCasing = true,
   filtered,
   filteredReset,
   actionsClassName,
   autoHeight = false,
}) => {
   const router = useRouter();
   const pathname = usePathname();
   const columnsState = useHookstate<TVisualizationTableColumnsState>({});
   const schema =
      useHookstate<TVisualizationTableComponentSchemaType>(schemaValue);
   const tableLoading = useHookstate<boolean>(false);
   useEffect(() => {
      tableLoading.set(false);
   }, [data]);

   const tableWrapper = useRef<HTMLDivElement>(null);

   function getColumns() {
      function filterColumns(column: string) {
         if (schema.value) {
            const keySchema = schema.value[column];
            if (keySchema && keySchema.hidden) return false;
         }
         return true;
      }

      if (data.length) {
         if (
            schema.value &&
            schema.value.__root &&
            schema.value.__root.columnsOrder
         ) {
            const columnsOrder = schema.value.__root.columnsOrder;
            const dataColumns = Object.keys(data[0]);
            const allColumns = [
               ...columnsOrder,
               ...dataColumns.filter((c) => !columnsOrder.includes(c)),
            ];
            return allColumns.filter(filterColumns);
         } else {
            return Object.keys(data[0]).filter(filterColumns);
         }
      }
      return [];
   }

   useEffect(() => {
      function getTextWidth(value: string) {
         const element = document.createElement('span');
         element.textContent = value;
         element.style.visibility = 'hidden';
         element.style.display = 'inline';
         element.style.width = 'max-content';
         document.body.appendChild(element);
         const width = element.getBoundingClientRect().width;
         document.body.removeChild(element);
         return width;
      }

      function fitColumnWidth(column: any) {
         let biggest =
            getTextWidth(cio(handleCasing, [uncamelcase(column), column])) + 15;

         const values = data.value.map((columnValues) => columnValues[column]);

         values.forEach((value) => {
            const width = getTextWidth(value);
            if (width > biggest) {
               biggest = width;
            }
         });

         return 50 + biggest;
      }

      function hydrateColumnsState(previousColumnsState: Record<string, any>) {
         const columns = getColumns();

         let state: TVisualizationTableColumnsState = {};

         function getWidth(column: string) {
            const width = fitColumnWidth(column);

            if (
               previousColumnsState &&
               previousColumnsState.hasOwnProperty(column) &&
               previousColumnsState[column].width &&
               width <= previousColumnsState[column].width
            ) {
               return previousColumnsState[column].width;
            }
            return width;
         }

         columns.map((column) => {
            state[column] = {
               width: getWidth(column),
            };
         });

         return state;
      }

      function checkDataState() {
         const orderedColumns = getColumns();
         const columns = [
            ...orderedColumns,
            ...Object.keys(data[0]).filter((c) => !orderedColumns.includes(c)),
         ];

         let checkedData = data.get({ noproxy: true });

         if (
            schema.value &&
            schema.value.__root &&
            schema.value.__root.columnsOrder
         ) {
            checkedData = checkedData.map((values) => {
               let newValues: Record<string, any> = {};

               columns.forEach((column) => {
                  newValues[column] = values[column];
               });

               return newValues;
            });
         }

         return checkedData;
      }

      if (data.length && data.value) {
         const previousColumnsState = columnsState.get({ noproxy: true });
         columnsState.set({});
         columnsState.set(hydrateColumnsState(previousColumnsState));

         const checkedData = checkDataState();
         if (JSON.stringify(checkedData) !== JSON.stringify(data.value)) {
            data.set(checkDataState());
         }
      }
   }, [schema, data]);

   const columnsStateDeepCompare = useMemo(() => {
      const columns = getColumns();
      return columns.every((key) => columnsState.hasOwnProperty(key));
   }, [columnsState]);

   function hasButton(button: TVisualizationTableButtons) {
      return buttons && buttons.includes(button);
   }

   const tableDisabled = useMemo(() => {
      if (
         !data ||
         !data.value ||
         !data.value.length ||
         !Object.keys(columnsState).length ||
         error
      )
         return true;
      return false;
   }, [data, error, columnsState]);

   const customButtons = useMemo(() => {
      if (buttons) {
         return buttons.filter(
            (button) => typeof button !== 'string',
         ) as JSX.Element[];
      }
      return [];
   }, [buttons]);

   return (
      <div className="flex-1 flex flex-col">
         <div className="w-full flex items-center flex-wrap justify-between gap-5">
            <div className="inline-flex font-semibold text-xl tracking-tight items-center">
               <Tooltip content={`${data.length} ${name}`}>
                  <Table2Columns
                     className="mr-4 h-8 w-8 text-blue-500"
                     strokeWidth={2}
                  />
               </Tooltip>
               {tables && tables.length ? (
                  <Dropdown
                     align="start"
                     trigger={
                        <button className="group border border-zinc-200/50 data-[state=open]:bg-zinc-100 focus:outline-none bg-zinc-50 hover:bg-zinc-100 transition duration-200 py-2 px-3 rounded-xl flex items-center gap-2.5 ease-linear text-xl font-semibold tracking-tight">
                           {name}
                           <ArrowSeparateVertical
                              className="h-5 w-5"
                              strokeWidth={2}
                           />
                        </button>
                     }
                  >
                     {tables.map((table) => (
                        <DropdownMenu.Item
                           key={table}
                           disabled={currentTable === table}
                           onClick={() =>
                              router.push(`${pathname}?table=${table}`)
                           }
                           className={clsx(
                              'font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center px-4 py-2.5 relative select-none outline-none',
                              currentTable === table
                                 ? 'text-black bg-zinc-200/75'
                                 : 'text-zinc-500 data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600',
                           )}
                        >
                           {table}
                        </DropdownMenu.Item>
                     ))}
                  </Dropdown>
               ) : filtered ? (
                  filtered.value || name
               ) : (
                  name
               )}
               {filtered && !!filtered.value && (
                  <button
                     onClick={filteredReset}
                     type="button"
                     className="bg-zinc-500 text-sm flex items-center transition duration-200 ease-linear hover:bg-zinc-400 ml-4 text-white py-2 tracking-tight px-4 rounded-xl"
                  >
                     <NavArrowLeft
                        className="h-5 w-5 mr-1 -ml-2"
                        strokeWidth={2}
                     />
                     Go back
                  </button>
               )}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
               {buttons && !error && (
                  <div className="flex items-center gap-2 flex-wrap">
                     {customButtons.map((CustomButton, ci) => CustomButton)}
                     {hasButton('create') &&
                        create &&
                        Object.keys(create).length && (
                           <VisualizationTableButtonCreate
                              routes={create}
                              disabled={disabled?.create}
                           />
                        )}
                     {hasButton('export') && (
                        <VisualizationTableButtonExport
                           func={functions?.export}
                           tableDisabled={tableDisabled}
                           disabled={disabled?.export}
                           loading={loading?.export}
                        />
                     )}
                     {hasButton('filter') &&
                        filter &&
                        filters &&
                        Object.keys(filter).length && (
                           <VisualizationTableButtonFilter
                              filters={filters}
                              filter={filter}
                              disabled={disabled?.filter}
                           />
                        )}
                  </div>
               )}
               {search && !error && (
                  <VisualizationTableSearch
                     search={search}
                     searchOptions={searchOptions}
                     searchState={searchState}
                     func={functions?.search}
                     loading={loading?.search}
                     reset={reset}
                  />
               )}
            </div>
         </div>
         <div
            ref={tableWrapper}
            className={clsx(
               'mt-5 flex flex-col overflow-auto first:rounded-tl-2xl first:rounded-bl-2xl last:rounded-tr-2xl last:rounded-br-2xl border border-zinc-300 rounded-2xl',
               maxHeight
                  ? maxHeight
                  : autoHeight
                    ? 'max-h-full'
                    : 'h-[1px] flex-grow',
            )}
         >
            {tableLoading.value ? (
               <VisualizationTableLoading />
            ) : !empty && data && data.value && data.value.length ? (
               !!columnsStateDeepCompare && Object.keys(columnsState).length ? (
                  <>
                     <VisualizationTableColumnNames
                        handleCasing={handleCasing}
                        data={data}
                        columnsState={columnsState}
                        schema={schema}
                        selectable={selectable}
                        tableWrapper={tableWrapper}
                     />
                     <VisualizationTableColumnValues
                        data={data}
                        columnsState={columnsState}
                        schema={schema}
                        selectable={selectable}
                        actionsClassName={actionsClassName}
                     />
                  </>
               ) : (
                  <VisualizationTableLoading />
               )
            ) : !!error ? (
               <VisualizationTableError message={error} />
            ) : (
               <VisualizationTableEmpty empty={empty} />
            )}
         </div>
         <VisualizationTablePagination
            name={name}
            pagination={pagination}
            tableLoading={tableLoading}
         />
      </div>
   );
};

export default VisualizationTable;
