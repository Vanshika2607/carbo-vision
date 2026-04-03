import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Zap, Leaf, Award, Users, MapPin, 
  Briefcase, X, Star, ShieldCheck 
} from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

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
  const [heroIndex, setHeroIndex]           = useState(0);
  const [heroVisible, setHeroVisible]       = useState(true);

  // Popup state - now hidden by default
  const [showModal, setShowModal]           = useState(false);
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

  // ── 2. Carousel timer (featured products grid) ───────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + itemsPerPage) % totalProducts);
    }, 6500);
    return () => clearInterval(timer);
  }, [totalProducts]);

  // ── 2b. Hero product slideshow every 6s with crossfade ───────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroVisible(false);
      setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % products.length);
        setHeroVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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
      await fetch(APPS_SCRIPT_URL, {
        method:   'POST',
        headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
        body:     JSON.stringify(payload),
        redirect: 'follow',
      });
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
      <section className="relative overflow-hidden bg-brand-dark pt-12 pb-16 md:pt-16 md:pb-20">
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-primary/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-secondary/10 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-secondary text-xs font-bold mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-secondary"></span>
                </span>
                Innovation Meets Reality
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 font-display leading-[1.1] tracking-tight">
                Smart Solutions <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-blue-400">
                  Direct from the Future.
                </span>
              </h1>
              <p className="text-base text-gray-400 mb-7 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Why settle for ordinary? Go electric, go digital, and grab genius-level innovations — crafted to transform your life and drive sustainability.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="group bg-brand-secondary text-brand-dark px-8 py-3 rounded-xl font-bold text-base hover:bg-white transition-all duration-300 shadow-lg shadow-brand-secondary/10 flex items-center justify-center gap-2"
                >
                  Explore Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-3 rounded-xl font-bold text-base text-white border-2 border-white/10 hover:bg-white/5 transition-all flex items-center justify-center"
                >
                  Our Vision
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-6 opacity-50 hover:opacity-80 transition-opacity duration-500">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold tracking-widest uppercase">Certified Safety</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold tracking-widest uppercase">2yr Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold tracking-widest uppercase">500+ Users</span>
                </div>
              </div>
            </div>

            {/* Hero Product Slideshow */}
            <div className="flex-1 relative">
              <div className="relative bg-gradient-to-br from-brand-primary to-blue-900 rounded-[2rem] p-1.5 shadow-2xl overflow-hidden">
                {/* Crossfade image */}
                <img
                  key={heroIndex}
                  src={products[heroIndex].image}
                  alt={products[heroIndex].name}
                  className="rounded-[1.7rem] w-full aspect-[4/5] object-cover"
                  style={{
                    opacity: heroVisible ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent rounded-[2rem]"></div>
                {/* Product info overlay */}
                <div
                  className="absolute bottom-5 left-5 right-5 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10"
                  style={{
                    opacity: heroVisible ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out',
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-brand-secondary text-xs font-bold uppercase tracking-widest mb-0.5">Featured Item</p>
                      <h3 className="text-base font-bold text-white">{products[heroIndex].name}</h3>
                      <p className="text-white/60 text-xs mt-0.5">₹{products[heroIndex].price.toLocaleString()}</p>
                    </div>
                    <Link to={`/product/${products[heroIndex].id}`} className="bg-white p-2 rounded-lg text-brand-dark hover:bg-brand-secondary transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  {/* Dot indicators */}
                  <div className="flex gap-1 mt-3 justify-center">
                    {products.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setHeroVisible(false); setTimeout(() => { setHeroIndex(i); setHeroVisible(true); }, 300); }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === heroIndex ? 'w-5 bg-brand-secondary' : 'w-1.5 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-brand-secondary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand-primary/30 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
            <div className="max-w-xl">
              <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-[0.2em] mb-2">Our Showcase</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-brand-primary font-display mb-3">Featured Innovations</h3>
              <p className="text-gray-500 text-sm">
                Hand-picked kits and smart solutions designed by the minds of tomorrow.
              </p>
            </div>
            <Link 
              to="/products"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-brand-primary font-bold text-sm hover:bg-brand-light transition-all"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" key={currentIndex}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-10 bg-brand-light rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-50">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center shadow-md shadow-indigo-100">
                   <Zap className="w-6 h-6 text-brand-secondary fill-brand-secondary" />
                </div>
                <div>
                   <h4 className="text-base font-bold text-brand-primary font-display">Looking for something custom?</h4>
                   <p className="text-gray-500 text-sm">We specialize in custom web and hardware solutions.</p>
                </div>
             </div>
             <Link
               to="/contact"
               className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-all shadow-md shadow-indigo-100"
             >
               Get Quote →
             </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Carbo Vision - Redesigned */}
      <section className="py-14 bg-brand-light/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-[0.2em] mb-2">The Carbo Difference</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-brand-primary font-display">Why Trust Us?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { 
                icon: <Zap className="w-5 h-5" />, 
                title: "High Performance", 
                desc: "Powerful motors and high-density batteries for superior range.",
                color: "bg-blue-500"
              },
              { 
                icon: <Leaf className="w-5 h-5" />, 
                title: "Eco-Friendly", 
                desc: "Sustainable engineering to minimize your environment impact.",
                color: "bg-emerald-500"
              },
              { 
                icon: <Award className="w-5 h-5" />, 
                title: "Quality Assured", 
                desc: "Rigorous testing protocols for every custom-built component.",
                color: "bg-amber-500"
              },
              { 
                icon: <Users className="w-5 h-5" />, 
                title: "Expert Support", 
                desc: "24/7 technical assistance from our dedicated engineering team.",
                color: "bg-indigo-500"
              }
            ].map((feature, i) => (
              <div key={i} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={`${feature.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <h4 className="text-base font-bold text-brand-primary mb-2 font-display">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-14 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-[0.2em] mb-2">Voice of Experience</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-brand-primary font-display">Trusted by Innovators</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "Rahul Verma",
                role: "Commuter",
                quote: "The bike conversion kit completely changed my commute. It's powerful, quiet, and feels factory-built. Best investment of 2024!",
                stars: 5
              },
              {
                name: "Ananya Singh",
                role: "Tech Enthusiast",
                quote: "Their home automation solutions are seamless. I've tried many brands, but Carbo Vision's integration and support are unmatched.",
                stars: 5
              },
              {
                name: "Karan Johar",
                role: "Business Owner",
                quote: "Professional, creative, and fast. They didn't just build a website; they built a digital experience for my customers.",
                stars: 5
              }
            ].map((t, i) => (
              <div key={i} className="bg-brand-light p-7 rounded-2xl relative border border-blue-50">
                <div className="flex gap-1 mb-4 text-brand-accent">
                  {[...Array(t.stars)].map((_, s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-brand-primary text-sm font-medium italic mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-brand-primary text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats — removed per user request */}

      {/* Final Call to Action */}
      <section className="py-14 bg-white">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-brand-primary to-blue-900 rounded-2xl p-8 md:p-14 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-brand-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
               <h2 className="text-2xl md:text-4xl font-extrabold text-white font-display mb-5 leading-tight">
                  Ready to Rebuild Your Everyday Life?
               </h2>
               <p className="text-blue-100/70 text-sm mb-7 max-w-xl mx-auto">
                  Join 500+ users who have already upgraded their world with Carbo Vision innovations.
               </p>
               <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/products" className="bg-brand-secondary text-brand-dark px-8 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-brand-secondary/20 transition-all">
                    Start Shopping
                  </Link>
                  <button onClick={() => setShowModal(true)} className="px-8 py-3 rounded-xl font-bold text-sm bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all">
                    Share Feedback
                  </button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;