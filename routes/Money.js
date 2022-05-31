const express = require('express')
const auth = require('../middleware/authentication.js')
const router = express.Router()
const {transfer, deposit, withdraw, TransactionHistory} = require('../controllers/Money')
router.route('/transfer').post(auth, transfer)
router.route('/deposit').post(auth, deposit)
router.route('/withdraw').post(auth, withdraw)
router.route('/transactions').get(auth, TransactionHistory)
module.exports = router