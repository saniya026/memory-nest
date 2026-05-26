import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import DesktopNavbar from '../../components/layout/DesktopNavbar';

export default function DashboardLayout({ admin = false }) {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <DesktopNavbar />
      <div className="mx-auto flex max-w-7xl">
        <DashboardSidebar admin={admin} />
        <main className="flex-1 p-6 pb-24 md:pb-8 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
