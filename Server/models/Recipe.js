const {Schema, model} = require('mongoose')

const Recipe = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: Buffer, required: true},
    views: {type: Number, default: 0},
    rating: {type: Number, default: 0},
    votes: {type: Number, default: 0},
    difficult: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now(), immutable: true},
    authorID: {type: Schema.Types.ObjectId, ref: 'User', immutable: true},
    ingredients: [{
        ingredientID: { type: Schema.Types.ObjectId, ref: 'RecipeIngredient', required: true },
        quantity: { type: Number, required: true }
    }],
    kitchenID: {type: Schema.Types.ObjectId, ref: 'RecipeIngredient', required: true},
    typeID: {type: Schema.Types.ObjectId, ref: 'RecipeType', required: true},
    equipment: [{type: Schema.Types.ObjectId, ref: 'RecipeEquipment', required: true}],
    // steps: [{
    //     description: { type: String, required: true },
    //     duration: { type: Number, required: true}
    // }],
})

module.exports = model('Recipe', Recipe)