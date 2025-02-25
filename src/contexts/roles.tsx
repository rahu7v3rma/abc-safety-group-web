'use client';

import {
   createContext,
   Dispatch,
   FC,
   PropsWithChildren,
   SetStateAction,
   useContext,
   useState,
} from 'react';

import { contextState } from '@/lib/state';
import { TRoles, TRolesContext, TRolesContextForce } from '@/lib/types';
import { hookstate } from '@hookstate/core';

export const rolesState = hookstate<TRoles>(false);

export const RolesContext = createContext<{
   roles: TRoles;
   updateRoles: Dispatch<SetStateAction<TRoles>>;
}>({
   roles: false,
   updateRoles: () => {},
});

interface Props extends PropsWithChildren {
   roles: TRoles;
}
export const RolesProvider: FC<Props> = (props) => {
   const [roles, updateRoles] = useState<TRoles>(props.roles ?? false);
   contextState.setState((c) => ({ ...c, roles }));

   return (
      <RolesContext.Provider value={{ roles, updateRoles }}>
         {props.children}
      </RolesContext.Provider>
   );
};

export const useRoles = <T extends TRolesContext | TRolesContextForce>() =>
   useContext(RolesContext) as T;

export const RolesConsumer = RolesContext.Consumer;
