import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatPriceSimple } from '../../utils/helpers';
import { useAdminStore } from '../../context/adminStore';

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  prefix?: string;
}

function KpiCard({ title, value, change, icon, prefix }: KpiCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gold/10 rounded-lg">{icon}</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-white/80 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-semibold text-ivory">
        {prefix}{value}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7days');
  const orders = useAdminStore(state => state.orders);
  const products = useAdminStore(state => state.products);
  const settings = useAdminStore(state => state.settings);

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'month':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && order.status !== 'cancelled';
    });
  }, [orders, dateRange]);

  // Calculate metrics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItemsSold = filteredOrders.reduce((sum, order) =>
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  // Low stock products
  const lowStockProducts = products.filter(product =>
    product.variants.some(v => v.stock > 0 && v.stock <= settings.lowStockThreshold)
  );

  const outOfStockProducts = products.filter(product =>
    product.variants.every(v => v.stock === 0)
  );

  // Revenue chart data (last 7 days)
  const revenueData = useMemo(() => {
    const data: { date: string; revenue: number; orders: number }[] = [];
    const days = dateRange === 'today' ? 1 : dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 30;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === date.getTime();
      });

      data.push({
        date: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
        orders: dayOrders.length,
      });
    }

    return data;
  }, [filteredOrders, dateRange]);

  // Top products
  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredOrders]);

  // Order status distribution
  const orderStatusData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
    }));
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ivory mb-1">Tableau de bord</h1>
          <p className="text-white/80">Aperçu de votre boutique de parfums</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
        >
          <option value="today">Aujourd'hui</option>
          <option value="7days">7 derniers jours</option>
          <option value="30days">30 derniers jours</option>
          <option value="month">Ce mois-ci</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Chiffre d'affaires"
          value={Math.round(totalRevenue).toLocaleString()}
          change={12.5}
          icon={<DollarSign size={24} className="text-gold" />}
          prefix="دج "
        />
        <KpiCard
          title="Commandes"
          value={totalOrders.toString()}
          change={8.2}
          icon={<ShoppingCart size={24} className="text-gold" />}
        />
        <KpiCard
          title="Articles vendus"
          value={totalItemsSold.toString()}
          change={-3.1}
          icon={<Package size={24} className="text-gold" />}
        />
        <KpiCard
          title="Panier moyen"
          value={Math.round(averageOrderValue).toLocaleString()}
          change={5.3}
          icon={<DollarSign size={24} className="text-gold" />}
          prefix="دج "
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
          <h3 className="font-semibold text-lg mb-4">Aperçu des revenus</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A79A89" opacity={0.2} />
              <XAxis dataKey="date" stroke="#A79A89" fontSize={12} />
              <YAxis stroke="#A79A89" fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip
                formatter={(value) => value ? formatPriceSimple(Number(value)) : ''}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #A79A89' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#C6A46A" strokeWidth={2} name="Revenue (DZD)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
          <h3 className="font-semibold text-lg mb-4">Statut des commandes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A79A89" opacity={0.2} />
              <XAxis dataKey="status" stroke="#A79A89" fontSize={12} />
              <YAxis stroke="#A79A89" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #A79A89' }} />
              <Bar dataKey="count" fill="#C6A46A" name="Commandes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Meilleurs produits</h3>
            <Link to="/admin/products" className="text-sm text-gold hover:text-ivory transition-colors">
              Voir tout →
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-center py-8 text-white/80">Aucune donnée de vente disponible</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white/80 font-medium w-6">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-ivory">{product.name}</p>
                      <p className="text-sm text-white/80">{product.quantity} unités vendues</p>
                    </div>
                  </div>
                  <span className="font-semibold text-ivory">
                    {formatPriceSimple(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Alertes de stock</h3>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
              {lowStockProducts.length + outOfStockProducts.length} articles
            </span>
          </div>
          <div className="space-y-3">
            {lowStockProducts.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-ivory">Low Stock Alert</p>
                  <p className="text-xs text-white/80 mt-1">
                    {lowStockProducts.length} products are running low. Restock recommended.
                  </p>
                </div>
                <Link to="/admin/products?stock=low-stock" className="text-sm text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap">
                  View Items
                </Link>
              </div>
            )}

            {outOfStockProducts.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <Package size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-ivory">Out of Stock</p>
                  <p className="text-xs text-white/80 mt-1">
                    {outOfStockProducts.length} products are currently unavailable.
                  </p>
                </div>
                <Link to="/admin/products?stock=out-of-stock" className="text-sm text-red-600 hover:text-red-700 font-medium whitespace-nowrap">
                  Manage
                </Link>
              </div>
            )}

            {orders.filter(o => o.status === 'pending').length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <ShoppingCart size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-ivory">Pending Orders</p>
                  <p className="text-xs text-white/80 mt-1">
                    {orders.filter(o => o.status === 'pending').length} orders awaiting processing.
                  </p>
                </div>
                <Link to="/admin/orders?status=pending" className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
                  Process
                </Link>
              </div>
            )}

            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && orders.filter(o => o.status === 'pending').length === 0 && (
              <p className="text-center py-8 text-white/80">No alerts at this time</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-gold hover:text-ivory transition-colors flex items-center gap-1">
            View All Orders
            <ArrowUpRight size={16} />
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-center py-8 text-white/80">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/20">
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold py-3">
                    Order ID
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold py-3">
                    Date
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold py-3">
                    Total
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-gold/10 hover:bg-espresso/50 transition-colors">
                    <td className="py-3">
                      <Link to={`/admin/orders/${order.id}`} className="font-mono text-sm text-ivory hover:text-gold">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-sm text-ivory">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </td>
                    <td className="py-3 text-sm text-white/80">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3 text-sm font-medium text-ivory">
                      {formatPriceSimple(order.total)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
