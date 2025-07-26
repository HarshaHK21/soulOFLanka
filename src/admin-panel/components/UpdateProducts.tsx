'use client';
import { useState } from 'react';
import { dummyProducts } from './data/dummyData';
import { Plus, Save, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: string;
}

export default function UpdateProducts() {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: 0, status: 'Available' });

  const handleUpdate = (id: string, field: string, value: string | number) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete this product?`)) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      alert('Please fill in all fields with valid values.');
      return;
    }
    const newId = (products.length + 1).toString();
    setProducts([...products, { ...newProduct, id: newId }]);
    setNewProduct({ name: '', category: '', price: 0, status: 'Available' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Update Products
        </h2>
        <button
          onClick={handleAddProduct}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Add Product Form */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Create New Product</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
          />
          <input
            type="number"
            placeholder="Price (LKR)"
            value={newProduct.price || ''}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            className="p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
          />
          <select
            value={newProduct.status}
            onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
            className="p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
          >
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
              <th className="p-4 text-left text-sm font-semibold uppercase text-gray-800 dark:text-gray-200">Name</th>
              <th className="p-4 text-left text-sm font-semibold uppercase text-gray-800 dark:text-gray-200">Category</th>
              <th className="p-4 text-left text-sm font-semibold uppercase text-gray-800 dark:text-gray-200">Price (LKR)</th>
              <th className="p-4 text-left text-sm font-semibold uppercase text-gray-800 dark:text-gray-200">Status</th>
              <th className="p-4 text-left text-sm font-semibold uppercase text-gray-800 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                } hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors duration-200`}
              >
                <td className="p-4">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleUpdate(product.id, 'name', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                    placeholder="Enter product name"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={product.category}
                    onChange={(e) => handleUpdate(product.id, 'category', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                    placeholder="Enter category"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleUpdate(product.id, 'price', Number(e.target.value))}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                    placeholder="Enter price"
                  />
                </td>
                <td className="p-4">
                  <select
                    value={product.status}
                    onChange={(e) => handleUpdate(product.id, 'status', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  >
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </td>
                <td className="p-4 flex space-x-2">
                  <button
                    onClick={() => alert(`Updated product ${product.name}`)}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}