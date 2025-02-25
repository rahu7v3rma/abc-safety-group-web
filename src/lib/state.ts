import { create } from 'zustand';
import { TPermissions, TRoles, TUser } from './types';

export const contextState = create<{
   user: TUser;
   roles: TRoles;
   permissions: TPermissions;
}>(() => ({
   user: false,
   roles: false,
   permissions: [],
}));
