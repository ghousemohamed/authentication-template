const {check} = require('express-validator');

exports.userSignupValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Must be a valid email address').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({min: 6})
]