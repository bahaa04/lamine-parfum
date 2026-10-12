import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import CartDrawer from '../cart/CartDrawer';
import ToastNotifications from '../common/ToastNotifications';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Overlays */}
      <CartDrawer />
      <ToastNotifications />
    </div>
  );
}
