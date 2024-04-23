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
            return res.status(500).json({message: 'Ошибка во время регитсрации123', username, email, password})
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
            res.cookie("token", token)
            return res.json({token: token, _id: user._id})

        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Ошибка во время авторизации'})
        }
    }
}

module.exports = new authController()