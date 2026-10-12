import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  Building2,
  ShoppingCart,
  RotateCcw,
  Tag,
  BarChart3,
  Home as HomeIcon,
  Settings,
  Menu,
  X,
  LogOut,
  Search,
  Bell,
  User,
  ChevronDown,
  Activity,
  Database,
  Megaphone,
} from 'lucide-react';
import { useAdminAuthStore } from '../../context/adminAuthStore';

const navigation = [
  {
    name: 'Aperçu',
    items: [
      { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    name: 'Catalogue',
    items: [
      { name: 'Produits', href: '/admin/products', icon: Package },
      { name: 'Catégories', href: '/admin/categories', icon: FolderTree },
      { name: 'Collections', href: '/admin/collections', icon: Layers },
      { name: 'Marques', href: '/admin/brands', icon: Building2 },
    ],
  },
  {
    name: 'Ventes',
    items: [
      { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Retours & Remboursements', href: '/admin/returns', icon: RotateCcw },
    ],
  },
  {
    name: 'Marketing',
    items: [
      { name: 'Promotions', href: '/admin/promotions', icon: Tag },
      { name: 'Marketing & Suivi', href: '/admin/marketing', icon: Megaphone },
      { name: 'Analytiques', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    name: 'Système',
    items: [
      { name: 'Paramètres', href: '/admin/settings', icon: Settings },
      { name: 'Journal d\'activité', href: '/admin/activity-logs', icon: Activity },
      { name: 'Gestion des données', href: '/admin/data', icon: Database },
    ],
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logout = useAdminAuthStore(state => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  // Force LTR direction for admin panel (French interface)
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'fr';

    // Cleanup: restore user's language preference when leaving admin
    return () => {
      const savedLang = localStorage.getItem('lamine-parfume-language') || 'fr';
      const savedDir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = savedDir;
      document.documentElement.lang = savedLang;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-obsidian" dir="ltr">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-obsidian border-b border-gold/20 z-40">
        <div className="h-full flex items-center justify-between px-4">
          {/* Left: Menu Toggle + Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-espresso rounded-lg transition-colors hidden lg:block"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-espresso rounded-lg transition-colors lg:hidden"
            >
              <Menu size={20} />
            </button>
            <Link to="/admin/dashboard" className="font-serif text-xl font-semibold">
              LAMINE PARFUM
            </Link>
            <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded uppercase tracking-wider font-semibold">
              Admin
            </span>
          </div>

          {/* Right: Search, Notifications, Profile */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-espresso rounded-lg transition-colors hidden md:block">
              <Search size={20} className="text-white/70" />
            </button>
            <button className="p-2 hover:bg-espresso rounded-lg transition-colors relative">
              <Bell size={20} className="text-white/70" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gold/20">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                <User size={16} className="text-ivory" />
              </div>
              <button className="hidden md:flex items-center gap-1 hover:text-gold transition-colors">
                <span className="text-sm font-medium">Admin</span>
                <ChevronDown size={16} />
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 bg-obsidian border-r border-gold/20 transition-all duration-300 z-30 hidden lg:block ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <nav className="p-4 h-full overflow-y-auto">
          {navigation.map((section) => (
            <div key={section.name} className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-2 px-3">
                {section.name}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          active
                            ? 'bg-gold/10 text-gold font-medium'
                            : 'text-ivory hover:bg-espresso'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Store Link */}
          <div className="mt-8 pt-4 border-t border-gold/20">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-gold transition-colors"
            >
              <HomeIcon size={16} />
              Voir la Boutique →
            </a>
          </div>
        </nav>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed top-16 left-0 bottom-0 w-64 bg-obsidian border-r border-gold/20 z-50 lg:hidden overflow-y-auto">
            <nav className="p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-espresso rounded-lg"
              >
                <X size={20} />
              </button>
              {navigation.map((section) => (
                <div key={section.name} className="mb-6">
                  <h3 className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-2 px-3">
                    {section.name}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              active
                                ? 'bg-gold/10 text-gold font-medium'
                                : 'text-ivory hover:bg-espresso'
                            }`}
                          >
                            <Icon size={18} />
                            <span className="text-sm">{item.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
