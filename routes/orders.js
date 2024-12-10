const router = require("express").Router();
const { viewProductsOrdered } = require("../controllers/order");

router.get("/productorderd", viewProductsOrdered);

module.exports = router;
