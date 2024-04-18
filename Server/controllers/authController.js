const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('../config')

const generateAccessToken = (id, roles, username) => {
    const payload = {
        id,
        roles,
        username
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка во время регистрации", errors})
            }
            const {username, email, password} = req.body
            const candidate = await User.findOne({email})
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким адресом электронной почты уже существует"})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: "user"})
            const user = new User({username, email,password: hashPassword, roles: [userRole.value]})
            await user.save()
            return res.json({message: "Пользователь успешно зарегестрирован"})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Ошибка во время регитсрации'})
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({message: "Пользователь с таким адресом электронной почты не найден"})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: "Неверно введен адрес элктронной почты или пароль"})
            }
            const token = generateAccessToken(user._id, user.roles, user.username)
            return res.json({token})

        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Ошибка во время авторизации'})
        }
    }

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

module.exports = new authController()