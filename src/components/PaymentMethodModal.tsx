// src/components/PaymentMethodModal.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios to make API calls

// --- Define the shapes of the data (props) this component will receive ---

// 1. Hotel information
interface Hotel {
  _id: string;
  name: string;
  pricePerNight: number;
}

// 2. Booking details from the previous modal
interface BookingDetails {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

// 3. The complete list of props for this component
interface PaymentMethodModalProps {
  hotel: Hotel;
  bookingDetails: BookingDetails;
  onClose: () => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ hotel, bookingDetails, onClose }) => {
  // --- State Management ---
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for API errors
  const navigate = useNavigate();

  // Placeholder for any saved card details
  const savedCard = {
    cardType: 'Visa',
    last4: '1234',
  };

  // --- Main API Call Logic ---
  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from reloading the page
    setPaymentProcessing(true);
    setError(null);

    try {
      // Send the booking data to your backend API endpoint
      const response = await axios.post('http://localhost:5000/api/bookings', bookingDetails);
      
      console.log('Backend response:', response.data);

      setPaymentProcessing(false);
      alert('Payment Successful! 🎉 Your booking is confirmed.');
      onClose();
      navigate('/dashboard'); // Navigate to the user dashboard to see the booking history

    } catch (err: any) {
      console.error("Booking failed:", err);
      // Set a user-friendly error message
      const errorMessage = err.response?.data?.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      setPaymentProcessing(false);
    }
  };

  const handleCardClick = () => {
    setPaymentMethod('card');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-in-out]">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full m-4 relative transform transition-transform duration-300 scale-95 hover:scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close payment modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Choose Payment Method</h2>

        {/* --- Payment Method Selection --- */}
        {!paymentMethod && (
          <div className="space-y-4">
            <button
              onClick={handleCardClick}
              className="w-full flex items-center justify-center py-3 px-6 rounded-full bg-gray-100 text-gray-800 font-semibold text-lg hover:bg-gray-200 transition-colors duration-300 shadow-sm"
            >
              {/* (Visa SVG Icon) */}
              Card Payment
            </button>
            <button
              onClick={() => setPaymentMethod('paypal')}
              className="w-full flex items-center justify-center py-3 px-6 rounded-full bg-gray-100 text-gray-800 font-semibold text-lg hover:bg-gray-200 transition-colors duration-300 shadow-sm"
            >
              {/* (PayPal SVG Icon) */}
              Pay with PayPal
            </button>
          </div>
        )}

        {/* --- Card Payment Form --- */}
        {paymentMethod === 'card' && (
          <form onSubmit={handlePayNow} className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Credit Card Details</h3>
            
            {savedCard && (
              <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                <span className="font-medium text-gray-700">Use saved card:</span>
                <button 
                  onClick={() => alert("This would use the saved card details.")}
                  className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition-colors"
                  type="button"
                >
                  Pay with {savedCard.cardType} **** {savedCard.last4}
                </button>
              </div>
            )}

            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input id="cardNumber" type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">MM/YY</label>
                <input id="expiry" type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC/CVV</label>
                <input id="cvc" type="password" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="***" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm" required />
              </div>
            </div>
            <div className="flex items-center">
              <input id="save-card" type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} className="h-4 w-4 text-green-600 border-gray-300 rounded" />
              <label htmlFor="save-card" className="ml-2 block text-sm text-gray-900">Save this card for future payments</label>
            </div>
            
            {/* --- Error Display --- */}
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              disabled={paymentProcessing}
            >
              {paymentProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        )}
        
        {/* --- PayPal Section --- */}
        {paymentMethod === 'paypal' && (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Pay with PayPal</h3>
              <p className="text-gray-600 mb-6">You will be redirected to PayPal to complete your purchase securely.</p>
              <button
                className="w-full bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
                disabled={paymentProcessing}
                onClick={handlePayNow} // This will also trigger the API call for record-keeping
              >
                {paymentProcessing ? 'Processing...' : 'Continue to PayPal'}
              </button>
            </div>
        )}
        
      </div>
    </div>
  );
};

export default PaymentMethodModal;