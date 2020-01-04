const express = require('express');
const router = express.Router();
const {signup } = require('../controllers/auth');
const { userSignupValidator } = require('../validators/auth');
const { runValidation } = require('../validators/index')

router.route('/signup').post(userSignupValidator, runValidation, signup);

module.exports = router;