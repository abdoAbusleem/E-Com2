const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
});

module.exports = mongoose.model("Rating", ratingSchema);
