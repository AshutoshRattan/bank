const User = require('../models/User')
const Transaction = require('../models/transactions')
const { StatusCodes, OK } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

// const transactions = async (req, res) => {
//     const id = req.params.id
//     let limit = req.query.limit || 10
//     limit = parseInt(limit)
//     const transactions = await Transaction.find({
//         $or:
//             [
//                 { from: id },
//                 { to: id }
//             ]
//     }).select('to from amount createdAt').sort({ "createdAt": -1 }).limit(limit)

//     res.status(StatusCodes.OK).json({ len: transactions.length, transactions })

// }

const transactions = async (req, res) => {
    let {page, limit, id} = req.query
    let queryObject = {}

    if(!limit){
        limit = 10
    }
    if(!page){
        page = 1
    }
    if (id) {
        queryObject.$or = [
            
            {from: id},
            {to: id}
        ]
    } 
    let all = await Transaction.find(queryObject)
    const transactions = await Transaction.find(queryObject).select('to from amount createdAt').sort({ "createdAt": -1 }).skip((page - 1) * limit).limit(limit)

    res.status(StatusCodes.OK).json({ len: all.length, his:transactions})
}

const makeAdmin = async (req, res) => {
    const id = req.body.id
    const user = await User.findByIdAndUpdate(id, { role: "admin" }).select('name, email')
    if (!user) throw new BadRequestError("user with that id dosent exist")
    res.status(StatusCodes.OK).json({ "message": "done" })
}

module.exports = { transactions, makeAdmin }