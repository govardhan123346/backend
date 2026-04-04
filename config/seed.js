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
    image: 'https://www.longdrivecars.com/_next/image?url=https%3A%2F%2Fldcars.blr1.cdn.digitaloceanspaces.com%2Fldcars%2Fimages%2Fduplicate%2F87374275a0dd4506b835cdd2e5c46da5.jpeg&w=640&q=75',
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
    image: 'https://chatgpt.com/backend-api/estuary/content?id=file_00000000486071faa0ae537231392e0e&ts=493108&p=fs&cid=1&sig=d0ebd7d7ae66c7dbdc35034e26c201f88505501b6bcdc5c5b39c436f83cbfd62&v=0',
    available: true,
    features: ['AC', 'Bluetooth', '7 Seats', 'Roof Rails']
  },
  {
    name: 'Tata Nexon',
    brand: 'Tata', model: 'Nexon', year: 2023,
    category: 'SUV',
    pricePerDay: 2300,
    seats: 5, transmission: 'Automatic', fuel: 'Petrol', mileage: 12000,
    description: 'India\'s safest SUV — great for Hyderabad outskirts and highway drives to Vijayawada.',
    image: 'https://www.longdrivecars.com/_next/image?url=https%3A%2F%2Fldcars.blr1.cdn.digitaloceanspaces.com%2Fldcars%2Fimages%2Fduplicate%2F8362ce14dade42e28bc7feb8d7cf6951.jpeg&w=640&q=75',
    available: true,
    features: ['AC', 'Sunroof', 'Bluetooth', 'Reverse Camera', 'Hill Assist']
  },
  {
    name: 'Hyundai Creta',
    brand: 'Hyundai', model: 'Creta', year: 2023,
    category: 'SUV',
    pricePerDay: 2299,
    seats: 5, transmission: 'Automatic', fuel: 'Petrol', mileage: 9000,
    description: 'Most loved SUV in Hyderabad — smooth ride, great infotainment, and a premium feel.',
    image: 'https://images.unsplash.com/photo-1614026480209-cd9934144671?w=800&q=80',
    available: true,
    features: ['AC', 'Sunroof', 'Wireless Charging', 'GPS', 'Lane Assist', 'Cruise Control']
  },
  {
    name: 'Toyota Innova Crysta',
    brand: 'Toyota', model: 'Innova Crysta', year: 2022,
    category: 'Van',
    pricePerDay: 2999,
    seats: 7, transmission: 'Automatic', fuel: 'Diesel', mileage: 35000,
    description: 'The gold standard for group travel in Hyderabad — book for airport transfers or Tirupati trips.',
    image: 'https://images.unsplash.com/photo-1623869675781-80aa31012963?w=800&q=80',
    available: true,
    features: ['AC', 'Bluetooth', '7 Seats', 'Captain Seats', 'USB Charging']
  },
  {
    name: 'MG Hector',
    brand: 'MG', model: 'Hector', year: 2023,
    category: 'SUV',
    pricePerDay: 2799,
    seats: 5, transmission: 'Automatic', fuel: 'Petrol', mileage: 7000,
    description: 'Feature-packed internet SUV — panoramic sunroof and 14-inch touchscreen turn heads in Banjara Hills.',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80',
    available: true,
    features: ['AC', 'Panoramic Sunroof', '14" Touchscreen', 'GPS', 'ADAS', 'Wi-Fi Hotspot']
  },
  {
    name: 'Tata Nexon EV',
    brand: 'Tata', model: 'Nexon EV Max', year: 2023,
    category: 'SUV',
    pricePerDay: 2499,
    seats: 5, transmission: 'Automatic', fuel: 'Electric', mileage: 4000,
    description: '437 km range — ideal for eco-conscious drives around HITEC City with zero fuel cost.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    available: true,
    features: ['AC', 'Fast Charging', 'Autopark', 'Reverse Camera', 'Digital Cluster', 'Voice Control']
  },
  {
    name: 'Honda City Hybrid',
    brand: 'Honda', model: 'City Hybrid', year: 2023,
    category: 'Sedan',
    pricePerDay: 1899,
    seats: 5, transmission: 'Automatic', fuel: 'Hybrid', mileage: 14000,
    description: 'Premium hybrid sedan — smooth highway cruiser for Hyderabad to Bangalore runs.',
    image: 'https://chatgpt.com/s/m_69cf44b1cc4c819185677e47e8b32202',
    available: true,
    features: ['AC', 'Bluetooth', 'Honda Sensing', 'GPS', 'Sunroof', 'Wireless Charging']
  },
  {
    name: 'Maruti Alto K10',
    brand: 'Maruti Suzuki', model: 'Alto K10', year: 2023,
    category: 'Economy',
    pricePerDay: 799,
    seats: 5, transmission: 'Manual', fuel: 'Petrol', mileage: 18000,
    description: 'Most affordable option — zip through Old City lanes and Charminar traffic with ease.',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
    available: true,
    features: ['AC', 'Bluetooth', 'USB Charging']
  },
  {
    name: 'BMW 5 Series',
    brand: 'BMW', model: '530i', year: 2022,
    category: 'Luxury',
    pricePerDay: 9999,
    seats: 5, transmission: 'Automatic', fuel: 'Petrol', mileage: 8000,
    description: 'Luxury executive sedan — make an impression at Jubilee Hills or Hyderabad International Airport.',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54c?w=800&q=80',
    available: true,
    features: ['AC', 'Leather Seats', 'Heated Seats', 'GPS', 'Sunroof', 'Ambient Lighting', 'Harman Kardon Audio']
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
    phone: '555-0100',
    address: '123 Admin Street',
  });

  await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: hashedPass,
    role: 'user',
    phone: '555-0101',
    address: '456 Main St',
  });

  await Car.insertMany(cars);

  console.log('✅ Seed data inserted!');
  console.log('Admin: admin@carrental.com / admin123');
  console.log('User:  john@example.com / admin123');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
