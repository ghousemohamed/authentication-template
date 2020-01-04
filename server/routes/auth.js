const express = require('express');
const router = express.Router();
const {signup, accountActivation, signin } = require('../controllers/auth');
const { userSignupValidator, userSigninValidator } = require('../validators/auth');
const { runValidation } = require('../validators/index')

router.route('/signup').post(userSignupValidator, runValidation, signup);
router.route('/account-activation').post(accountActivation);
router.route('/signin').post(userSigninValidator, runValidation, signin)

module.exports = router;