const mongoose = require('mongoose')

let ForgotPasswordOTPSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    OTP: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Number,
        required: true
    }
},    { timestamps: true },
)

module.exports = mongoose.model('ForgotPasswordOTP', ForgotPasswordOTPSchema)
