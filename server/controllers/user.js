const User = require("../models/user");
//Read user data

exports.read = async (req, res, next) => {
    const user = await User.findOne({_id: req.params.id}).select('-hashed_password -salt');
    if(!user) {
        return res.status(404).json({
            msg: 'User with this id was not found in the database'
        })
    }
    res.status(200).json({
        success: true,
        data: user
    })
}

exports.update = async (req, res, next) => {
    try {
        console.log(req.user)
        await User.findByIdAndUpdate({_id: req.user._id}, req.body);
        const updatedUser = await User.findById(req.user._id);
        return res.status(200).json({
            success: true,
            data: updatedUser
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            msg: 'Internal Server Error'
        })
    }
    

}