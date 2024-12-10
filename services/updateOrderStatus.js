const schedule = require("node-schedule");
const Order = require("../models/order");
const getDaysDifference = require("../utils/dateDifference");
const { date } = require("joi");

module.exports = function updateOrderStatus() {
  schedule.scheduleJob("*/10 * * * * *", async () => {
    const orders = await Order.find({ status: "active" });
    orders.forEach(async (element) => {
      const days = getDaysDifference(element.activationDate);
      if (days >= 1) {
        element.status = "completed";
        await element.save();
      }
    });
  });
};
