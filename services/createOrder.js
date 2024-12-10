const Order = require("../models/order");
const orderStatus = require("../Enums/orderStatus");

module.exports.createOrder = async (user, cart) => {
  let order = await Order.findOne({
    user,
    status: orderStatus.pending,
  });

  if (!order) {
    const { items, totalPrice } = cart;
    order = new Order({
      user,
      items,
      totalPrice,
    });
    await order.save();
  } else {
    order.items = cart.items;
    order.totalPrice = cart.totalPrice;
    await order.save();
  }

  if (order.status === orderStatus.active && cart) {
    const { items, totalPrice } = cart;
    order = new Order({
      user,
      items,
      totalPrice,
    });
    await order.save();
  }
};
