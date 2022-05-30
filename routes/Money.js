const express = require('express')
const auth = require('../middleware/authentication.js')
const router = express.Router()
const {transfer, deposit, withdraw} = require('../controllers/Money')
router.route('/transfer').post(auth, transfer)
router.route('/deposit').post(auth, deposit)
router.route('/withdraw').post(auth, withdraw)

module.exports = router