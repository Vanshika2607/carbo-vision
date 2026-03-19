import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Leaf, Award, Users, Eye, MapPin, Briefcase, X } from 'lucide-react';
import { products } from '../data/products';

// ─── Replace this with your deployed Apps Script Web App URL ───────────────
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxh4p2B5bYCu4C7DhHME2iaLMpRQLguaiK-iUXLNr_VkzWFQvY7Kx3UIM3AUhYS1AT7nQ/exec';
// ──────────────────────────────────────────────────────────────────────────

const OCCUPATIONS = [
  'Student',
  'Engineer / Developer',
  'Business Owner / Entrepreneur',
  'Government Employee',
  'Healthcare Professional',
  'Teacher / Educator',
  'Marketing / Sales',
  'Finance / Accounting',
  'Researcher / Scientist',
  'Freelancer',
  'Other',
];

function getDevice(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return 'Tablet';
  if (/mobile|android|iphone/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

// ─── GPS data shape ────────────────────────────────────────────────────────
interface GpsResult {
  lat: string;
  lon: string;
  city: string;
  country: string;
}

const Home = () => {
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [visitorCount, setVisitorCount]     = useState<number | null>(null);

  // Popup state
  const [showModal, setShowModal]           = useState(true);
  const [occupation, setOccupation]         = useState('');
  const [customOccupation, setCustomOccupation] = useState('');

  // GPS state
  const [gpsStatus, setGpsStatus]           = useState<'waiting' | 'granted' | 'denied'>('waiting');
  const gpsRef                              = useRef<GpsResult | null>(null);

  const itemsPerPage   = 3;
  const totalProducts  = products.length;

  // ── 1. Request GPS as soon as the page loads ──────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) { setGpsStatus('denied'); return; }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          gpsRef.current = {
            lat:     lat.toFixed(5),
            lon:     lon.toFixed(5),
            city:    data.address?.city || data.address?.town || data.address?.village || '—',
            country: data.address?.country || '—',
          };
        } catch {
          gpsRef.current = { lat: lat.toFixed(5), lon: lon.toFixed(5), city: '—', country: '—' };
        }
        setGpsStatus('granted');
      },
      () => setGpsStatus('denied'),
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  // ── 2. Carousel timer ─────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + itemsPerPage) % totalProducts);
    }, 6500);
    return () => clearInterval(timer);
  }, [totalProducts]);

  // ── 3. Send visitor data after popup is submitted ─────────────────────
  const handleSubmit = async (skip: boolean) => {
    setShowModal(false);

    if (APPS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT')) return;

    const finalOccupation = skip
      ? 'Not specified'
      : occupation === 'Other'
      ? customOccupation.trim() || 'Other'
      : occupation || 'Not specified';

    const ua = navigator.userAgent;

    // Only use GPS — IP-based location gives wrong city (ISP server, not user location)
    const gps = gpsRef.current;
    const city    = gps?.city    || '—';
    const country = gps?.country || '—';

    const payload = {
      city,
      country,
      device:     getDevice(ua),
      occupation: finalOccupation,
    };

    try {
      const res  = await fetch(APPS_SCRIPT_URL, {
        method:   'POST',
        headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
        body:     JSON.stringify(payload),
        redirect: 'follow',
      });
      const json = await res.json();
      if (json.totalVisitors !== undefined) setVisitorCount(json.totalVisitors);
    } catch { /* silently fail */ }
  };

  const featuredProducts = products.slice(currentIndex, currentIndex + itemsPerPage);
  if (featuredProducts.length < itemsPerPage) {
    featuredProducts.push(...products.slice(0, itemsPerPage - featuredProducts.length));
  }

  return (
    <div>

      {/* ── Occupation Popup Modal ────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">

            {/* Modal header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-5 text-white relative">
              <button
                onClick={() => handleSubmit(true)}
                className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 mb-1">
                <Briefcase className="h-6 w-6" />
                <h2 className="text-xl font-bold">Quick Question</h2>
              </div>
              <p className="text-white/80 text-sm">
                Help us understand our visitors better — takes 5 seconds!
              </p>
            </div>

            {/* GPS status bar */}
            <div className={`flex items-center gap-2 px-6 py-2 text-sm font-medium
              ${gpsStatus === 'granted' ? 'bg-green-50 text-green-700'
              : gpsStatus === 'denied'  ? 'bg-orange-50 text-orange-700'
              : 'bg-blue-50 text-blue-700'}`}>
              <MapPin className="h-4 w-4 flex-shrink-0" />
              {gpsStatus === 'waiting'  && <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />Fetching your exact location via GPS&hellip;</span>}
              {gpsStatus === 'granted'  && `📍 GPS captured — ${gpsRef.current?.city || '…'}, ${gpsRef.current?.country || ''}`}
              {gpsStatus === 'denied'   && 'Location access denied — city will not be recorded'}
            </div>

            {/* Occupation selector */}
            <div className="px-6 py-5">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What best describes your occupation?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {OCCUPATIONS.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setOccupation(occ)}
                    className={`text-left px-3 py-2 rounded-lg border text-sm font-medium transition-all
                      ${occupation === occ
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>

              {/* Custom input when "Other" is selected */}
              {occupation === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify your occupation"
                  value={customOccupation}
                  onChange={(e) => setCustomOccupation(e.target.value)}
                  className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                  autoFocus
                />
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={gpsStatus === 'waiting'}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600
                             text-sm font-medium hover:bg-gray-50 transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={!occupation || gpsStatus === 'waiting'}
                  className={`flex-2 flex-grow py-2.5 rounded-lg text-white text-sm font-semibold
                             transition-all
                             ${occupation && gpsStatus !== 'waiting'
                               ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:opacity-90 shadow-md'
                               : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  {gpsStatus === 'waiting'
                    ? <span className="flex items-center justify-center gap-2"><span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Getting your location&hellip;</span>
                    : 'Submit & Continue →'
                  }
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                Your data is anonymous and used only for analytics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h4 className="text-4xl md:text-4.5xl font-bold mb-6 block text-yellow-300">
              Are you looking for Smart Solutions - here's the right place .
            </h4>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              "Why settle for oridinary ? Go electric, go digital, and grab genius-level innovations - direct from future creators ."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <h2 className="text-xl text-gray-600">
              "Our best products - Designed by the minds of tomorrow."
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-500 ease-in-out" key={currentIndex}>
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                    </div>
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors inline-flex items-center"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Carbo Vision?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Because We Don't Just Build - We Transform . We turn wild ideas into real-world solutions - from electrifying your ride to crafting custom websites .
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">High Performance</h3>
              <p className="text-gray-600">Powerful motors and long-lasting batteries for superior performance</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Reduce carbon footprint with sustainable electric transportation</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">Premium components with comprehensive warranty coverage</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600">Professional installation and ongoing technical support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg text-gray-300">Successful Conversions</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-lg text-gray-300">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">2Yr</div>
              <div className="text-lg text-gray-300">Warranty Coverage</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg text-gray-300">Technical Support</div>
            </div>
            {/* 5th card — Live Visitor Count */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 text-4xl md:text-5xl font-bold mb-2">
                <Eye className="h-9 w-9 text-blue-300" />
                <span>
                  {visitorCount !== null
                    ? visitorCount.toLocaleString()
                    : <span className="animate-pulse text-gray-400">—</span>
                  }
                </span>
              </div>
              <div className="text-lg text-gray-300">Site Visitors</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;