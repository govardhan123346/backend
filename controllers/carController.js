const Car = require('../models/Car');

// @GET /api/cars
const getCars = async (req, res) => {
  try {
    const { category, available, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (available !== undefined) query.available = available === 'true';
    if (search) query.name = { $regex: search, $options: 'i' };
    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/cars/:id
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/cars  (admin)
const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/cars/:id  (admin)
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/cars/:id  (admin)
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar };
