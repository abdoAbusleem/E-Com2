const mongoose = require("mongoose");
const userTypes = require("../Enums/userTypes");
const userRole = require("../Enums/userRoles");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    enum: [userTypes.BUYER, userTypes.SELLER],
    default: userTypes.BUYER,
  },
  role: {
    type: Number,
    enum: [userRole.ADMIN, userRole.MANGER, userRole.USER],
    default: userRole.USER,
  },
  street: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    required: true,
  },
  appartment: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    default: "",
  },
  verificationCode: String,
  verificationCodeExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
