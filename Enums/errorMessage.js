const message = {
  noUsersYet: "no users yet",
  userNotFound: "user is not found",
  userAlreadyExists: "user already exists",
  notAseller: "you are not a seller",
  someThingWrong: "something wrong",
  categoryNotFound: "category is not found",
  categoryAlreadyExists: "category already exists",
  productNotFound: "product is not found",
  productAlreadyExists: "product already exists",
  brandNotFound: "brand is not found",
  brandAlreadyExists: "brand already exists",
  noProductYet: "no product yet",
  noProductpendingYet: "no product pending yet",
  resetPasswordError: "'Verification code is invalid or has expired'",
};

const getPasswordResetEmail = (verificationCode) => {
  return `
    You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Your verification code is: ${verificationCode}\n\n
    Please use this code to reset your password within one hour of receiving it.\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n
  `;
};

module.exports = { message, getPasswordResetEmail };
