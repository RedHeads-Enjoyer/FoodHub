const RecipeEquipmentContoller = require('../models/RecipeEquipment')
const jwt = require("jsonwebtoken");
const {secret} = require("../config");

class recipeEquipmentController {
    async create(req, res) {
        try {
            const {name} = req.body
            const authorID = req.user._id
            const candidate = await RecipeEquipmentContoller.findOne({name})
            if (candidate) {
                return res.status(201).json({message: "Оборудование с таким названием уже сущствует", object: candidate})
            }

            const recipeEquipment = new RecipeEquipmentContoller({name, authorID})
            await recipeEquipment.save()
            return res.json({message: "Оборудование успешно добавлено", object: recipeEquipment})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Ошибка во время добавления оборудования'})
        }
    }

    async getAll(req, res) {
        try {
            const recipeEquipments = await RecipeEquipmentContoller.find()
            res.json(recipeEquipments)
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении оборудования" });
        }
    }

    async getOneById(req, res) {
        const {id} = req.params
        try {
            const recipeEquipment = await RecipeEquipmentContoller.findById(id)
            if (!recipeEquipment) {
                return res.status(404).json({ message: "Оборудование не найдено" });
            }
            return res.json(recipeEquipment);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении оборудования" });
        }
    }


    async deleteById(req, res) {
        const { id } = req.params;
        try {
            const recipeEquipment = await RecipeEquipmentContoller.findById(id);
            if (!recipeEquipment) {
                return res.status(404).json({ message: "Оборудование не найдено" });
            }
            await RecipeEquipmentContoller.findByIdAndDelete(id);
            return res.status(200).json({ message: "Оборудование успешно удалено" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Ошибка при удалении оборудования" });
        }
    }

    async updateById(req, res) {
        const {id} = req.params
        const updatedFields = req.body
        try {
            const recipeEquipment = await RecipeEquipmentContoller.findById(id)
            if (!recipeEquipment) {
                return res.status(404).json({ message: "Оборудование не найдена" });
            }
            Object.assign(recipeEquipment, updatedFields)
            await recipeEquipment.save()
            return res.json({ message: "Оборудование успешно обновлено", recipeEquipment });
        } catch (e) {
            res.status(500).json({ message: "Ошибка при обновлении оборудования" });
        }
    }
}

module.exports = new recipeEquipmentController()