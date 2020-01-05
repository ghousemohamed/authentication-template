const express = require('express');
const router = express.Router();
const {signup, accountActivation, signin, forgotPassword, resetPassword } = require('../controllers/auth');
const { userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth');
const { runValidation } = require('../validators/index')

router.route('/signup').post(userSignupValidator, runValidation, signup);
router.route('/account-activation').post(accountActivation);
router.route('/signin').post(userSigninValidator, runValidation, signin);

// Forgot reset password
router.route('/forgot-password').put(forgotPasswordValidator, runValidation, forgotPassword);
router.route('/reset-password').put(resetPasswordValidator, runValidation, resetPassword);

module.exports = router;