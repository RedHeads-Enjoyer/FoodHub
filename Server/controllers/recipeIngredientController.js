const RecipeIngredient = require('../models/RecipeIngredient')
const jwt = require("jsonwebtoken");
const {secret} = require("../config");

class recipeIngredientController {
    async create(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            const authorId = jwt.verify(token, secret).id

            const {name, calorieContent, isAdult} = req.body
            const candidate = await RecipeIngredient.findOne({name})
            if (candidate) {
                return res.status(400).json({message: "Ингредиент с таким названием уже сущствует"})
            }

            const recipeIngredient = new RecipeIngredient({name, calorieContent,isAdult, authorId})
            await recipeIngredient.save()
            return res.json({message: "Ингредиент успешно добавлен"})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Ошибка во время добавления ингредиента'})
        }
    }

    async getRecipeIngredients(req, res) {
        try {
            const recipeIngredients = await RecipeIngredient.find()
            res.json(recipeIngredients)
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении игредиентов" });
        }
    }

    async getRecipeIngredient(req, res) {
        const {id} = req.params
        try {
            const recipeIngredient = await RecipeIngredient.findById(id)
            if (!recipeIngredient) {
                return res.status(404).json({ message: "Ингредиент не найден" });
            }
            return res.json(recipeIngredient);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении ингредиента" });
        }
    }


    async deleteRecipeIngredient(req, res) {
        const { id } = req.params;
        try {
            const recipeIngredient = await RecipeIngredient.findById(id);
            if (!recipeIngredient) {
                return res.status(404).json({ message: "Ингредиент не найден" });
            }
            await RecipeIngredient.findByIdAndDelete(id);
            return res.status(200).json({ message: "Ингредиент успешно удален" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Ошибка при удалении ингредиента" });
        }
    }

    async updateRecipeIngredient(req, res) {
        const {id} = req.params
        const updatedFields = req.body
        try {
            const recipeIngredient = await RecipeIngredient.findById(id)
            if (!recipeIngredient) {
                return res.status(404).json({ message: "Ингредиент не найден" });
            }
            Object.assign(recipeIngredient, updatedFields)
            await recipeIngredient.save()
            return res.json({ message: "Ингредиент успешно обновлен", recipeIngredient });
        } catch (e) {
            res.status(500).json({ message: "Ошибка при обновлении ингредиента" });
        }
    }
}

module.exports = new recipeIngredientController()