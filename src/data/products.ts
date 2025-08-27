export interface Product {
  id: string;
  name: string;
  category: 'bike-conversion' | 'cycle-conversion';
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specifications: {
    [key: string]: string;
  };
  inStock: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'E-Bike',
    category: 'bike-conversion',
    price: 60000,
    originalPrice: 100000,
    image: 'https://i.postimg.cc/x8Cj3WZj/e-bike-0.jpg',
    images: [
      'https://i.postimg.cc/x8Cj3WZj/e-bike-0.jpg',
      'https://i.postimg.cc/Bbk3ctDN/e-bike-1.jpg'
    ],
    description: 'Want to get your bike converted into E-BIKE ... Try this !',

    features: [
      'Conversion from Fuel to Electric',
      'Electric Motor Drive',
      'Rechargeable Battery System',
      'Cost-Effective Operation',
      'Eco-Friendly Transportation',
    ],
    specifications: {
      'Motor': '1000W Brushless DC Hub Motor',
'Battery': '60V / 30Ah Lithium-ion (removable)',
'Range': '60–80 km per charge',
'Top Speed': 'Up to 60 km/h (varies by motor)',
'Charging Time': '4–5 hours',
'Brakes': 'Front & rear disc brakes',
'Frame': 'Original bike frame with minimal modifications'
    },
    inStock: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: '2',
    name: 'Solar Tricycle',
    category: 'cycle-conversion',
    price: 50000,
    originalPrice: 54000,
    image: 'https://i.postimg.cc/3wqkvY1B/wheelchair-tricycle-0.jpg',
    images: [
      'https://i.postimg.cc/xTgTm9Tz/wheelchair-tricycle-1.jpg',
      'https://i.postimg.cc/3wqkvY1B/wheelchair-tricycle-0.jpg'
    ],
    description: 'Want to buy a unique gift for someone .. Contact Us ',
    features: [
      'Solar Charging System',
      'Dual Power Source',
      'Hybrid Design',
      'Accessibility-Focused',
      'Eco-Friendly Mobility',
      'Durable Build for Rural Terrain',
    ],
    specifications: {
      'Power': '100–200W solar panel + 24V/36V battery',
'Motor': '250W–500W BLDC motor',
'Range': '30–50 km per charge',
'Speed': 'Up to 20 km/h',
'Charging': '5–6 hours (solar or plug-in)',
'Frame': 'Lightweight, off-road capable',
'Wheels': '3-wheel with suspension for stability'
    },
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: '3',
    name: 'Smart Curtains',
    category: 'bike-conversion',
    price: 6000,
    originalPrice: 8000,
    image: 'https://i.postimg.cc/hjHMpFD8/iot-curtains.jpg',
    images: [
      'https://i.postimg.cc/hjHMpFD8/iot-curtains.jpg'
    ],
    description: 'Want your office/home to be automated through voice ! Try these',
    features: [
       'Mobile App Control',
'Voice Assistant Integration',
'Light & Temperature Sensors',
'Automatically adjust curtains based on sunlight or room temperature',
'Energy Efficiency',
'Timer & Routine Automation',
'Accessibility Friendly',
'Easy Installation & Compatibility',
    ],
    specifications: {
      'Motor': 'Quiet DC motor (≤ 40 dB noise)',
'Control': 'Mobile app + voice (Alexa, Google, Siri)',
'Connectivity': 'Wi-Fi / Bluetooth / Zigbee',
'Power': 'AC or battery (solar optional)',
'Automation': 'Timer, schedule, sunlight-based',
'Curtain Type': 'Supports rods, rails, tracks',
'Price': 'Rs. 5000/window',
    },
    inStock: true,
    rating: 4.9,
    reviews: 156
  },
  {
    id: '4',
    name: 'Smart Display',
    category: 'cycle-conversion',
    price: 9000,
    originalPrice: 12000,
    image: 'https://i.postimg.cc/zXqT5Dcb/electric-matrix-notice-board.jpg',
    images: [
      'https://i.postimg.cc/zXqT5Dcb/electric-matrix-notice-board.jpg'
    ],
    description: 'Want To Display Your Message, Anytime, Anywhere .. Own It Now',
    features: [
      'IoT‑Enabled',
 'High Brightness',
 'Energy Efficient',
 'Dynamic Display',
 'Weather‑Resistant',
 'Real‑Time Updates',
 'Easy Installation'
    ],
    specifications: {
      'Display Type': 'LED Matrix',
      'Pixel Pitch': '3mm / 5mm / 10mm (as per model)',
      'Brightness': '≥ 5000 nits (outdoor) / ≥ 1000 nits (indoor)',
      'Supported Content': 'Text, Images, Animations, Real‑time Data Feeds',
      'Power Supply':	'110V/220V AC',
'Power Consumption':	'~50–150W (depends on size)',
'Material':	'Aluminum/Steel frame with weather‑resistant coating',
'Applications':	'Schools, Public Spaces, Offices, Transportation Hubs'
    },
    inStock: true,
    rating: 4.4,
    reviews: 73
  },
  {
    id: '5',
    name: 'Smart Barricade',
    category: 'bike-conversion',
    price: 15000,
    originalPrice: 17500,
    image: 'https://i.postimg.cc/fyCtkXr3/Smart-Barricade-0.jpg',
    images: [
      'https://i.postimg.cc/fyCtkXr3/Smart-Barricade-0.jpg'
    ],
    description: 'Wants to Secure Smarter Where Safety Meets Innovation ! Try it',
    features: [
      ' IoT-Enabled Control',
      'Vehicle Detection',
      'Solar Powered Operation',
      'Smart Alerts & Indicators',
      'Automated Movement',
      'Real-Time Data Logging',
      'Enhanced Road Safety'
    ],
    specifications: {
      'Controller': 'ESP32 / Arduino with IoT module',
'Connectivity': 'Wi-Fi / GSM for real-time control',
'Sensors': 'Ultrasonic or IR for vehicle detection',
'Power': 'Solar-powered with battery backup',
'Display': 'LED lights and warning indicators',
'Automation': 'Auto open/close based on traffic input',
'App Interface': 'Live monitoring and alerts via mobile/web',
    },
    inStock: false,
    rating: 4.7,
    reviews: 94
  },
  {
    id: '6',
    name: 'E-Cycle',
    category: 'cycle-conversion',
    price: 21000,
    originalPrice: 23000,
    image: 'https://i.postimg.cc/9MpFB2tK/e-cycle-0.jpg',
    images: [
      'https://i.postimg.cc/9MpFB2tK/e-cycle-0.jpg',
      'https://i.postimg.cc/jq1rYC5v/e-cycle-1.jpg'
    ],
    description: 'Want To Ride Eco-friendly .. Give it a go',
    features: [
       'Lightweight Electric Motor',
 'Long-Lasting Battery',
 'Lightweight Frame Design',
 'Smart Pedal Assist System (PAS)',
 'Digital Display Console',
 'Anti-Theft & Locking System',
 'Urban-Ready Features',
 'Safety & Braking System',
 'Eco-Friendly Transportation',
 'Easy Maintenance'
    ],
    specifications: {
      'Motor': '250W brushless hub motor',
'Battery': '36V, 10.4Ah lithium-ion (removable)',
'Range': 'Up to 60 km per charge (pedal assist mode)',
'Top Speed': '25 km/h (as per Indian regulations)',
'Frame': 'Lightweight aluminum alloy',
'Brakes': 'Dual disc brakes (front & rear)',
'Charging Time': '4–6 hours'
    },
    inStock: true,
    rating: 4.5,
    reviews: 45
  },
  {
    id: '7',
    name: 'Electric Kick Scooter',
    category: 'cycle-conversion',
    price: 30000,
    originalPrice: 32000,
    image: 'https://i.postimg.cc/J7dwqvZt/electric-scooter-0.jpg',
    images: [
      'https://i.postimg.cc/J7dwqvZt/electric-scooter-0.jpg'
    ],
    description: 'Why Walk When You Can Fly on Wheels? .. Go For It',
    features: [
      'Compact & Lightweight Design',
      'Rechargeable Battery',
      'Smooth Electric Ride',
      'Digital Dashboard',
      'Safety Features',
      'Ideal for Urban Use',
      'Eco-Friendly Mobility'
    ],
    specifications: {
      'Motor': '250W–350W hub motor',
'Battery': '36V / 7.5–10Ah lithium-ion battery',
'Range': '20–40 km per charge',
'Top Speed': 'Up to 25 km/h (urban legal limit)',
'Charging Time': '3–5 hours',
'Frame': 'Foldable aluminum alloy, lightweight (~12–15 kg)',
'Brakes': 'Electronic + rear disc or foot brake'
    },
    inStock: true,
    rating: 4.5,
    reviews: 45
  },
  {
    id: '8',
    name: 'Smart Wheel Chair',
    category: 'cycle-conversion',
    price: 40000,
    originalPrice: 44000,
    image: 'https://i.postimg.cc/0yRBXsQ5/electric-wheel-chair.jpg',
    images: [
      'https://i.postimg.cc/0yRBXsQ5/electric-wheel-chair.jpg'
    ],
    description: 'Ready to Roll Your Way with Smart Wheel Chair.. Give it a shot! ',
    features: [
      'IoT Integration',
'Health Monitoring System',
'GPS Tracking & Geo-fencing',
'Fall & Tilt Detection',
'Mobile App Control',
'Dual Control Modes',
'Long Battery Life',
'Smart Alerts & Notifications',
    ],
    specifications: {
      'Controller':	'ESP32 / Arduino / Raspberry Pi with IoT capabilities',
'Connectivity': 'Wi-Fi, Bluetooth, GSM (optional for SMS alerts), GPS',
'Mobility':	'Motorized wheels, joystick/app-based control', 
'speed': 'up to 6–8 km/h',
'Battery':	'24V or 36V lithium-ion battery, 6–8 hours backup',
'Navigation ':	'Real-time GPS tracking, route tracking via mobile app',
'Mobile App':	'Health data dashboard, alerts, battery status, live location'

    },
    inStock: true,
    rating: 4.5,
    reviews: 45
  },
  {
    id: '9',
    name: 'Office/Home Automation',
    category: 'cycle-conversion',
    price: 15000,
    originalPrice: 17000,
    image: 'https://i.postimg.cc/8cv4QZPQ/Screenshot-2025-08-05-184526.png',
    images: [
      'https://i.postimg.cc/8cv4QZPQ/Screenshot-2025-08-05-184526.png',
      'https://i.postimg.cc/FHpZ4dmR/Screenshot-2025-08-05-184659.png'
    ],
    description: 'Want to Convert Your Home Into Smart Home/Office.. Say YES to it',
    features: [
      'Centralized Smart Control',
      'Automation & Scheduling',
      'Smart Sensors',
      'Enhanced Security',
      'Energy Efficiency',
      'Intelligent Climate Control',
'Real-Time Alerts & Monitoring'
    ],
    specifications: {
      'Connectivity': 'Wi-Fi / Zigbee / Bluetooth',
'Control': 'Central dashboard via app/web',
'Smart Devices': 'Lights, ACs, fans, blinds, projectors',
'Sensors': 'Motion, temperature, light, occupancy',
'Automation': 'Schedule & sensor-based rules',
'Security': 'Smart locks, CCTV, access alerts',
'Energy Monitoring': 'Real-time power usage tracking'
    },
    inStock: true,
    rating: 4.5,
    reviews: 45
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};