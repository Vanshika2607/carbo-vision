import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Building2, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { postOrderToGoogleSheet } from '../utils/orderWebhook';

// Razorpay interface definition for window
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface LocationState {
  addressData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, total } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const addressData = (location.state as LocationState)?.addressData;

  if (!addressData || items.length === 0) {
    navigate('/cart');
    return null;
  }

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'Pay using Google Pay, PhonePe, Paytm, etc.',
      icon: Smartphone,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'Pay directly from your bank account',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        user_name: addressData.fullName,
        user_email: addressData.email || null,
        user_phone: addressData.phone,
        shipping_address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        total_amount: total,
        payment_method: selectedPayment,
        payment_status: 'pending',
        order_status: 'pending',
        items: items
      };

      if (selectedPayment === 'upi') {
        const options = {
          // A placeholder key since we don't have the user's specific API key yet
          key: "rzp_test_YOUR_RAZORPAY_KEY", 
          amount: total * 100, // Amount is in currency subunits (paise)
          currency: "INR",
          name: "Carbo Vision",
          description: "Purchase from Carbo Vision",
          image: "https://example.com/your_logo", // Optional logo
          handler: async function (response: any) {
            // Payment succeeded 
            // Send entire order data + razorpay ID to the Google Sheets webhook 
            await postOrderToGoogleSheet({
              ...orderData,
              payment_status: 'completed',
              order_status: 'confirmed',
              payment_id: response.razorpay_payment_id
            });
            
            // Navigate to success screen
            navigate('/order-success');
          },
          prefill: {
            name: orderData.user_name,
            email: orderData.user_email || "",
            contact: orderData.user_phone,
          },
          notes: {
            address: orderData.shipping_address,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any){
          alert("Payment failed: " + response.error.description);
          setIsProcessing(false);
        });
        
        rzp1.open();

      } else {
        // Fallback for Net Banking / Manual methods (Or Razorpay simply handles both)
        alert('Currently only UPI via Razorpay is strongly supported in this flow.');
        setIsProcessing(false);
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/checkout')}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          disabled={isProcessing}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Checkout
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Payment</h1>
          <p className="text-lg text-gray-600">Choose your preferred payment method</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-900">{addressData.fullName}</p>
            <p className="text-gray-600">{addressData.phone}</p>
            {addressData.email && <p className="text-gray-600">{addressData.email}</p>}
            <p className="text-gray-600 mt-2">
              {addressData.address}, {addressData.city}, {addressData.state} - {addressData.pincode}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Payment Method</h2>

          <div className="space-y-4">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  disabled={isProcessing}
                  className={`w-full p-4 border-2 rounded-xl transition-all ${
                    selectedPayment === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center mr-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedPayment === method.id && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={!selectedPayment || isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </div>
            ) : (
              `Pay ₹${total.toLocaleString()}`
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
