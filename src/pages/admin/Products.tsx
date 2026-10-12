import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Package,
  AlertCircle,
} from 'lucide-react';
import { useAdminStore } from '../../context/adminStore';
import { formatPriceSimple } from '../../utils/helpers';

export default function Products() {
  const products = useAdminStore(state => state.products);
  const brands = useAdminStore(state => state.brands);
  const categories = useAdminStore(state => state.categories);
  const deleteProduct = useAdminStore(state => state.deleteProduct);
  const publishProduct = useAdminStore(state => state.publishProduct);
  const settings = useAdminStore(state => state.settings);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.variants.some(v => v.sku.toLowerCase().includes(term))
      );
    }

    // Filter by brand
    if (filterBrand) {
      filtered = filtered.filter(p => p.brand === filterBrand);
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    // Filter by publication status
    if (filterStatus === 'published') {
      filtered = filtered.filter(p => p.isPublished);
    } else if (filterStatus === 'draft') {
      filtered = filtered.filter(p => !p.isPublished);
    }

    // Filter by stock status
    if (filterStock === 'in-stock') {
      filtered = filtered.filter(p => p.variants.some(v => v.stock > 0));
    } else if (filterStock === 'low-stock') {
      filtered = filtered.filter(p =>
        p.variants.some(v => v.stock > 0 && v.stock <= settings.lowStockThreshold)
      );
    } else if (filterStock === 'out-of-stock') {
      filtered = filtered.filter(p => p.variants.every(v => v.stock === 0));
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'brand':
          aValue = a.brand.toLowerCase();
          bValue = b.brand.toLowerCase();
          break;
        case 'price':
          aValue = Math.min(...a.variants.map(v => v.price));
          bValue = Math.min(...b.variants.map(v => v.price));
          break;
        case 'stock':
          aValue = a.variants.reduce((sum, v) => sum + v.stock, 0);
          bValue = b.variants.reduce((sum, v) => sum + v.stock, 0);
          break;
        case 'updatedAt':
        default:
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, filterBrand, filterCategory, filterStatus, filterStock, sortBy, sortOrder, settings]);

  const getTotalStock = (product: any) => {
    return product.variants.reduce((sum: number, v: any) => sum + v.stock, 0);
  };

  const getStockStatus = (product: any) => {
    const total = getTotalStock(product);
    if (total === 0) return { label: 'Out of Stock', color: 'red' };
    if (total <= settings.lowStockThreshold) return { label: 'Low Stock', color: 'orange' };
    return { label: 'In Stock', color: 'green' };
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct(id);
    }
  };

  const handleDuplicate = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      slug: `${product.slug}-copy`,
      name: `${product.name} (Copy)`,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variants: product.variants.map((v, index) => ({
        ...v,
        id: `prod-${Date.now()}-variant-${index}`,
        sku: `${v.sku}-COPY`,
      })),
    };

    useAdminStore.getState().addProduct(newProduct);
    alert('Product duplicated successfully!');
  };

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    publishProduct(id, !currentStatus);
  };

  const activeFiltersCount = [filterBrand, filterCategory, filterStatus, filterStock].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ivory mb-1">Products</h1>
          <p className="text-white/80">
            Manage your perfume catalog and inventory ({filteredProducts.length} products)
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-obsidian rounded-lg p-4 border border-gold/20">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80" size={20} />
            <input
              type="text"
              placeholder="Search by name, brand, or SKU..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-gold text-white border-gold'
                : 'border-gold/30 hover:border-gold'
            }`}
          >
            <Filter size={20} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-obsidian text-gold rounded-full text-xs font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={e => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
          >
            <option value="updatedAt-desc">Recently Updated</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low-High)</option>
            <option value="price-desc">Price (High-Low)</option>
            <option value="stock-asc">Stock (Low-High)</option>
            <option value="stock-desc">Stock (High-Low)</option>
          </select>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gold/20">
            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Brand</label>
              <select
                value={filterBrand}
                onChange={e => setFilterBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Stock</label>
              <select
                value={filterStock}
                onChange={e => setFilterStock(e.target.value)}
                className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
              >
                <option value="">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-obsidian rounded-lg border border-gold/20 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Package size={48} className="mx-auto text-white/80 mb-4" />
            <h3 className="text-lg font-semibold text-ivory mb-2">No products found</h3>
            <p className="text-white/80 mb-4">
              {searchTerm || activeFiltersCount > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first product'}
            </p>
            {!searchTerm && activeFiltersCount === 0 && (
              <Link
                to="/admin/products/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
              >
                <Plus size={20} />
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/20 bg-obsidian/50">
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">
                    Product
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">
                    Brand
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">
                    Price Range
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">
                    Variants
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">
                    Stock
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-white/80 font-semibold p-4">
                    Status
                  </th>
                  <th className="text-right text-xs uppercase tracking-wider text-white/80 font-semibold p-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const minPrice = Math.min(...product.variants.map(v => v.price));
                  const maxPrice = Math.max(...product.variants.map(v => v.price));
                  const stockStatus = getStockStatus(product);
                  const totalStock = getTotalStock(product);

                  return (
                    <tr key={product.id} className="border-b border-gold/10 hover:bg-obsidian/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-obsidian flex-shrink-0">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={24} className="text-white/80" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              to={`/admin/products/${product.id}`}
                              className="font-medium text-ivory hover:text-gold transition-colors"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-white/80">{product.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-ivory">{product.brand}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-ivory">
                          {minPrice === maxPrice
                            ? formatPriceSimple(minPrice)
                            : `${formatPriceSimple(minPrice)} - ${formatPriceSimple(maxPrice)}`}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-ivory">{product.variants.length} sizes</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-ivory">{totalStock}</span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                              stockStatus.color === 'green'
                                ? 'bg-green-100 text-green-700'
                                : stockStatus.color === 'orange'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {stockStatus.color !== 'green' && <AlertCircle size={12} />}
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            product.isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {product.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${product.id}`}
                            className="p-2 hover:bg-obsidian rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} className="text-white/80" />
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(product.id, product.isPublished)}
                            className="p-2 hover:bg-obsidian rounded-lg transition-colors"
                            title={product.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {product.isPublished ? (
                              <EyeOff size={16} className="text-white/80" />
                            ) : (
                              <Eye size={16} className="text-white/80" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDuplicate(product.id)}
                            className="p-2 hover:bg-obsidian rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy size={16} className="text-white/80" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
