const User = require('../models/User')
const Transaction = require('../models/transactions')
const  {transactionEmail, depositEmail, withdrawEmail} = require('../utils/index') 
const { StatusCodes, OK } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

var transfer = async (req, res) => {
    const from = req.user._id
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

    const transaction = await Transaction.create({ from: user1, to: user2, amount: amount });
    //await 
    transactionEmail(transaction, {user1, user2})

    res.status(StatusCodes.OK).json({ bal: newBal1 })
}

const deposit = async (req, res) => {
    const id = req.user._id
    var { amount } = req.body
    amount = Math.abs(amount)

    const user = await User.findById(id)
    if (!user) {
        throw new BadRequestError("please send correct id")
    }
    const newBal = user.balance + amount
    await User.findByIdAndUpdate(id, { balance: newBal })

    const transaction = await Transaction.create({ from: id, to: id, amount: amount });
    //await 
    depositEmail(transaction, user)

    res.status(StatusCodes.OK).json({ bal: newBal })
}

const withdraw = async (req, res) => {
    const id = req.user._id
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

    const transaction = await Transaction.create({ from: id, to: id, amount: -amount });
    //await 
    withdrawEmail(transaction, user)

    res.status(StatusCodes.OK).json({ bal: newBal})

}

const balance = async (req, res) => {
    const id = req.user._id
    const user = await User.findById(id)
    const bal = user.balance
    res.status(StatusCodes.OK).json({bal: bal})
}

const TransactionHistory = async (req, res) => {
    const id = req.user._id
    var {page, limit} = req.query
    if(!limit) limit = 10
    if(!page) page = 1
    page = parseInt(page)
    limit = parseInt(limit)
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
    }).select('to from amount createdAt').sort({ "createdAt": -1}).skip((page - 1) * limit).limit(limit)

    const all = await Transaction.find({
        $or:
            [
                { from: id },
                { to: id }
            ]
    })
    res.status(StatusCodes.OK).json({len: all.length, his})

}
module.exports = { transfer, deposit, withdraw, TransactionHistory, balance}