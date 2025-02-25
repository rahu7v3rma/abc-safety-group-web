'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { roleToPanel, roleWeightage } from './constants';
import { contextState } from './state';
import { TRoleData, TUserRoles } from './types';

export function hasRole(roleName: TUserRoles) {
   const { roles } = contextState.getState();

   if (roles && roles.length) {
      const find = roles.find((r) => r.roleName === roleName);
      return !!find;
   }
   return false;
}

export function redirectRolePanel(
   roles: TRoleData[],
   router: AppRouterInstance
) {
   const roleNames = roles.map((role) => role.roleName);
   const roleWithMaxWeightage = roleNames.sort(
      (a, b) => roleWeightage[b] - roleWeightage[a]
   )[0];
   const assignedPanel = roleToPanel[roleWithMaxWeightage];
   router.push(`/${assignedPanel}`);
}
