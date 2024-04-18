const {Schema, model} = require('mongoose')

const RecipeEquipment = new Schema({
    name: {type: String, required: true, unique: true}
})

module.exports = model('RecipeEquipment', RecipeEquipment)