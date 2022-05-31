const User = require('../models/User')
const Transaction = require('../models/transactions')
const { StatusCodes, OK } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const transactions = async (req, res) => {
    const id = req.params.id
    var limit = req.query.limit || 10
    limit = parseInt(limit)
    const transactions = await Transaction.find({
        $or:
            [
                { from: id },
                { to: id }
            ]
    }).select('to from amount createdAt').sort({ "createdAt": -1 }).limit(limit)

    res.status(StatusCodes.OK).json({ len: transactions.length, transactions})
    
}

const allTransactions = async (req, res) => {
    var limit = req.query.limit || 50
    limit = parseInt(limit)
    const transactions = await Transaction.find({}).select('to from amount createdAt').sort({ "createdAt": -1 }).limit(limit)

    res.status(StatusCodes.OK).json({ len: transactions.length, transactions })
}

const makeAdmin = async (req, res) => {
    const id = req.body.id
    const user = await User.findByIdAndUpdate(id, {role: "admin"}).select('name, email')
    if(!user) throw new BadRequestError("user with that id dosent exist")
    res.status(StatusCodes.OK).json({"message": "done"})
}

module.exports = { transactions, allTransactions, makeAdmin}