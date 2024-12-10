const router = require("express").Router();
const upload = require("../middlewares/uploadFile");

const {
  createProduct,
  productList,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  productCount,
  updateProductCategory,
} = require("../controllers/products");

router.post(
  "/create",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]),

  createProduct
);

router.get("/products", productList);

router.get("/singleProduct/:id", getSingleProduct);

router.patch("/update/:id", updateProduct);

router.patch("/updatecategory/:id", updateProductCategory);

router.delete("/delete/:id", deleteProduct);

router.get("/counts", productCount);

module.exports = router;
