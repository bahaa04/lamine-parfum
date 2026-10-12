import { useState } from 'react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { useAdminStore } from '../../context/adminStore';
import type { Category } from '../../types/admin';
import { slugify } from '../../utils/helpers';

export default function Categories() {
  const categories = useAdminStore(state => state.categories);
  const addCategory = useAdminStore(state => state.addCategory);
  const updateCategory = useAdminStore(state => state.updateCategory);
  const deleteCategory = useAdminStore(state => state.deleteCategory);
  const products = useAdminStore(state => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', isActive: true });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, slug: category.slug, description: category.description, isActive: category.isActive });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        ...formData,
        slug: formData.slug || slugify(formData.name),
        displayOrder: categories.length + 1,
        createdAt: new Date().toISOString(),
      };
      addCategory(newCategory);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const productsInCategory = products.filter(p => p.category === categories.find(c => c.id === id)?.name);
    if (productsInCategory.length > 0) {
      alert(`Cannot delete category with ${productsInCategory.length} products. Please reassign them first.`);
      return;
    }
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ivory mb-1">Categories</h1>
          <p className="text-white/80">Organize products into categories</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="bg-obsidian rounded-lg border border-gold/20 overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FolderTree size={48} className="mx-auto text-white/80 mb-4" />
            <h3 className="text-lg font-semibold text-ivory mb-2">No categories yet</h3>
            <p className="text-white/80 mb-4">Create your first category</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20 bg-espresso/50">
                <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Name</th>
                <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Slug</th>
                <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Products</th>
                <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Status</th>
                <th className="text-right text-xs uppercase tracking-wider text-white/80 font-semibold p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => {
                const productCount = products.filter(p => p.category === category.name).length;
                return (
                  <tr key={category.id} className="border-b border-gold/10 hover:bg-espresso/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-ivory">{category.name}</p>
                        <p className="text-sm text-white/80">{category.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-mono text-white/80">{category.slug}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-ivory">{productCount} products</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(category)} className="p-2 hover:bg-espresso rounded-lg">
                          <Edit size={16} className="text-white/80" />
                        </button>
                        <button onClick={() => handleDelete(category.id)} className="p-2 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-obsidian rounded-lg max-w-md w-full p-6">
            <h2 className="font-serif text-2xl text-ivory mb-6">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ivory mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ivory mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ivory mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                />
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gold/30 rounded-lg hover:bg-espresso">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
