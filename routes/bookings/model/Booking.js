const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
    },
    city: {
      type: String,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    price: {
      type: String,
    },
    picture: {
      type: String,
    },
    guests: {
      type: Number,
    },
    listingID: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("booking", bookingSchema);