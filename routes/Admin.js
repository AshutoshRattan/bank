const express = require('express')
const passport = require('passport')
const passportJWTAuth = require('../middleware/passport-jwt-auth')
const admin = require('../middleware/admin')
const router = express.Router()
const { transactions, allTransactions, makeAdmin} = require('../controllers/Admin')

router.route('/transactions/:id').get([passportJWTAuth, admin], transactions)
router.route('/allTransactions/').get([passportJWTAuth, admin], allTransactions)
router.route('/makeAdmin').post([passportJWTAuth, admin], makeAdmin)
module.exports = router