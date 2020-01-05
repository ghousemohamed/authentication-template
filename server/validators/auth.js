const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name", "Name is required")
    .not()
    .isEmpty(),
  check("email", "Must be a valid email address").isEmail(),
  check("password", "Password must be at least 6 characters long").isLength({
    min: 6
  })
];

exports.userSigninValidator = [
  check("email", "Must be a valid email address").isEmail(),
  check("password", "Password must be at least 6 characters long").isLength({
    min: 6
  })
];

exports.forgotPasswordValidator = [
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Must be a valid email address")
];

exports.resetPasswordValidator = [
  check("newPassword")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least  6 characters long")
];
