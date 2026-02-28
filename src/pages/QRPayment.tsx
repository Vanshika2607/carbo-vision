import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useCart } from '../context/CartContext';

interface OrderData {
  user_name: string;
  user_email: string | null;
  user_phone: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
}

const QRPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const state = location.state as { orderData: OrderData; amount: number; items: any[] };

  if (!state || !state.orderData || !state.amount) {
    navigate('/payment');
    return null;
  }

  const { orderData, amount, items } = state;
  const upiId = 'merchant@upi'; // Replace with actual UPI ID
  const payeeName = 'Carbo Vision';
  // Standard UPI format string
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    // Simulate payment verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, we would verify the payment status with a backend here
    console.log('Order placed via QR:', { order: orderData, items });
    
    clearCart();
    navigate('/order-success', {
      state: {
        orderData,
        paymentMethod: 'upi'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/payment')}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          disabled={isProcessing}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payment
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan QR to Pay</h2>
          <p className="text-gray-600 mb-8">Open any UPI app to scan and pay</p>

          <div className="flex justify-center mb-8 bg-white p-4 rounded-xl inline-block shadow-sm border border-gray-100">
            <QRCode value={upiString} size={256} />
          </div>

          <div className="mb-8">
            <p className="text-gray-600 mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-gray-900">₹{amount.toLocaleString()}</p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            UPI ID: {upiId}
          </p>

          <button
            onClick={handlePaymentComplete}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Verifying Payment...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                I have completed the payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRPayment;
