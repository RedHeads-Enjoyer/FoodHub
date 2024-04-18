const {Schema, model} = require('mongoose')

const RecipeComment = new Schema({
    description: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), immutable: true},


})

module.exports = model('RecipeComment', RecipeComment)