const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Alias = require('../models/Alias')
const ForgotPasswordOTP = require('../models/forgotPasswordOTP')
const { forgotPasswordOTPEmail } = require('../utils/index')
const { StatusCodes, OK } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')

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
    // console.log(user)
    const JWT = user.createJWT();
    res.status(StatusCodes.OK).json({ JWT: JWT, id: user._id }) // id name
}

let login = async (req, res) => { // email password
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('please provide email and password')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new NotFoundError('no user with this email')
    }

    const isCorrectPassword = await user.comparePassword(password)

    if (!isCorrectPassword) {
        throw new NotFoundError('no user with this email and password')
    }

    const JWT = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name, id: user._id }, JWT })
}

let createAlias = async (req, res) => {
    const id = req.user._id
    let { aliasID, alias } = req.body
    if (!aliasID || !alias) {
        throw new BadRequestError('please provide full infomation')
    }
    let user = await User.findById(aliasID)
    if (!user) {
        throw new BadRequestError("please send correct id")
    }
    let a = await Alias.findOne({ user: id, user2: aliasID })
    // console.log(alias)
    if (a != null) {
        await Alias.findByIdAndUpdate(a._id, { alias })
        let aliasList = await Alias.find({ user: id })
        res.status(StatusCodes.OK).json({ msg: "alias updated", data: aliasList })
    }
    else {
        await Alias.create({ user: id, user2: aliasID, alias: alias })
        let aliasList = await Alias.find({ user: id })
        res.status(StatusCodes.OK).json({ msg: "alias created", data: aliasList })
    }


}

let getAliases = async (req, res) => {
    let id = req.user._id
    let aliasList = await Alias.find({ user: id })
    let length = aliasList.length
    res.status(StatusCodes.OK).json({ len: length, data: aliasList })
}

let forgotPasswordOTP = async (req, res) => {
    let {email} = req.body
    let user = await User.findOne({email})
    if(!user){
        throw new BadRequestError("this email is not registered with us")
    }
    let OTP = Math.floor((Math.random() * 999999) + 1) // not cryptographically secure
    let emailOTP = await ForgotPasswordOTP.findOne({ "email": email }) // 
    if(emailOTP) await ForgotPasswordOTP.deleteOne({"email": emailOTP.email})
    try{
        await forgotPasswordOTPEmail(user, OTP)
        ForgotPasswordOTP.create({"email": email, "OTP": OTP, createdAt: Date.now()}) // should i use await here
    }
    catch(e){
        console.log(e)
        throw new BadRequestError("this email does not exist")
    }
    res.status(StatusCodes.OK).json({"msg":"please check your email"})
}

let forgotPassword = async (req, res) => {
    let {email, password, OTP} = req.body
    let user = await User.findOne({email})
    if(!user){
        throw new BadRequestError("this email is not registered with us")
    }
    let emailOTP = await ForgotPasswordOTP.findOne({"email": email})
    if(!emailOTP){
        throw new BadRequestError("please try again")
    }
    if(emailOTP.OTP != OTP){
        await ForgotPasswordOTP.deleteOne({email})
        throw new BadRequestError("incorrect OTP please try again")
    }
    if(emailOTP.createdAt + 300000 < Date.now()){
        await ForgotPasswordOTP.deleteOne({ email })
        throw new BadRequestError("OTP expired")
    }
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt)
    await User.updateOne(user, {password})
    await ForgotPasswordOTP.deleteOne({email})
    res.status(StatusCodes.OK).json("password changed successfully")
}
module.exports = {
    createAccount,
    login,
    createAlias,
    getAliases,
    forgotPasswordOTP,
    forgotPassword
}