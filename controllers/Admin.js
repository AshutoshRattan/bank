const User = require('../models/User')
const Transaction = require('../models/transactions')
const { StatusCodes, OK } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const users = async (req, res) => {
    let { page, limit, query } = req.query
    let queryObject = {}

    if (!limit) {
        limit = 10
    }
    else {
        limit = parseInt(limit)
    }

    if (!page) {
        page = 1
    }
    else {
        page = parseInt(page)
    }

    if (query) {
        if (/^[a-fA-F0-9]{24}$/.test(query)){
            queryObject._id = query
        }
        else{
            queryObject.$or = [
    
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { role: { $regex: query, $options: 'i' } }
            ]
        }
    }

    let all = await User.find(queryObject)
    const users = await User.find(queryObject).select('name email _id role createdAt').sort({ "createdAt": -1 }).skip((page - 1) * limit).limit(limit)

    res.status(StatusCodes.OK).json({ len: all.length, list: users })
}

const transactions = async (req, res) => {
    console.log("in all")
    let {page, limit, id} = req.query // if i recive limit i get error
    /*
    error was due to limit being treated as str instead of int but somehow page was spared
    */
    let queryObject = {}
    console.log(req.query)
    if(!limit){
        limit = 10
    }
    else{
        limit = parseInt(limit)
    }
    if(!page){
        page = 1
    }
    else{
        page = parseInt(page)
    }
    if (id) {
        queryObject.$or = [
            
            {from: id},
            {to: id}
            // you can not use regex on ObjectId
            // https://stackoverflow.com/questions/29568350/query-mongodb-with-a-regex-expression-against-an-objectid
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

module.exports = { users, transactions, makeAdmin }