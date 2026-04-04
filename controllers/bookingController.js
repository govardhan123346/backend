const Booking = require('../models/Booking');
const Car = require('../models/Car');

// @POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, pickupLocation, notes } = req.body;
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (!car.available) return res.status(400).json({ message: 'Car is not available' });

    const pickup = new Date(pickupDate);
    const ret = new Date(returnDate);
    const totalDays = Math.ceil((ret - pickup) / (1000 * 60 * 60 * 24));
    if (totalDays < 1) return res.status(400).json({ message: 'Invalid dates' });

    const totalPrice = totalDays * car.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      car: carId,
      pickupDate: pickup,
      returnDate: ret,
      pickupLocation,
      totalDays,
      totalPrice,
      notes,
    });

    await Car.findByIdAndUpdate(carId, { available: false });

    const populated = await booking.populate('car');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car').populate('user', '-password');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/bookings/:id/pay
const payBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    booking.paymentStatus = 'paid';
    booking.paymentMethod = req.body.paymentMethod || 'card';
    booking.status = 'confirmed';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    booking.status = 'cancelled';
    await booking.save();
    await Car.findByIdAndUpdate(booking.car, { available: true });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/bookings  (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('car')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/bookings/:id/status  (admin)
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('car').populate('user', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking, getMyBookings, getBookingById,
  payBooking, cancelBooking, getAllBookings, updateBookingStatus
};
