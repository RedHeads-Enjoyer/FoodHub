const RecipeType = require('../models/RecipeType')
const jwt = require("jsonwebtoken");
const {secret} = require("../config");

class recipeTypeController {
    async create(req, res) {
        try {
            const {name} = req.body
            const authorId = req.user.id

            const candidate = await RecipeType.findOne({name})
            if (candidate) {
                return res.status(201).json({message: "Тип блюда с таким названием уже сущствует", object: candidate})
            }

            const recipeType = new RecipeType({name, authorId})
            await recipeType.save()
            return res.json({message: "Тип блюда успешно добавлен", object: recipeType})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Ошибка во время добавления типа блюда'})
        }
    }

    async getAll(req, res) {
        try {
            const recipeType = await RecipeType.find()
            res.json(recipeType)
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении типа блюда" });
        }
    }

    async getOneById(req, res) {
        const {id} = req.params
        try {
            const recipeType = await RecipeType.findById(id)
            if (!recipeType) {
                return res.status(404).json({ message: "Тип блюда не найден" });
            }
            return res.json(recipeType);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении типа блюда" });
        }
    }


    async deleteById(req, res) {
        const { id } = req.params;
        try {
            const recipeType = await RecipeType.findById(id);
            if (!recipeType) {
                return res.status(404).json({ message: "Тип блюда не найден" });
            }
            await RecipeType.findByIdAndDelete(id);
            return res.status(200).json({ message: "Тип блюда успешно удален" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Ошибка при удалении типа блюда" });
        }
    }

    async updateById(req, res) {
        const {id} = req.params
        const updatedFields = req.body
        try {
            const recipeType = await RecipeType.findById(id)
            if (!recipeType) {
                return res.status(404).json({ message: "тип блдюда не найден" });
            }
            Object.assign(recipeType, updatedFields)
            await recipeType.save()
            return res.json({ message: "Тип блюда успешно обновлен", recipeType });
        } catch (e) {
            res.status(500).json({ message: "Ошибка при обновлении типа блюда" });
        }
    }
}

module.exports = new recipeTypeController()