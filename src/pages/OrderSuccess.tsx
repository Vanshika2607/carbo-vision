import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';

interface LocationState {
  orderData?: {
    user_name: string;
    user_phone: string;
    shipping_address: string;
    city: string;
    state: string;
    pincode: string;
    total_amount: number;
  };
  paymentMethod?: string;
}

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.orderData) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state?.orderData) {
    return null;
  }

  const orderNumber = `ORD${Date.now()}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-lg text-green-50">Thank you for your purchase</p>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Order Number</span>
                <span className="text-lg font-bold text-blue-600">{orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Payment Method</span>
                <span className="text-sm font-semibold text-gray-900 uppercase">
                  {state.paymentMethod === 'cod' ? 'Cash on Delivery' : state.paymentMethod}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Delivery Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="font-medium text-gray-900">{state.orderData.user_name}</p>
                <p className="text-gray-600">{state.orderData.user_phone}</p>
                <p className="text-gray-600">
                  {state.orderData.shipping_address}, {state.orderData.city}, {state.orderData.state} - {state.orderData.pincode}
                </p>
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Estimated Delivery:</span>{' '}
                    {estimatedDelivery.toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{state.orderData.total_amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>You will receive a confirmation call within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Our team will schedule the installation at your convenience</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Free installation service included with your purchase</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>2-year comprehensive warranty on all products</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/"
                className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <Link
                to="/products"
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p>Need help? Contact us at carbovision2025@gmail.com or +91 98157 79477</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
