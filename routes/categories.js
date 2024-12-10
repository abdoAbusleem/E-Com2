const router = require("express").Router();
const userRole = require("../Enums/userRoles");
const allowedTo = require("../middlewares/allowedTo");
const upload = require("../middlewares/uploadFile");

const {
  categoryList,
  createCategory,
  deleteCategory,
  getSingleCategory,
  updateCategory,
} = require("../controllers/categories");

router.get("/categories", categoryList);

router.get("/singlecategory/:id", getSingleCategory);

router.post(
  "/create",
  allowedTo(userRole.ADMIN),
  upload.single("image"),
  createCategory
);

router.delete("/delete/:id", allowedTo(userRole.ADMIN), deleteCategory);

router.patch("/update/:id", allowedTo(userRole.ADMIN), updateCategory);

module.exports = router;
