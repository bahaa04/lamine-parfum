import { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useAdminStore } from '../../context/adminStore';
import { formatPriceSimple } from '../../utils/helpers';
import type { Coupon } from '../../types/admin';

export default function Promotions() {
  const coupons = useAdminStore(state => state.coupons);
  const addCoupon = useAdminStore(state => state.addCoupon);
  const updateCoupon = useAdminStore(state => state.updateCoupon);
  const deleteCoupon = useAdminStore(state => state.deleteCoupon);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    description: '',
    type: 'percentage',
    value: 0,
    minOrderAmount: 0,
    isActive: true,
  });

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData(coupon);
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        value: 0,
        minOrderAmount: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.description || !formData.value) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, formData);
    } else {
      const newCoupon: Coupon = {
        id: `coupon-${Date.now()}`,
        code: formData.code!.toUpperCase(),
        description: formData.description!,
        type: formData.type!,
        value: formData.value!,
        minOrderAmount: formData.minOrderAmount,
        maxDiscount: formData.maxDiscount,
        startDate: formData.startDate,
        expiryDate: formData.expiryDate,
        usageLimit: formData.usageLimit,
        usageCount: 0,
        isActive: formData.isActive || true,
        createdAt: new Date().toISOString(),
      };
      addCoupon(newCoupon);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(id);
    }
  };

  const handleToggleActive = (coupon: Coupon) => {
    updateCoupon(coupon.id, { isActive: !coupon.isActive });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ivory mb-1">Promotions</h1>
          <p className="text-white/80">Manage discount coupons and promotional codes</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90"
        >
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      <div className="bg-obsidian rounded-lg border border-gold/20 overflow-hidden">
        {coupons.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Tag size={48} className="mx-auto text-white/80 mb-4" />
            <h3 className="text-lg font-semibold text-ivory mb-2">No coupons yet</h3>
            <p className="text-white/80 mb-4">Create your first promotional coupon</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90"
            >
              <Plus size={20} />
              Add Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/20 bg-obsidian/50">
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Code</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Discount</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Min Order</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Usage</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Expiry</th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Status</th>
                  <th className="text-right text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="border-b border-gold/10 hover:bg-obsidian/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-mono font-semibold text-ivory">{coupon.code}</p>
                        <p className="text-sm text-white/80">{coupon.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-ivory">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : formatPriceSimple(coupon.value)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-white/80">
                        {coupon.minOrderAmount ? formatPriceSimple(coupon.minOrderAmount) : '—'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-ivory">
                        {coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-white/80">
                        {coupon.expiryDate
                          ? new Date(coupon.expiryDate).toLocaleDateString()
                          : 'No expiry'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(coupon)}
                          className="p-2 hover:bg-obsidian rounded-lg transition-colors"
                        >
                          <Edit size={16} className="text-white/80" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-obsidian rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="font-serif text-2xl text-ivory mb-6">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ivory mb-2">Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ivory mb-2">Type *</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                      required
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ivory mb-2">Description *</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ivory mb-2">
                      Value * {formData.type === 'percentage' ? '(%)' : '(DZD)'}
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                      min="0"
                      className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ivory mb-2">
                      Min Order Amount (DZD)
                    </label>
                    <input
                      type="number"
                      value={formData.minOrderAmount || 0}
                      onChange={e => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                      min="0"
                      className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ivory mb-2">Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usageLimit || ''}
                      onChange={e => setFormData({ ...formData, usageLimit: e.target.value ? Number(e.target.value) : undefined })}
                      min="0"
                      placeholder="Unlimited"
                      className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ivory mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate?.split('T')[0] || ''}
                      onChange={e => setFormData({ ...formData, expiryDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                      className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-ivory">Active</span>
                </label>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gold/30 rounded-lg hover:bg-obsidian transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
                  >
                    {editingCoupon ? 'Update' : 'Create'} Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
