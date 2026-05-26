import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopNavbar from './DesktopNavbar';
import MobileAppBar from './MobileAppBar';
import MobileDrawer from './MobileDrawer';

export default function MainLayout({ showBottomNav = true, appBarTitle }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-blush/20 to-lavender/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <DesktopNavbar />
      <MobileAppBar onMenuClick={() => setDrawerOpen(true)} title={appBarTitle} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main
        className={`mx-auto max-w-7xl px-4 md:px-6 ${
          showBottomNav ? 'pb-24 pt-16 md:pb-8 md:pt-0' : 'py-8 md:pt-0'
        }`}
      >
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
