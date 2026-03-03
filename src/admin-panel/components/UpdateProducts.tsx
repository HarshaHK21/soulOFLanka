'use client';
import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios'; 
import { Plus, Save, Trash2 } from 'lucide-react';
import { AuthContext } from '../../components/context/AuthContext'; 

// Define Product interface to match backend Product model
interface Product {
  _id: string; // MongoDB's default ID field
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string; // Optional field
  imageUrl?: string;    // Optional field
  dateAdded: string;
}

// Define form data for adding/editing products
interface ProductFormData {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
}

export default function UpdateProducts() {
  const [products, setProducts] = useState<Product[]>([]); // Initialize with empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    imageUrl: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const authContext = useContext(AuthContext);
  const { token } = authContext!; // Get token from AuthContext

  const API_BASE_URL = 'http://localhost:5000/api/products'; // Backend API for products

  // State for custom confirmation modal (for delete)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);


  // Function to fetch products from the backend
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Product[]>(API_BASE_URL, {
        headers: {
          'x-auth-token': token, // Send the token for authentication
        },
      });
      setProducts(response.data);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError(err.response?.data?.msg || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch products on component mount and when token changes
  useEffect(() => {
    if (token) { // Only fetch if token is available
      fetchProducts();
    }
  }, [token]); // Dependency on token to re-fetch if it changes

  // Handle input changes in the add/edit form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'price' || name === 'stock') ? Number(value) : value 
    }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate add/edit form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Product Name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (newErrors.stock === undefined && formData.stock === undefined) { // Check if stock is truly undefined (not just 0)
        newErrors.stock = 'Stock is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Add/Edit Product submission
  const handleAddEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError(null);

    try {
      const headers = { 'x-auth-token': token };
      if (editingProduct) {
        // Update Product
        await axios.put(`${API_BASE_URL}/${editingProduct._id}`, formData, { headers });
      } else {
        // Add New Product
        await axios.post(API_BASE_URL, formData, { headers });
      }
      fetchProducts(); // Re-fetch products after successful save
      setShowAddEditModal(false);
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: 0, stock: 0, description: '', imageUrl: '' }); // Reset form
    } catch (err: any) {
      console.error('Failed to save product:', err);
      setError(err.response?.data?.msg || 'Failed to save product.');
    }
  };

  // Function to initiate delete confirmation
  const handleDelete = (id: string) => {
    setProductToDeleteId(id);
    setShowConfirmModal(true);
  };

  const executeDelete = async () => {
    if (productToDeleteId) {
      setError(null);
      try {
        await axios.delete(`${API_BASE_URL}/${productToDeleteId}`, {
          headers: { 'x-auth-token': token },
        });
        fetchProducts(); // Re-fetch products after deletion
      } catch (err: any) {
        console.error('Failed to delete product:', err);
        setError(err.response?.data?.msg || 'Failed to delete product.');
      }
    }
    setShowConfirmModal(false);
    setProductToDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setProductToDeleteId(null);
  };

  // Open Add Product modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: 0, stock: 0, description: '', imageUrl: '' });
    setFormErrors({});
    setShowAddEditModal(true);
  };

  // Open Edit Product modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
    });
    setFormErrors({});
    setShowAddEditModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowAddEditModal(false);
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: 0, stock: 0, description: '', imageUrl: '' });
    setFormErrors({});
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading products...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Products</h1>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Stock</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{product.name}</td>
                  <td className="py-3 px-6">{product.category}</td>
                  <td className="py-3 px-6">LKR {product.price.toLocaleString()}</td>
                  <td className="py-3 px-6">{product.stock}</td>
                  <td className="py-3 px-6 flex space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-blue-600 hover:text-blue-800 mr-3 transition duration-150"
                      title="Edit Product"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800 transition duration-150"
                      title="Delete Product"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleAddEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formErrors.stock && <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formErrors.imageUrl && <p className="text-red-500 text-sm mt-1">{formErrors.imageUrl}</p>}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
