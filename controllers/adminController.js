const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Message = require('../models/Message');

// @GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCars = await Car.countDocuments();
    const availableCars = await Car.countDocuments({ available: true });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const unreadMessages = await Message.countDocuments({ isRead: false });

    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      totalUsers, totalCars, availableCars, totalBookings,
      pendingBookings, unreadMessages, totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats, getUsers, deleteUser };
