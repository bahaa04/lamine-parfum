import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import Brands from './pages/Brands';
import BrandDetail from './pages/BrandDetail';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Products from './pages/admin/Products';
import ProductEdit from './pages/admin/ProductEdit';
import Categories from './pages/admin/Categories';
import Orders from './pages/admin/Orders';
import OrderDetail from './pages/admin/OrderDetail';
import Promotions from './pages/admin/Promotions';
import {
  Brands as AdminBrands,
  Collections,
  Returns,
  SettingsPage,
  Analytics,
  ActivityLogs,
  DataManagement,
  Marketing,
} from './pages/admin/PlaceholderPages';

function App() {
  return (
    <Routes>
      {/* Public Storefront */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="collections/:gender" element={<Collection />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="brands" element={<Brands />} />
        <Route path="brands/:slug" element={<BrandDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductEdit />} />
          <Route path="categories" element={<Categories />} />
          <Route path="collections" element={<Collections />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="returns" element={<Returns />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
          <Route path="data" element={<DataManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
