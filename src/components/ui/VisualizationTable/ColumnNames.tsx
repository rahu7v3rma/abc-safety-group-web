'use client';

import { StrictModeDroppable } from '@/components/StrictModeDroppable';
import useSelectable from '@/hooks/useSelectable';
import { cio, uncamelcase } from '@/lib/helpers';
import { TVisualizationTableColumnsState } from '@/lib/types';
import { State, useHookstate } from '@hookstate/core';
import clsx from 'clsx';
import { Xmark } from 'iconoir-react';
import { FC, RefObject } from 'react';
import {
   DragDropContext,
   Draggable,
   DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { TVisualizationTableComponentSchemaType } from '.';
import Checkbox from '../Checkbox';
import Tooltip from '../Tooltip';

interface VisualizationTableColumnNamesProps {
   data: State<any[], {}>;
   columnsState: State<TVisualizationTableColumnsState, {}>;
   schema: State<TVisualizationTableComponentSchemaType, {}>;
   selectable: false | ReturnType<typeof useSelectable<any>>;
   handleCasing: boolean;
   tableWrapper: RefObject<HTMLDivElement>;
}

const VisualizationTableColumnNames: FC<VisualizationTableColumnNamesProps> = ({
   columnsState,
   schema,
   selectable,
   handleCasing,
   tableWrapper,
}) => {
   const dragging = useHookstate<boolean>(false);
   const draggingDisabled = useHookstate<boolean>(false);
   const resizingData = useHookstate({
      columnStartX: 0,
      columnStartWidth: 0,
   });
   const resizing = useHookstate<string | false>(false);

   function isResizing(column: string) {
      return resizing && resizing.value === column;
   }

   function resize(e: any) {
      if (resizing.value) {
         const newWidth =
            resizingData.columnStartWidth.value +
            (e.clientX - resizingData.columnStartX.value);
         columnsState[resizing.value].width.set(newWidth > 75 ? newWidth : 75);
      }
   }

   function stopResize() {
      resizing.set(false);
      resizingData.set({
         columnStartX: 0,
         columnStartWidth: 0,
      });

      document.documentElement.removeEventListener('mousemove', resize, false);
      document.documentElement.removeEventListener(
         'mouseup',
         stopResize,
         false
      );
   }
   function resizeColumn(e: any, column: string) {
      resizing.set(column);
      resizingData.set({
         columnStartX: e.clientX,
         columnStartWidth: columnsState[column].width.value,
      });

      document.documentElement.addEventListener('mousemove', resize, false);
      document.documentElement.addEventListener('mouseup', stopResize, false);
   }

   function renderNames() {
      const columns = Object.keys(columnsState.get());
      return columns.map((column, columnIndex) => {
         const keySchema = schema.value ? schema.value[column] : false;

         if (keySchema) {
            if (keySchema.hidden) return null;
         }

         const inline = keySchema ? keySchema.inline ?? false : false;

         const state = columnsState.get()[column];

         function getStyle(style: any, snapshot: DraggableStateSnapshot) {
            if (!snapshot.isDropAnimating) {
               if (snapshot.isDragging) {
                  return {
                     ...style,
                     transform: `${style.transform}`,
                  };
               } else {
                  return style;
               }
            }
            const { moveTo } = snapshot.dropAnimation!;
            const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;

            return {
               ...style,
               transform: `${translate}`,
            };
         }

         return (
            <Draggable
               key={`column-${columnIndex}`}
               draggableId={`column-${columnIndex}`}
               index={columnIndex}
               isDragDisabled={columns.length === 1 || !!draggingDisabled.value}
            >
               {(provided, snapshot) => (
                  <div
                     ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                     onMouseDown={() => {
                        if (tableWrapper.current) {
                           tableWrapper.current.scrollTo({
                              top: 0,
                           });
                        }
                     }}
                     className={clsx(
                        'h-14 relative group -mb-px flex px-6 items-center flex-shrink-0 flex-grow-0 tracking-tight font-medium text-sm bg-zinc-50',
                        snapshot.isDragging
                           ? 'border-zinc-300 border text-zinc-600'
                           : 'border-zinc-200 border-r border-b text-zinc-500'
                     )}
                     style={{
                        width: inline || (state ? state.width : 0),
                        ...getStyle(provided.draggableProps.style, snapshot),
                     }}
                  >
                     <div className="truncate">
                        {keySchema
                           ? keySchema.name ??
                             cio(handleCasing, [uncamelcase(column), column])
                           : cio(handleCasing, [uncamelcase(column), column])}
                     </div>
                     {columns.length > 1 && (
                        <div
                           className={clsx(
                              'absolute hidden group-hover:flex inset-y-0 items-center',
                              inline ? 'right-2' : 'right-5'
                           )}
                        >
                           <Tooltip content="Remove column">
                              <button
                                 onClick={() => {
                                    schema.set((currentSchema) => ({
                                       ...(currentSchema || {}),
                                       [column]: {
                                          ...((currentSchema || {})[column] ||
                                             {}),
                                          hidden: true,
                                       },
                                    }));
                                 }}
                                 className="text-red-500 transition duration-200 ease-linear hover:text-red-600"
                              >
                                 <Xmark className="h-5 w-5" strokeWidth={2} />
                              </button>
                           </Tooltip>
                        </div>
                     )}
                     {!snapshot.isDragging && !inline && (
                        <div
                           onMouseEnter={() => {
                              if (!dragging.value) {
                                 draggingDisabled.set(true);
                              }
                           }}
                           onMouseLeave={() => {
                              if (!dragging.value) {
                                 draggingDisabled.set(false);
                              }
                           }}
                           onMouseDown={(e) => {
                              e.stopPropagation();
                              resizeColumn(e, column);
                           }}
                           className={clsx(
                              'absolute z-50 flex items-center justify-center px-1 cursor-e-resize inset-y-0 right-0 transition duration-100 ease-linear',
                              {
                                 'bg-zinc-200': isResizing(column),
                                 'hover:bg-zinc-200 bg-zinc-100':
                                    !isResizing(column),
                              }
                           )}
                        />
                     )}
                  </div>
               )}
            </Draggable>
         );
      });
   }

   function handleChecked(checked: boolean) {
      if (selectable) {
         const [_, selectionMethods] = selectable;

         if (checked) {
            selectionMethods.selectAll();
         } else {
            selectionMethods.removeSelectAll();
         }
      }
   }

   function checkedAll() {
      if (selectable) {
         const [_, { allSelected }] = selectable;
         return allSelected;
      }
      return false;
   }

   function handleOnDragEnd(result: any) {
      dragging.set(false);
      if (!result.destination) return;

      const columns = Object.keys(columnsState.get());
      const currentSchema = schema.get({ noproxy: true });

      const [reorderedItem] = columns.splice(result.source.index, 1);
      columns.splice(result.destination.index, 0, reorderedItem);

      schema.set({
         ...(currentSchema || {}),
         __root: {
            ...((currentSchema || {}).__root || {}),
            columnsOrder: columns,
         },
      });
   }

   return (
      <div className="flex sticky top-0 bg-zinc-50 z-[9999] border-b border-zinc-200 items-center">
         {selectable && (
            <Checkbox
               onCheckedChange={handleChecked}
               checked={checkedAll()}
               className="h-6 ml-6 w-6 flex-shrink-0 flex-grow-0"
               checkClassName="w-5 h-5"
            />
         )}
         <DragDropContext
            onDragStart={() => {
               dragging.set(true);
            }}
            onDragEnd={handleOnDragEnd}
         >
            <StrictModeDroppable
               droppableId="columnNames"
               direction="horizontal"
            >
               {(provided) => (
                  <>
                     <div
                        className="flex items-center"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                     >
                        {renderNames()}
                     </div>
                     {provided.placeholder}
                  </>
               )}
            </StrictModeDroppable>
         </DragDropContext>
      </div>
   );
};

export default VisualizationTableColumnNames;
