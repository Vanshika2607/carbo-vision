import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, Smartphone, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

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
  const { items, total, clearCart } = useCart();
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
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, MasterCard, Rupay',
      icon: CreditCard,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive the product',
      icon: CheckCircle,
      color: 'from-gray-600 to-gray-700'
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
        payment_status: selectedPayment === 'cod' ? 'pending' : 'pending',
        order_status: 'pending'
      };

      const orderItems = items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }));

      if (selectedPayment === 'cod') {
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Order placed:', { order: orderData, items: orderItems });

        clearCart();
        navigate('/order-success', {
          state: {
            orderData,
            paymentMethod: selectedPayment
          }
        });
      } else {
        const bankUrl = generateBankingURL(selectedPayment, orderData, orderItems);
        window.location.href = bankUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const generateBankingURL = (method: string, orderData: any, items: any[]) => {
    const baseUrl = window.location.origin;
    const returnUrl = `${baseUrl}/order-success`;

    const params = new URLSearchParams({
      amount: total.toString(),
      order_id: Date.now().toString(),
      customer_name: orderData.user_name,
      customer_phone: orderData.user_phone,
      return_url: returnUrl,
      payment_method: method
    });

    const mockBankUrls: Record<string, string> = {
      upi: 'https://payment-demo.example.com/upi',
      netbanking: 'https://payment-demo.example.com/netbanking',
      card: 'https://payment-demo.example.com/card'
    };

    return `${mockBankUrls[method] || mockBankUrls.upi}?${params.toString()}`;
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
