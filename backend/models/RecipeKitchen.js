const {Schema, model} = require('mongoose')

const RecipeKitchen = new Schema({
    name: {type: String, required: true, unique: true},
    createdAt: {type: Date, default: Date.now(), immutable: true},
    authorId: {type: Schema.Types.ObjectId, ref: 'user', required: true, immutable: true},
    isActive: {type: Boolean, default: false}
})

module.exports = model('recipe_kitchen', RecipeKitchen)