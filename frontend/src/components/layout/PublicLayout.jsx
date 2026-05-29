import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DesktopNavbar from './DesktopNavbar';
import MobileAppBar from './MobileAppBar';
import MobileDrawer from './MobileDrawer';

/** Landing + admin login only — no bottom nav */
export default function PublicLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-blush/20 to-lavender/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <DesktopNavbar publicOnly />
      <MobileAppBar onMenuClick={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} publicOnly />
      <main className="mx-auto max-w-7xl px-4 pb-8 pt-16 md:px-6 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
