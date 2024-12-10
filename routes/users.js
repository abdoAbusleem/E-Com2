const router = require("express").Router();
const userRole = require("../Enums/userRoles");
const allowedTo = require("../middlewares/allowedTo");
const {
  getAllUsers,
  getSingleUser,
  register,
  login,
  updateUser,
  forgetPassword,
  resetPassword,
  logOut,
} = require("../controllers/users");
const verfiyToken = require("../middlewares/verfiyToken");
const passport = require("passport");

router.get("/", verfiyToken, allowedTo(userRole.ADMIN), getAllUsers);

router.get(
  "/detail/:id",
  verfiyToken,
  allowedTo(userRole.ADMIN),
  getSingleUser
);

router.post("/register", verfiyToken, allowedTo(userRole.ADMIN), register);
router.post("/login", login);
router.patch("/update/:id", allowedTo(userRole.ADMIN), updateUser);
router.post("/forgetpassword", forgetPassword);
router.post("/resetpassword", resetPassword);
router.post("/logout", logOut);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/cb", passport.authenticate("google"), (req, res) => {
  res.send("login");
});

module.exports = router;
