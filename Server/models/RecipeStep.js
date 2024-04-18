const {Schema, model} = require('mongoose')

const RecipeStep = new Schema({
    description: {type: String, required: true},
    duration: {type: Number, required: true}
    // images: [{type: Image}]
})

module.exports = model('RecipeStep', RecipeStep)