const RecipeKitchen = require('../models/RecipeKitchen')
const jwt = require("jsonwebtoken");
const {secret} = require("../config");

class recipeTypeController {
    async create(req, res) {
        try {
            const {name} = req.body
            const authorId = req.user.id
            const candidate = await RecipeKitchen.findOne({name})
            if (candidate) {
                return res.status(400).json({message: "Кухня с таким названием уже сущствует"})
            }
            const recipeKitchen = new RecipeKitchen({name, authorId})
            await recipeKitchen.save()
            return res.json({message: "Кухная успешно добавлена", object: recipeKitchen})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Ошибка во время добавления кухни'})
        }
    }

    async getAll(req, res) {
        try {
            const recipeKitchens = await RecipeKitchen.find()
            res.json(recipeKitchens)
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении кухни" });
        }
    }

    async getOneById(req, res) {
        const {id} = req.params
        try {
            const recipeKitchens = await RecipeKitchen.findById(id)
            if (!recipeKitchens) {
                return res.status(404).json({ message: "Кухня не найдена" });
            }
            return res.json(recipeKitchens);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении кухни" });
        }
    }


    async deleteById(req, res) {
        const { id } = req.params;
        try {
            const recipeKitchens = await RecipeKitchen.findById(id);
            if (!recipeKitchens) {
                return res.status(404).json({ message: "Кухня не найден" });
            }
            await RecipeKitchen.findByIdAndDelete(id);
            return res.status(200).json({ message: "Кухня успешно удалена" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Ошибка при удалении кухни" });
        }
    }

    async updateById(req, res) {
        const {id} = req.params
        const updatedFields = req.body
        try {
            const recipeKitchens = await RecipeKitchen.findById(id)
            if (!recipeKitchens) {
                return res.status(404).json({ message: "Кухня не найдена" });
            }
            Object.assign(recipeKitchens, updatedFields)
            await recipeKitchens.save()
            return res.json({ message: "Кухня успешно обновлена", recipeKitchens });
        } catch (e) {
            res.status(500).json({ message: "Ошибка при обновлении кухни" });
        }
    }
}

module.exports = new recipeTypeController()