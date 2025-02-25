import Confirmation from '@/components/ui/Confirmation';
import Dropdown from '@/components/ui/Dropdown';
import usePost from '@/hooks/usePost';
import { TRoleData, TUserData } from '@/lib/types';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { Plus, Settings, Xmark } from 'iconoir-react';
import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';

const roleColors: Record<string, string> = {
   student: 'zinc',
   instructor: 'blue',
   admin: 'red',
   superuser: 'red',
};

interface RoleManagementProps {
   user: TUserData;
   roles?: TRoleData[];
   allRoles?: TRoleData[] | false;
}

const RoleManagement: FC<RoleManagementProps> = ({ user, roles, allRoles }) => {
   const [userRoles, setUserRoles] = useState<TRoleData[]>(roles ?? []);

   const [showRoleConfirmation, setShowRoleConfirmation] =
      useState<boolean>(false);
   const [selectedRole, setSelectedRole] = useState<TRoleData>();

   const [manageRolesPost] = usePost<
      {
         add: string[];
         remove: string[];
      },
      any
   >('admin', ['roles', 'manage', user.userId]);

   const hasRole = useCallback(
      (role: TRoleData) => {
         return userRoles.find((r) => r.roleId === role.roleId);
      },
      [userRoles]
   );

   const handleRole = useCallback(
      (role: TRoleData) => {
         if (hasRole(role)) {
            toast.promise(
               manageRolesPost(
                  { add: [], remove: [role.roleName] },
                  {
                     success: (data) => {
                        setUserRoles((currentRoles) =>
                           currentRoles.filter(
                              (userRole) => userRole.roleId !== role.roleId
                           )
                        );
                     },
                  },
                  {
                     throw: true,
                  }
               ),
               {
                  loading: 'Removing role...',
                  success: 'Role removed!',
                  error: (err) => {
                     return err.message;
                  },
               }
            );
         } else {
            toast.promise(
               manageRolesPost(
                  { add: [role.roleName], remove: [] },
                  {
                     success: (data) => {
                        setUserRoles((currentRoles) => [...currentRoles, role]);
                     },
                  },
                  {
                     throw: true,
                  }
               ),
               {
                  loading: 'Adding role...',
                  success: 'Role added!',
                  error: (err) => {
                     return err.message;
                  },
               }
            );
         }
      },
      [hasRole, manageRolesPost]
   );
   return (
      <div className="mt-6 flex items-center gap-2.5">
         {userRoles.map((role, roleIndex) => (
            <p
               key={roleIndex}
               className={`py-1.5 px-2 inline-flex items-center text-sm font-medium rounded-lg bg-${
                  roleColors[role.roleName]
               }-500/10 text-${roleColors[role.roleName]}-500`}
            >
               {role.roleName[0].toUpperCase() + role.roleName.slice(1)}
            </p>
         ))}
         <Confirmation
            title={
               selectedRole
                  ? hasRole(selectedRole)
                     ? `Remove ${selectedRole.roleName} role`
                     : `Add ${selectedRole.roleName} role`
                  : ''
            }
            open={showRoleConfirmation}
            setDialogOpen={setShowRoleConfirmation}
            severe={false}
            action={() => handleRole(selectedRole!)}
         />
         <Dropdown
            rootProps={{
               open: showRoleConfirmation ? true : undefined,
            }}
            trigger={
               <button
                  disabled={allRoles === false}
                  className="py-2 px-2 bg-blue-500 transition duration-200 ease-linear hover:bg-blue-600 rounded-lg text-white"
               >
                  <Settings className="h-4 w-4" strokeWidth={2} />
               </button>
            }
         >
            {allRoles ? (
               allRoles.map((role) => (
                  <DropdownMenu.Item
                     key={role.roleId}
                     onClick={() => {
                        setSelectedRole(role);
                        setShowRoleConfirmation(true);
                     }}
                     className={clsx(
                        'text-sm font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center justify-between px-4 py-2.5 relative select-none outline-none',
                        hasRole(role)
                           ? 'bg-zinc-200 data-[highlighted]:text-red-500 data-[highlighted]:bg-zinc-200/75 text-zinc-600'
                           : 'data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-green-500 text-zinc-500'
                     )}
                  >
                     {role.roleName[0].toUpperCase() + role.roleName.slice(1)}
                     {hasRole(role) ? (
                        <Xmark
                           className="h-5 w-5 text-red-500"
                           strokeWidth={2}
                        />
                     ) : (
                        <Plus
                           className="h-5 w-5 text-green-500"
                           strokeWidth={2}
                        />
                     )}
                  </DropdownMenu.Item>
               ))
            ) : (
               <div>Roles could not be loaded</div>
            )}
         </Dropdown>
      </div>
   );
};

export default RoleManagement;
