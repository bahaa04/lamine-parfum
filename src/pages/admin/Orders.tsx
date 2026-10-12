import { useState } from 'react';
import { useAdminStore } from '../../context/adminStore';
import { formatPriceSimple } from '../../utils/helpers';
import { Package, Search, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Orders() {
  const orders = useAdminStore(state => state.orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === '' || order.status === filterStatus;
    const matchesPayment = filterPayment === '' || order.paymentStatus === filterPayment;

    return matchesSearch && matchesStatus && matchesPayment;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-ivory mb-1">Orders</h1>
        <p className="text-white/80">Manage customer orders and fulfillment ({filteredOrders.length} orders)</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-obsidian rounded-lg p-4 border border-gold/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80" size={20} />
            <input
              type="text"
              placeholder="Search by order number, email, or customer name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filterPayment}
            onChange={e => setFilterPayment(e.target.value)}
            className="px-4 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-obsidian rounded-lg border border-gold/20 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Package size={48} className="mx-auto text-white/80 mb-4" />
            <h3 className="text-lg font-semibold text-ivory mb-2">No orders found</h3>
            <p className="text-white/80">
              {searchTerm || filterStatus || filterPayment
                ? 'Try adjusting your search or filters'
                : 'Orders will appear here once customers start purchasing'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/20 bg-espresso/50">
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Order</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Customer</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Date</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Items</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Total</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Status</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Payment</th>
                  <th className="text-right text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-gold/10 hover:bg-espresso/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="font-mono text-sm font-medium text-ivory hover:text-gold transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                        {order.trackingNumber && (
                          <p className="text-xs text-white/80 mt-1">Tracking: {order.trackingNumber}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="font-medium text-ivory">
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                        </p>
                        <p className="text-xs text-white/80">{order.contactEmail}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-white/80">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-ivory">{order.items.length} items</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-ivory">
                        {formatPriceSimple(order.total)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${getPaymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="flex items-center gap-1 text-sm text-gold hover:text-ivory transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      </div>
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
