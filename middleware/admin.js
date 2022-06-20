const User = require('../models/User')
const { BadRequestError } = require('../errors')
const { UnauthenticatedError } = require('../errors')


const admin = async (req, res, next) => {
    var id = req.user._id
    //console.log(req.user)

    if (!id) throw BadRequestError("please send id")
    const user = await User.findById(id)
    if (user.role != "admin") throw UnauthenticatedError("you are not a admin")
    next()
}


module.exports = admin