const User = require('../models/User')
const Transaction = require('../models/transactions')
const  {transactionEmail, depositEmail, withdrawEmail} = require('../utils/index') 
const { StatusCodes, OK } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const queue = require('../configs/kue')

const depositWorker = require('../workers/deposit_worker')
const withdrawWorker = require('../workers/withdraw_worker')
const transactionWorker = require('../workers/transaction_worker')

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
    const users = {user1, user2}
    let job = queue.create('transactionEmail', { transaction, users}).save((err) => {
        if(err) console.log(err)
        console.log(job.id)
    })
    
    //await transactionEmail(transaction, {user1, user2})

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
    
    let job = queue.create('depositEmail', {transaction, user}).save((err) => {
        if (err) console.log(err)
        console.log(job.id)
    })

    //await depositEmail(transaction, user)

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
    
    let job = queue.create('withdrawEmail', { transaction, user }).save((err) => {
        if (err) console.log(err)
        console.log(job.id)
    })
    
    //await withdrawEmail(transaction, user)

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
module.exports = { transfer, deposit, withdraw, TransactionHistory, balance}