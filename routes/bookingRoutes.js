const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, getBookingById,
  payBooking, cancelBooking, getAllBookings, updateBookingStatus
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/pay', protect, payBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;