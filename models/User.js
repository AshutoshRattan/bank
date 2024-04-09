const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: 20,
        minlength: 2,
    },

    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },

    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },

    balance: {
        type: Number,
        default: 10000,
    },
    // add transaction history here
})

UserSchema.pre('save', async function () { // will run everytime it is changed so should i chech if password is modified

    /*
The pre('save') middleware in Mongoose will not run when you use the findByIdAndUpdate method to update a document. This middleware is specifically designed to run before the save() method is called on a Mongoose model instance.

The findByIdAndUpdate method is a convenience method for updating a document by its _id field and bypasses the pre('save') middleware. If you want to run custom logic before or after an update using findByIdAndUpdate, you can do so by using Mongoose's pre and post middleware for the update method, like this:
    */
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, name: this.name, role: this.role },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    )
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)
