const Product = require("../models/product");
module.exports.calculateTotalPrice = async (cart, product_id) => {
  const product = await Product.findById(product_id);
  return cart.items.reduce(
    (total, item) => total + item.quantity * product.price,
    0
  );
};
