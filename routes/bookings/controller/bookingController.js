const Booking = require('../model/Booking');
const User = require('../../users/model/User');
const errorHandler = require("../../../utils/errorHandler/errorHandler");

async function createNewBooking(req, res) {
  try {
    const { name, city, startDate, endDate, price, picture, guests, listingID } = req.body;
    let errObj = {};
    if (!name) {
      errObj.name = "Listing name missing";
    };

    if (!city) {
      errObj.city = "Listing city missing";
    };

    if (!startDate) {
      errObj.startDate = "Listing startDate missing";
    };

    if (!endDate) {
      errObj.endDate = "Listing endDate missing";
    };

    if (!price) {
      errObj.price = "Listing price missing";
    };

    if (!picture) {
      errObj.picture = "Listing price missing";
    };

    if (!guests) {
      errObj.guests = "Guests missing";
    };

    if (!listingID) {
      errObj.listingID = "Listing ID missing";
    };

    console.log(errObj)
    if (Object.keys(errObj).length > 0) {
      return res.status(500).json({
        message: "error",
        error: errObj,

      });
    }

    // remember that jw middleware was ran before in router and thats how we got the decoded data
    const decodedData = res.locals.decodedData;
    const foundUser = await User.findOne({ email: decodedData.email })
    const newBooking = new Booking({
      userID: foundUser._id,
      name,
      city,
      startDate,
      endDate,
      price,
      picture,
      guests,
      listingID
    });
    const savedBooking = await newBooking.save();
    foundUser.bookedTrips.push(savedBooking._id);

    await foundUser.save();

    res.json({ message: "success", newBooking });

  } catch (e) {
    res
      .status(500)
      .json(errorHandler(e));
  }
};

async function getAllBookingsForSpecificListing(req, res) {
  try {
    const { listingID } = req.params;
    const allBookings = await Booking.find({ listingID: listingID })
    res.json({ message: "success", allBookings });

  } catch (e) {
    res
      .status(500)
      .json(errorHandler(e));
  }
}

async function getAllUserBookings(req, res) {
  try {
    const decodedData = res.locals.decodedData;
    const foundUser = await User.findOne({ email: decodedData.email }).populate("bookedTrips")
    res.json({ message: "success", payload: foundUser.bookedTrips });
  } catch (e) {
    res
      .status(500)
      .json(errorHandler(e));
  }
}

async function updateBookingById(req, res) {
  try {
    const foundBooking = await Booking.findById(req.params.id);
    if (!foundBooking) {
      res
        .status(404)
        .json({ message: "failure", error: "Booking not found" });
    } else {
      const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      )
      res.json({ message: "success", payload: updatedBooking });
    }
  } catch (e) {
    res.status(500).json(errorHandler(e));
  }
}

async function deleteBookingById(req, res) {
  try {
    const deletedBooking = await Booking.findByIdAndRemove(req.params.id);

    if (!deletedBooking) {
      return res
        .status(404)
        .json({ message: "failure", error: "Booking not found" });
    } else {
      const decodedData = res.locals.decodedData;
      console.log(decodedData)
      const foundUser = await User.findOne({ email: decodedData.email });
      const userBookingHistoryArray = foundUser.bookedTrips;
      const filteredBookingHistoryArray = userBookingHistoryArray.filter(
        (item) => item._id.toString() !== req.params.id
      );

      foundUser.bookedTrips = filteredBookingHistoryArray;
      await foundUser.save();

      console.log(139)
      res.json({
        message: "success",
        deleted: deletedBooking,
      });
    }
  } catch (e) {
    res.status(500).json(errorHandler(e));
  }
}

module.exports = {
  createNewBooking,
  getAllBookingsForSpecificListing,
  getAllUserBookings,
  updateBookingById,
  deleteBookingById
}