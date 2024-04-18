const {Schema, model} = require('mongoose')

const Recipe = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    views: {type: Number, default: 0},
    duration: {type: Number, required: true},
    rating: {type: Number, default: 0},
    votes: {type: Number, default: 0},
    difficult: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now(), immutable: true},


    // comments: [{type: Object, ref: 'RecipeStep'}],

    ingredients: [{
        ingredient: { type: Schema.Types.ObjectId, ref: 'RecipeIngredient', required: true },
        quantity: { type: Number, required: true }
    }],
    kitchen: [{type: Schema.Types.ObjectId, ref: 'RecipeIngredient', required: true}],
    type: [{type: Schema.Types.ObjectId, ref: 'RecipeIngredient', required: true}],
    equipments: [{type: Schema.Types.ObjectId, ref: 'RecipeIngredient', required: true}],
    steps: [{type: Schema.Types.ObjectId, ref: 'RecipeStep', required: true}]




})

module.exports = model('Recipe', Recipe)