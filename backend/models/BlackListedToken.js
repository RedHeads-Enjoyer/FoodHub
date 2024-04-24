const {Schema, model} = require('mongoose')

const BlackListedToken = new Schema({
    token: {type: String, required: true},
    expireAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

BlackListedToken.index( { "expireAt": 1 }, { expireAfterSeconds: 0 } );

module.exports = model('black_listed_token', BlackListedToken)