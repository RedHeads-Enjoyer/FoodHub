const {Schema, model} = require('mongoose')

const User = new Schema({
    image: {type: String, required: false, default: ""},
    username: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'role'}],
    history: [{
        id: {type: String, ref: 'recipe', required: true},
        addedAt: {type: Date, default: Date.now, expires: '30d'}
    }],
    rated: [{
        id: {type: String, ref: 'recipe', required: true},
        rate: {type: Number, required: true}
    }]
})

module.exports = model('user', User)