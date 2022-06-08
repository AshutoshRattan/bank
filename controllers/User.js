const User = require('../models/User')
const { StatusCodes, OK } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

let createAccount = async (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        throw new BadRequestError('please provide email, password, name')
    }

    const exist = await User.findOne({ email: email })
    if (exist) throw new BadRequestError("account already exists")

    let role = 'user'
    if (await User.countDocuments({}) === 0) role = 'admin'
    const user = await User.create({ name, email, password, role }) // name email password
    const JWT = user.createJWT();
    res.status(StatusCodes.OK).json({ token: JWT, id: user._id }) // id name
}

let login = async (req, res) => { // email password
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('please provide email and password')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('no user with this email')
    }

    const isCorrectPassword = await user.comparePassword(password)

    if (!isCorrectPassword) {
        throw new UnauthenticatedError('no user with this email and password')
    }

    const JWT = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name, id: user._id }, JWT })
}

module.exports = {
    createAccount,
    login
}