const {Schema, model} = require('mongoose')

const User = new Schema({
    // image: {type: String, required: false, default: ""},
    username: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'role'}]
})

module.exports = model('user', User)