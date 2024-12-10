const mongoose = require("mongoose");
const orderStatus = require("../Enums/orderStatus");

const OrderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  status: {
    type: String,
    enum: [orderStatus.pending, orderStatus.completed, orderStatus.active],
    default: "pending",
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  activationDate: { type: Date, default: null },
});

module.exports = mongoose.model("Order", OrderSchema);
