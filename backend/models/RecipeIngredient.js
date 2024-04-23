const {Schema, model} = require('mongoose')

const RecipeIngredient = new Schema({
    name: {type: String, required: true, unique: true},
    calorieContent: {type: Number, required: true},
    isAdult: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now(), immutable: true},
    authorId: {type: Schema.Types.ObjectId, ref: 'user', required: true, immutable: true},
    isActive: {type: Boolean, default: false}
})

module.exports = model('recipe_ingredient', RecipeIngredient)