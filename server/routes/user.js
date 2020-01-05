const express = require('express');
const router = express.Router();
const {requireSignin} = require('../controllers/auth');
const {read, update } = require('../controllers/user');

router.route('/user/:id').get(requireSignin, read);
router.route('/user/update').put(requireSignin, update);

module.exports = router;