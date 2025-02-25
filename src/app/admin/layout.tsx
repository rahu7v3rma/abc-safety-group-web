import { FC, PropsWithChildren } from 'react';

import PanelSidebar from '@/components/Panel/Sidebar';
import PanelView from '@/components/Panel/View';
import AdminSidebarLinks from '@/components/Admin/SidebarLinks';

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
   const panel = 'admin';
   const panelName = 'Admin Panel';

   return (
      <>
         <div className="min-h-screen h-full flex flex-col">
            <div className="w-full flex-1 mx-auto flex">
               <PanelSidebar panel={panel}>
                  <AdminSidebarLinks panel={panel} />
               </PanelSidebar>
               <PanelView panel={panel} panelName={panelName}>
                  {children}
               </PanelView>
            </div>
         </div>
      </>
   );
};

export default AdminLayout;
