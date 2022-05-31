const User = require('../models/User')
const Transaction = require('../models/transactions')
const { StatusCodes, OK } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

var transfer = async (req, res) => {
    const from = req.user.userId
    var { to, amount } = req.body
    amount = Math.abs(amount)

    const user1 = await User.findById(from)
    const user2 = await User.findById(to)

    if (!user1 || !user2) {
        throw new BadRequestError("credencials incorrect")
    }

    if (user1.balance < amount) {
        throw new BadRequestError("not enough funds")
    }
    const newBal1 = user1.balance - amount
    const newBal2 = user2.balance + amount

    await User.findByIdAndUpdate(from, { balance: newBal1 })
    await User.findByIdAndUpdate(to, { balance: newBal2 })

    await Transaction.create({ from: user1, to: user2, amount: amount });

    res.status(StatusCodes.OK).json({ bal: newBal1 })
}

const deposit = async (req, res) => {
    const id = req.user.userId
    var { amount } = req.body
    amount = Math.abs(amount)

    const user = await User.findById(id)
    if (!user) {
        throw new BadRequestError("please send correct id")
    }
    const newBal = user.balance + amount
    await User.findByIdAndUpdate(id, { balance: newBal })

    await Transaction.create({ from: id, to: id, amount: amount });

    res.status(StatusCodes.OK).json({ bal: user.balance })
}

const withdraw = async (req, res) => {
    const id = req.user.userId
    var { amount } = req.body
    amount = Math.abs(amount)

    const user = await User.findById(id)
    if (!user) {
        throw new BadRequestError("please send correct id")
    }
    if (user.balance < amount) {
        throw new BadRequestError("not enough funds")
    }
    const newBal = user.balance - amount
    await User.findByIdAndUpdate(id, { balance: newBal })

    await Transaction.create({ from: id, to: id, amount: -amount });

    res.status(StatusCodes.OK).json({ bal: user.balance })

}

const TransactionHistory = async (req, res) => {
    const id = req.user.userId
    var limit = req.body.limit
    if(!limit) limit = 10
    const user = await User.findById(id)
    if (!user) {
        throw new BadRequestError("please send correct id")
    }
    const his = await Transaction.find({
        $or:
            [
                { from: id },
                { to: id }
            ]
    }).select('to from amount createdAt').sort({ "createdAt": -1}).limit(limit)
    res.status(StatusCodes.OK).json({len: his.length, his})

}
module.exports = { transfer, deposit, withdraw, TransactionHistory}