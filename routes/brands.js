const router = require("express").Router();
const userRole = require("../Enums/userRoles");
const allowedTo = require("../middlewares/allowedTo");
const upload = require("../middlewares/uploadFile");

const {
  brandList,
  getSingleBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brands");

router.get("/brands", brandList);

router.get("/detail/:id", getSingleBrand);

router.post("/create", upload.single("image"), createBrand);

router.patch("/update/:id", updateBrand);

router.delete("/delete/:id", deleteBrand);

module.exports = router;
