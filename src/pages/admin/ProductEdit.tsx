import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useAdminStore } from '../../context/adminStore';
import { slugify } from '../../utils/helpers';
import type { AdminProduct, ProductVariant } from '../../types/admin';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const getProductById = useAdminStore(state => state.getProductById);
  const addProduct = useAdminStore(state => state.addProduct);
  const updateProduct = useAdminStore(state => state.updateProduct);
  const brands = useAdminStore(state => state.brands);
  const categories = useAdminStore(state => state.categories);

  const existingProduct = !isNew && id ? getProductById(id) : null;

  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    name: '',
    slug: '',
    brand: '',
    brandSlug: '',
    description: '',
    gender: 'unisex',
    category: '',
    collections: [],
    fragranceFamily: '',
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    concentration: '',
    variants: [
      { id: 'variant-1', sku: '', ml: 100, price: 0, stock: 0 },
    ],
    images: [],
    isBestseller: false,
    isNewArrival: false,
    isFeatured: false,
    isPublished: false,
    occasions: [],
    longevity: '',
    projection: '',
    seasons: [],
    seoTitle: '',
    seoDescription: '',
  });

  // Helper to get/set single variant data
  const getSingleVariant = () => formData.variants?.[0] || { id: 'variant-1', sku: '', ml: 100, price: 0, stock: 0 };
  const setSingleVariant = (field: keyof ProductVariant, value: any) => {
    const current = getSingleVariant();
    handleInputChange('variants', [{ ...current, [field]: value }]);
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingProduct) {
      setFormData(existingProduct);
    }
  }, [existingProduct]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug from name
      if (field === 'name') {
        updated.slug = slugify(value);
      }

      // Auto-generate brandSlug from brand
      if (field === 'brand') {
        updated.brandSlug = slugify(value);
      }

      return updated;
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.slug) newErrors.slug = 'Slug is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.fragranceFamily) newErrors.fragranceFamily = 'Fragrance family is required';

    const variant = getSingleVariant();
    if (!variant.sku) newErrors.sku = 'SKU is required';
    if (variant.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (variant.stock < 0) newErrors.stock = 'Stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      alert('Please fix the errors before saving');
      return;
    }

    const productData: AdminProduct = {
      id: isNew ? `prod-${Date.now()}` : id!,
      slug: formData.slug!,
      name: formData.name!,
      brand: formData.brand!,
      brandSlug: formData.brandSlug!,
      description: formData.description!,
      gender: formData.gender!,
      category: formData.category!,
      collections: formData.collections || [],
      fragranceFamily: formData.fragranceFamily!,
      topNotes: formData.topNotes || [],
      heartNotes: formData.heartNotes || [],
      baseNotes: formData.baseNotes || [],
      concentration: formData.concentration || 'Eau de Parfum',
      variants: formData.variants!,
      images: formData.images || [],
      isBestseller: formData.isBestseller || false,
      isNewArrival: formData.isNewArrival || false,
      isFeatured: formData.isFeatured || false,
      isPublished: formData.isPublished || false,
      occasions: formData.occasions || [],
      longevity: formData.longevity || '',
      projection: formData.projection || '',
      seasons: formData.seasons || [],
      seoTitle: formData.seoTitle || formData.name,
      seoDescription: formData.seoDescription || formData.description?.substring(0, 160),
      createdAt: existingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isNew) {
      addProduct(productData);
    } else {
      updateProduct(id!, productData);
    }

    navigate('/admin/products');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-espresso rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-serif text-3xl text-ivory mb-1">
            {isNew ? 'Add Product' : 'Edit Product'}
          </h1>
          <p className="text-white/80">
            {isNew ? 'Create a new perfume product' : 'Update product information and inventory'}
          </p>
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
        >
          <Save size={20} />
          Save Product
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-obsidian rounded-lg p-6 border border-gold/20 space-y-4">
          <h2 className="font-semibold text-lg mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ivory mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold ${
                  errors.name ? 'border-red-500' : 'border-gold/30'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => handleInputChange('slug', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold ${
                  errors.slug ? 'border-red-500' : 'border-gold/30'
                }`}
              />
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Brand *</label>
              <select
                value={formData.brand}
                onChange={e => {
                  const brand = brands.find(b => b.name === e.target.value);
                  handleInputChange('brand', e.target.value);
                  if (brand) handleInputChange('brandSlug', brand.slug);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold ${
                  errors.brand ? 'border-red-500' : 'border-gold/30'
                }`}
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Gender *</label>
              <select
                value={formData.gender}
                onChange={e => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={e => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold ${
                  errors.category ? 'border-red-500' : 'border-gold/30'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">
                Fragrance Family *
              </label>
              <input
                type="text"
                value={formData.fragranceFamily}
                onChange={e => handleInputChange('fragranceFamily', e.target.value)}
                placeholder="e.g., Woody, Floral, Oriental"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold ${
                  errors.fragranceFamily ? 'border-red-500' : 'border-gold/30'
                }`}
              />
              {errors.fragranceFamily && (
                <p className="text-red-500 text-sm mt-1">{errors.fragranceFamily}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ivory mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold ${
                errors.description ? 'border-red-500' : 'border-gold/30'
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Price & Stock */}
        <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
          <h2 className="font-semibold text-lg mb-4">Price & Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-ivory mb-2">SKU *</label>
              <input
                type="text"
                value={getSingleVariant().sku}
                onChange={e => setSingleVariant('sku', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold ${
                  errors.sku ? 'border-red-500' : 'border-gold/30'
                }`}
                placeholder="PRODUCT-SKU"
              />
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Size (ml) *</label>
              <input
                type="number"
                value={getSingleVariant().ml}
                onChange={e => setSingleVariant('ml', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gold/30 rounded-lg focus:outline-none focus:border-gold"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Price (DZD) *</label>
              <input
                type="number"
                value={getSingleVariant().price}
                onChange={e => setSingleVariant('price', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold ${
                  errors.price ? 'border-red-500' : 'border-gold/30'
                }`}
                placeholder="15000"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Stock *</label>
              <input
                type="number"
                value={getSingleVariant().stock}
                onChange={e => setSingleVariant('stock', Math.max(0, Number(e.target.value)))}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold ${
                  errors.stock ? 'border-red-500' : 'border-gold/30'
                }`}
                placeholder="50"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>
        </div>

        {/* Publication Settings */}
        <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
          <h2 className="font-semibold text-lg mb-4">Publication Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={e => handleInputChange('isPublished', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-ivory">Published (visible on storefront)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={e => handleInputChange('isFeatured', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-ivory">Featured Product</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={e => handleInputChange('isBestseller', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-ivory">Bestseller</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={e => handleInputChange('isNewArrival', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-ivory">New Arrival</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 border border-gold/30 rounded-lg hover:bg-espresso transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
          >
            {isNew ? 'Create Product' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
