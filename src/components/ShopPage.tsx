'use client';

import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
}

const products: Product[] = [
  { 
    id: 1, 
    name: 'Ceylon Tea Pack', 
    description: 'Authentic Sri Lankan black tea, handpicked from the highlands.', 
    price: 1200, 
    image: 'https://tse4.mm.bing.net/th/id/OIP.a9Y2tY8fJ4LzuRo2FwJ-BQHaHa?pid=Api&h=220&P=0', 
    category: 'Food', 
    rating: 4.8 
  },
  { 
    id: 2, 
    name: 'Handcrafted Wooden Mask', 
    description: 'Traditional Sri Lankan devil mask, carved from local timber.', 
    price: 3500, 
    image: 'https://www.handmadeexpo.com/pics/product/33734_0.jpg', 
    category: 'Art', 
    rating: 4.9 
  },
  { 
    id: 3, 
    name: 'Spice Box Set', 
    description: 'Premium Sri Lankan spices in an elegant gift box.', 
    price: 1800, 
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&crop=center', 
    category: 'Food', 
    rating: 4.7 
  },
  { 
    id: 4, 
    name: 'Elephant Keychain', 
    description: 'Handmade brass keychain symbolizing luck and prosperity.', 
    price: 500, 
    image: 'https://tse1.mm.bing.net/th/id/OIP.9dOyBa7HOsZa2eIK9JEnTQHaGN?pid=Api&h=220&P=0', 
    category: 'Souvenirs', 
    rating: 4.5 
  },
  { 
    id: 5, 
    name: 'Lace Tablecloth', 
    description: 'Intricate handmade lace tablecloth from local artisans.', 
    price: 4500, 
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center', 
    category: 'Textiles', 
    rating: 4.6 
  },
  { 
    id: 6, 
    name: 'Batik Fabric', 
    description: 'Colorful batik fabric featuring traditional Sri Lankan designs.', 
    price: 2500, 
    image: 'https://tse4.mm.bing.net/th/id/OIP.tugwbYJN3TiTsbPQ6lyILgHaF-?pid=Api&h=220&P=0', 
    category: 'Textiles', 
    rating: 4.7 
  },
];

interface CartItem extends Product {
  quantity: number;
}

const ShopPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cartNotification, setCartNotification] = useState<{ show: boolean, productName: string }>({ show: false, productName: '' });
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(product => product.category).filter((cat): cat is string => typeof cat === 'string')))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartNotification({ show: true, productName: product.name });
    setTimeout(() => setCartNotification({ show: false, productName: '' }), 3000);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, qty: number) => {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    setPaymentSuccess(true);
    setCart([]);
    setShowCart(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Sri Lanka Souvenir Shop</h1>
            <p className="text-gray-600">Authentic Sri Lankan handicrafts and products</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
            >
              🛒 Cart ({totalItems})
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </header>

        {paymentSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center flex items-center justify-center gap-2">
            ✓ Thank you for your purchase! Your order has been placed successfully.
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(({ id, name, description, price, image, rating }) => (
              <div
                key={id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="relative h-48 md:h-56">
                  <img 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { 
                      console.error(`Image failed to load: ${image}`); 
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Image+Not+Available';
                    }}
                    loading="lazy"
                  />
                  {rating && (
                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-indigo-700">LKR {price.toLocaleString()}</span>
                    
                    <div className="flex gap-2">
                      {cart.some(item => item.id === id) ? (
                        <>
                          <button
                            onClick={() => removeFromCart(id)}
                            className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition"
                            title="Remove from cart"
                          >
                            ×
                          </button>
                          <button
                            onClick={() => setShowCart(true)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-700 transition"
                          >
                            In Cart
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => addToCart({ id, name, description, price, image })}
                            className="bg-gray-100 text-gray-700 p-2 rounded-full hover:bg-gray-200 transition"
                            title="Add to cart"
                          >
                            +
                          </button>
                          <button
                            onClick={() => addToCart({ id, name, description, price, image })}
                            className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-700 transition"
                          >
                            Buy Now
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Notification */}
      {cartNotification.show && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 animate-fade-in-up z-50">
          <div className="bg-green-100 p-2 rounded-full">
            ✓
          </div>
          <div>
            <p className="font-medium">{cartNotification.productName}</p>
            <p className="text-sm text-gray-600">Added to your cart</p>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white h-auto flex flex-col shadow-xl rounded-lg">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🛒 Your Cart ({totalItems})
              </h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close cart"
              >
                ×
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <span className="text-5xl mb-4">🛒</span>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
                <button
                  onClick={() => setShowCart(false)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 overflow-y-auto max-h-[70vh]">
                  {cart.map(({ id, name, price, quantity, image }) => (
                    <div key={id} className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={image} 
                        alt={name} 
                        className="w-16 h-16 object-cover rounded" 
                        onError={(e) => { 
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64/e5e7eb/6b7280?text=No+Image';
                        }} 
                      />
                      <div className="flex-grow">
                        <h3 className="font-medium">{name}</h3>
                        <p className="text-indigo-600 font-medium">LKR {price.toLocaleString()}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(id, quantity - 1)}
                            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(id, quantity + 1)}
                            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(id)}
                          className="text-gray-400 hover:text-red-500 transition"
                          title="Remove item"
                        >
                          ×
                        </button>
                        <span className="font-medium">
                          LKR {(price * quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-gray-700">Subtotal</span>
                    <span className="font-medium">LKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-medium text-gray-700">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold mb-6">
                    <span>Total</span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowPaymentForm(true);
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium shadow-md"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Enter Payment Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPaymentSuccess(true);
                setShowCart(false);
                setShowPaymentForm(false);
                setCart([]);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    required
                    maxLength={4}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition font-medium"
              >
                Pay Now
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="w-full mt-2 text-gray-500 hover:underline text-sm"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ShopPage;