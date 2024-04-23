const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('../config')
const Recipe = require("../models/Recipe");
const RecipeEquipmentContoller = require("../models/RecipeEquipment");

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
        const {username} = req.body;
        let updatedFields = {...req.body}
        if (req.file) {
            const image = req.file.filename;
            updatedFields = {...updatedFields, image}
        }
         // Путь к загруженному файлу изображения
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

    async getMe(req, res) {
        try {
            res.send(req.user);
        } catch (error) {
            res.status(500).send({message: "Ошибка при получнии данных о пользователе"});
        }
    }
}

module.exports = new userController()