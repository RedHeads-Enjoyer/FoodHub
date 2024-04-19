const {Schema, model} = require('mongoose')

const Recipe = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    // image: {type: String, required: true},
    views: {type: Number, default: 0},
    // duration: {type: Number, required: true},
    rating: {type: Number, default: 0},
    votes: {type: Number, default: 0},
    difficult: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now(), immutable: true},


    ingredients: [{
        ingredientID: { type: Schema.Types.ObjectId, ref: 'RecipeIngredient', required: true },
        quantity: { type: Number, required: true }
    }],
    // comments: [{type: Schema.Types.ObjectId, ref: 'RecipeComment', required: true}],
    kitchenID: {type: Schema.Types.ObjectId, ref: 'RecipeIngredient', required: true},
    typeID: {type: Schema.Types.ObjectId, ref: 'RecipeType', required: true},
    equipment: [{type: Schema.Types.ObjectId, ref: 'RecipeEquipment', required: true}],
    // steps: [{type: Schema.Types.ObjectId, ref: 'RecipeStep', required: true}]
})

module.exports = model('Recipe', Recipe)