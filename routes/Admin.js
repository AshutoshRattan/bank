const express = require('express')
const passport = require('passport')
const passportJWTAuth = require('../middleware/passport-jwt-auth')
const admin = require('../middleware/admin')
const router = express.Router()
const { transactions, makeAdmin, users, addMoney} = require('../controllers/Admin')

router.route('/users').get([passportJWTAuth, admin], users)
router.route('/transactions/').get([passportJWTAuth, admin], transactions)
// router.route('/transactions').get([passportJWTAuth, admin], allTransactions)
router.route('/makeAdmin').post([passportJWTAuth, admin], makeAdmin)
router.route('/money').post([passportJWTAuth, admin], addMoney)
module.exports = router