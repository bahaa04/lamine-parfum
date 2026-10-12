import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Mail, Phone, Truck, CreditCard, FileText, Save } from 'lucide-react';
import { useAdminStore } from '../../context/adminStore';
import { formatPriceSimple } from '../../utils/helpers';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useAdminStore(state => state.getOrderById(id!));
  const updateOrderStatus = useAdminStore(state => state.updateOrderStatus);
  const updatePaymentStatus = useAdminStore(state => state.updatePaymentStatus);
  const updateOrderTracking = useAdminStore(state => state.updateOrderTracking);
  const addOrderNote = useAdminStore(state => state.addOrderNote);
  const cancelOrder = useAdminStore(state => state.cancelOrder);

  const [status, setStatus] = useState(order?.status || 'pending');
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || 'pending');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [newNote, setNewNote] = useState('');

  if (!order) {
    return (
      <div className="text-center py-16">
        <Package size={48} className="mx-auto text-white/80 mb-4" />
        <h2 className="text-xl font-semibold text-ivory mb-2">Order not found</h2>
        <Link to="/admin/orders" className="text-gold hover:text-ivory">
          Back to Orders
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    updateOrderStatus(order.id, status);
    alert('Order status updated successfully');
  };

  const handlePaymentUpdate = () => {
    updatePaymentStatus(order.id, paymentStatus);
    alert('Payment status updated successfully');
  };

  const handleTrackingUpdate = () => {
    if (trackingNumber.trim()) {
      updateOrderTracking(order.id, trackingNumber.trim());
      alert('Tracking number updated successfully');
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      addOrderNote(order.id, newNote.trim());
      setNewNote('');
      alert('Note added successfully');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
      cancelOrder(order.id);
      setStatus('cancelled');
      alert('Order cancelled and stock restored');
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/orders')}
          className="p-2 hover:bg-espresso rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-serif text-3xl text-ivory mb-1">Order {order.orderNumber}</h1>
          <p className="text-white/80">
            Placed on {new Date(order.createdAt).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Package size={20} />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-gold/10 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-espresso flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={24} className="text-white/80" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-ivory">{item.name}</h3>
                    <p className="text-sm text-white/80">{item.brand} • {item.size}ml</p>
                    <p className="text-xs text-white/80 mt-1">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-ivory">{formatPriceSimple(item.price)}</p>
                    <p className="text-sm text-white/80">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-ivory mt-1">
                      {formatPriceSimple(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-6 pt-6 border-t border-gold/20 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Subtotal</span>
                <span className="text-ivory">{formatPriceSimple(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Discount {order.couponCode && `(${order.couponCode})`}</span>
                  <span className="text-green-600">-{formatPriceSimple(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Shipping</span>
                <span className="text-ivory">{formatPriceSimple(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gold/20">
                <span className="text-ivory">Total</span>
                <span className="text-ivory">{formatPriceSimple(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Shipping Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-white/80 mb-1">Customer Name</p>
                <p className="text-ivory font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-1">Address</p>
                <p className="text-ivory">{order.shippingAddress.address}</p>
                <p className="text-ivory">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p className="text-ivory">{order.shippingAddress.country}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-white/80" />
                <a href={`mailto:${order.contactEmail}`} className="text-gold hover:text-ivory">
                  {order.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-white/80" />
                <a href={`tel:${order.contactPhone}`} className="text-ivory">
                  {order.contactPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText size={20} />
              Order Notes
            </h2>
            {order.notes && (
              <div className="mb-4 p-3 bg-espresso/50 rounded-lg">
                <pre className="text-sm text-ivory whitespace-pre-wrap font-sans">{order.notes}</pre>
              </div>
            )}
            <div className="space-y-2">
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a note to this order..."
                rows={3}
                className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
            <h2 className="font-semibold text-lg mb-4">Order Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ivory mb-2">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  disabled={order.status === 'cancelled'}
                  className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                onClick={handleStatusUpdate}
                disabled={status === order.status || order.status === 'cancelled'}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                Update Status
              </button>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              Payment
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ivory mb-2">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={e => setPaymentStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <button
                onClick={handlePaymentUpdate}
                disabled={paymentStatus === order.paymentStatus}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                Update Payment
              </button>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Truck size={20} />
              Tracking
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ivory mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
              <button
                onClick={handleTrackingUpdate}
                disabled={!trackingNumber.trim() || trackingNumber === order.trackingNumber}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                Update Tracking
              </button>
            </div>
          </div>

          {/* Actions */}
          {order.status !== 'cancelled' && (
            <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
              <h2 className="font-semibold text-lg mb-4">Actions</h2>
              <button
                onClick={handleCancel}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
