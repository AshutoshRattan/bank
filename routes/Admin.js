const express = require('express')
const auth = require('../middleware/authentication.js')
const router = express.Router()
const { transactions, allTransactions, makeAdmin} = require('../controllers/Admin')

router.route('/transactions/:id').get(transactions)
router.route('/allTransactions/').get(allTransactions)
router.route('/makeAdmin').post(makeAdmin)
module.exports = router