const express = require('express')
const passport = require('passport')
const passportJWTAuth = require('../middleware/passport-jwt-auth')

const router = express.Router()
const { createAccount, login, createAlias, getAliases, forgotPasswordOTP} = require('../controllers/User')
router.post('/createAccount', createAccount)
router.post('/login', login)
router.post('/forgotPasswordOTP', forgotPasswordOTP)
router.post('/createAlias', passportJWTAuth, createAlias)
router.get('/getAliases', passportJWTAuth, getAliases)

module.exports = router
