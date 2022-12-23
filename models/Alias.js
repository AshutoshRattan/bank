const mongoose = require('mongoose')

let AliasSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    user2:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    alias:{
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: 20,
        minlength: 2,
    }
})

module.exports = mongoose.model('Alias', AliasSchema)
