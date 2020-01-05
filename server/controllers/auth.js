const User = require("../models/user");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const _ = require('lodash');
//Bring in sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(email)
  try {
    const user = await User.findOne({ email });
    if (user){
        return res.status(400).json({
            error: 'User with this email address already exists'
        })
    }

    const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {
        expiresIn: '10m'
    })

    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `
            <h1>Please use the following link to activate your account</h1>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr />
            <p>This email may contain sensitve information</p>
            <p>${process.env.CLIENT_URL}</p>
        `
    }

    const sent = await sgMail.send(emailData);
    res.status(200).json({
        msg: 'The email was successfully sent. Check you inbox for the activation link',
        data: sent
    })
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({
      msg: "Internal Server Error"
    });
  }
};

exports.accountActivation = (req, res, next) => {
    const {token} = req.body;

    if(token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if(err) {
                return res.status(400).json({
                    msg: 'expired Link. Signup again'
                })
            }
            const {name, email, password} = jwt.decode(token);
            console.log(decoded);
            const user = new User({name, email, password});
            user.save((err, user) => {
                if(err) {
                    return res.status(401).json({
                        msg: 'Error saving user in the database. Try signing up again'
                    })
                }
                return res.status(200).json({
                    msg: 'User Registered Successfully',
                    user: {name: name, email: email}
                })
            })
        })
    } else {
        return res.json({
            msg: 'Something went wrong. Try Again'
        })
    }
}

exports.signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({
                error: 'User with that email address does not exist. Please sign up'
            })
        }
        const isAuth = user.authenticate(password);
        if(!isAuth){
            return res.status(400).json({
                msg: 'Either the password or the email address is invalid. Please try again'
            })
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })
        const {_id, role, name} = user;
        return res.status(200).json({
            msg: 'Login was done successfully',
            token,
            user: {_id, role, name, email}
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg: 'Internal Server Error. Please try again'
        })
    }
    
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET
})

exports.adminMiddleware = async (req, res, next) => {
    const user = await User.findById({_id: req.user._id});
    if (!user) {
        return res.status(404).json({
            msg: 'User not found'
        })
    }
    if(user.role !== 'admin') {
        return res.status(400).json({
            msg: 'Admin resource access denied'
        })
    }
    req.profile = user;
    next();
}

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist'
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password Reset link`,
            html: `
                <h1>Please use the following link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                console.log('RESET PASSWORD LINK ERROR', err);
                return res.status(400).json({
                    error: 'Database connection error on user password forgot request'
                });
            } else {
                sgMail
                    .send(emailData)
                    .then(sent => {
                        // console.log('SIGNUP EMAIL SENT', sent)
                        return res.json({
                            message: `Email has been sent to ${email}. Follow the instruction to reset your password`
                        });
                    })
                    .catch(err => {
                        // console.log('SIGNUP EMAIL SENT ERROR', err)
                        return res.json({
                            message: err.message
                        });
                    });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if (err) {
                return res.status(400).json({
                    error: 'Expired link. Try again'
                });
            }

            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'Something went wrong. Try later'
                    });
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Error resetting user password'
                        });
                    }
                    res.json({
                        message: `Great! Now you can login with your new password`
                    });
                });
            });
        });
    }
};
