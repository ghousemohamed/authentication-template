const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.email });
    if (user) {
      return res.status(400).json({
        msg: "The user with this email address already exists"
      });
    }
    let newUser = new User({name, email, password});

    newUser.save((err, success) => {
        if(err) {
            console.log('SignUp Error', err)
            return res.status(400).json({
                msg: 'There was a problem signing you up'
            })
        }
    });

    return res.status(200).json({
        msg: 'The user was successfully created',
        data: newUser
    })
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      msg: "Internal Server Error"
    });
  }
};
