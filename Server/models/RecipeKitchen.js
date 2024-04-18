const {Schema, model} = require('mongoose')

const RecipeKitchen = new Schema({
    name: {type: String, required: true, unique: true}
})

module.exports = model('RecipeKitchen', RecipeKitchen)