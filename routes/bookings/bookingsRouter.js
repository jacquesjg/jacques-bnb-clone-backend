const express = require('express');
const router = express.Router();
const {
  jwtMiddleware
} = require('../users/lib/authMiddleware');
const {
  createNewBooking,
  getAllBookingsForSpecificListing,
  getAllUserBookings,
  updateBookingById,
  deleteBookingById
} = require('./controller/bookingController');

router.post(
  "/create-booking",
  jwtMiddleware,
  createNewBooking,
);

router.get(
  "/get-bookings-for-listing/:listingID",
  getAllBookingsForSpecificListing
)

router.get(
  "/get-user-bookings/",
  jwtMiddleware,
  getAllUserBookings,
)

router.post(
  "/find-booking-by-id-and-update/:id",
  updateBookingById
)

router.delete(
  "/find-booking-by-id-and-delete/:id",
  jwtMiddleware,
  deleteBookingById
)


module.exports = router;