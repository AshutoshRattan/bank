const express = require('express')
const router = express.Router()
const { createAccount, login } = require('../controllers/User')
router.post('/createAccount', createAccount)
router.post('/login', login)

module.exports = router
