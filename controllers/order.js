const Order = require("../models/order");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../Enums/httpStatusText");
const appError = require("../utils/appError");
const message = require("../Enums/errorMessage");
const mongoose = require("mongoose");

const viewProductsOrdered = asyncWrapper(async (req, res, next) => {
  const sellerId = req.currentUser.id;

  const productdOrdered = await Order.aggregate([
    { $match: { status: "active" } }, // Match only active orders
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $match: {
        "productDetails.merchant": new mongoose.Types.ObjectId(sellerId),
      },
    },
  ]);

  if (!productdOrdered || productdOrdered.length === 0) {
    const error = appError.create(
      message.productNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).send({
    status: httpStatusText.SUCCESS,
    productdOrdered,
  });
});

module.exports = {
  viewProductsOrdered,
};
