const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('../models/User');
const Car = require('../models/Car');

const cars = [
  {
    name: 'Maruti Swift Dzire',
    brand: 'Maruti Suzuki', model: 'Swift Dzire', year: 2023,
    category: 'Sedan',
    pricePerDay: 1800,
    seats: 5, transmission: 'Manual', fuel: 'Petrol', mileage: 22000,
    description: 'Hyderabad\'s most popular cab car — reliable, fuel-efficient, and easy to park in the city.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZa0WXBiu8x-AdBQ7b3DY4g95aUyCQCXRYkA&s',
    available: true,
    features: ['AC', 'Bluetooth', 'USB Charging', 'Central Locking']
  },
  {
    name: 'Maruti Ertiga',
    brand: 'Maruti Suzuki', model: 'Ertiga', year: 2022,
    category: 'Van',
    pricePerDay: 2500,
    seats: 7, transmission: 'Automatic', fuel: 'Petrol', mileage: 30000,
    description: '7-seater MPV perfect for family trips to Ramoji Film City or Charminar.',
    image: 'https://www.team-bhp.com/sites/default/files/styles/check_high_res/public/maruti-ertiga-2nd-gen.jpg',
    available: true,
    features: ['AC', 'Bluetooth', '7 Seats', 'Roof Rails']
  },
  {
    name: 'Tata Punch',
    brand: 'Tata', model: 'Punch', year: 2023,
    category: 'SUV',
    pricePerDay: 2300,
    seats: 5, transmission: 'Automatic', fuel: 'Petrol', mileage: 12000,
    description: 'India\'s safest SUV — great for Hyderabad outskirts and highway drives to Vijayawada.',
    image: 'https://www.team-bhp.com/sites/default/files/styles/check_extra_large_for_review/public/tata-punch-7.jpg',
    available: true,
    features: ['AC', 'Sunroof', 'Bluetooth', 'Reverse Camera', 'Hill Assist']
  },
  {
    name: 'Hyundai Creta',
    brand: 'Hyundai', model: 'Creta', year: 2023,
    category: 'SUV',
    pricePerDay: 2800,
    seats: 5, transmission: 'Automatic', fuel: 'Petrol', mileage: 9000,
    description: 'Most loved SUV in Hyderabad — smooth ride, great infotainment, and a premium feel.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg/330px-2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg',
    available: true,
    features: ['AC', 'Sunroof', 'Wireless Charging', 'GPS', 'Lane Assist', 'Cruise Control']
  },
  {
    name: 'Toyota Innova Crysta',
    brand: 'Toyota', model: 'Innova Crysta', year: 2022,
    category: 'Van',
    pricePerDay: 3500,
    seats: 7, transmission: 'Automatic', fuel: 'Diesel', mileage: 35000,
    description: 'The gold standard for group travel in Hyderabad — book for airport transfers or Tirupati trips.',
    image: 'https://www.jazzycars.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-09-18-at-12.43.46-PM-3.jpeg',
    available: true,
    features: ['AC', 'Bluetooth', '7 Seats', 'Captain Seats', 'USB Charging']
  },
  {
    name: 'MG Hector',
    brand: 'MG', model: 'Hector', year: 2023,
    category: 'SUV',
    pricePerDay: 3200,
    seats: 5, transmission: 'Automatic', fuel: 'Petrol', mileage: 7000,
    description: 'Feature-packed internet SUV — panoramic sunroof and 14-inch touchscreen turn heads in Banjara Hills.',
    image: 'https://cargiant.co.in/uploads/car/025051261819.jpeg',
    available: true,
    features: ['AC', 'Panoramic Sunroof', '14" Touchscreen', 'GPS', 'ADAS', 'Wi-Fi Hotspot']
  },
  {
    name: 'Tata Nexon EV Max',
    brand: 'Tata', model: 'Nexon EV Max', year: 2023,
    category: 'SUV',
    pricePerDay: 2999,
    seats: 5, transmission: 'Automatic', fuel: 'Electric', mileage: 4000,
    description: '437 km range — ideal for eco-conscious drives around HITEC City with zero fuel cost.',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/121341/nexon-ev-max-exterior-right-front-three-quarter-61.jpeg?isig=0&q=80',
    available: true,
    features: ['AC', 'Fast Charging', 'Autopark', 'Reverse Camera', 'Digital Cluster', 'Voice Control']
  },
  {
    name: 'Honda City Hybrid',
    brand: 'Honda', model: 'City Hybrid', year: 2023,
    category: 'Sedan',
    pricePerDay: 2200,
    seats: 5, transmission: 'Automatic', fuel: 'Hybrid', mileage: 14000,
    description: 'Premium hybrid sedan — smooth highway cruiser for Hyderabad to Bangalore runs.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJgnnXsUt3TywSyJ5PUOVIB90HlPFw24_n_w&s',
    available: true,
    features: ['AC', 'Bluetooth', 'Honda Sensing', 'GPS', 'Sunroof', 'Wireless Charging']
  },
  {
    name: 'Maruti Alto K10',
    brand: 'Maruti Suzuki', model: 'Alto K10', year: 2023,
    category: 'Economy',
    pricePerDay: 899,
    seats: 5, transmission: 'Manual', fuel: 'Petrol', mileage: 18000,
    description: 'Most affordable option — zip through Old City lanes and Charminar traffic with ease.',
    image: 'https://cdn-s3.autocarindia.com/legacy/cdni/ExtraImages/20220824035350__DSC7055.jpg?w=728&q=75',
    available: true,
    features: ['AC', 'Bluetooth', 'USB Charging']
  },
  {
    name: 'Mahindra Thar',
    brand: 'Mahindra', model: 'Thar', year: 2022,
    category: 'Luxury',
    pricePerDay: 4999,
    seats: 4, transmission: 'Automatic', fuel: 'Petrol', mileage: 8000,
    description: 'Iconic 4x4 off-roader — head to Ananthagiri Hills or Bhongir Fort in style from Hyderabad.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG3t0EcVLU_GUIuzEO0nVc96ZwzWIU-IBBDQ&s',
    available: true,
    features: ['AC', '4x4 Drive', 'Roll Cage', 'GPS', 'Convertible Top', 'Off-road Tyres']
  }
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany();
  await Car.deleteMany();

  const hashedPass = await bcrypt.hash('admin123', 12);
  await User.create({
    name: 'Admin User',
    email: 'admin@carrental.com',
    password: hashedPass,
    role: 'admin',
    phone: '9000000000',
    address: 'HITEC City, Hyderabad',
  });

  await User.create({
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    password: hashedPass,
    role: 'user',
    phone: '9100000001',
    address: 'Banjara Hills, Hyderabad',
  });

  await Car.insertMany(cars);

  console.log('✅ Seed data inserted!');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });