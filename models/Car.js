const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Economy', 'Sedan', 'SUV', 'Luxury', 'Van', 'Sports'],
      default: 'Sedan',
    },
    pricePerDay: { type: Number, required: true },
    seats: { type: Number, default: 5 },
    transmission: { type: String, enum: ['Automatic', 'Manual'], default: 'Automatic' },
    fuel: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], default: 'Petrol' },
    mileage: { type: Number, default: 0 },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    available: { type: Boolean, default: true },
    features: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
