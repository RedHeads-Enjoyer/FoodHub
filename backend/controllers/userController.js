const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('../config')
const Recipe = require("../models/Recipe");

class userController {
    async getAll(req, res) {
        try {
            const users = await User.find()
            res.json(users)

        } catch (e) {
            res.status(500).json({ message: "Ошибка при выводе пользователей" });
        }
    }

    async getOneById(req, res) {
        const {id} = req.params
        try {
            const user = await User.findById(id)
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            return res.json(user);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при выводе пользователя" });
        }
    }


    async deleteById(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            await User.findByIdAndDelete(id);
            return res.status(200).json({ message: "Пользователь успешно удален" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Ошибка при удалении пользователя" });
        }
    }

    async updateById(req, res) {
        const {id} = req.params
        const {name, description, difficult, ingredients, kitchenID, typeID, equipment, steps, authorID} = req.body;
        const image = req.file.filename; // Путь к загруженному файлу изображения
        const recipe = new Recipe({name, description, difficult, ingredients, kitchenID, typeID, equipment, steps, authorID, image});
        const updatedFields = req.body
        try {
            const user = await User.findById(id)
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            Object.assign(user, updatedFields)
            await user.save()
            return res.json({ message: "Пользователь успешно обновлен", user });
        } catch (e) {
            res.status(500).json({ message: "Ошибка при обновлении пользователя" });
        }
    }
}

module.exports = new userController()