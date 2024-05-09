const User = require('../models/User')
const Role = require('../models/Role')
const BlackListedToken = require('../models/BlackListedToken')
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
                return res.status(400).json({message: "Неверно введен адрес элктронной почты или пароль"})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: "Неверно введен адрес элктронной почты или пароль"})
            }
            const token = generateAccessToken(user._id, user.roles, user.username)
            return res.json({token: token})

        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Ошибка во время авторизации'})
        }
    }

    async logout(req, res) {
        try {
            const token = req.token
            const expireAt = new Date();
            expireAt.setHours(expireAt.getHours() + Number(24));
            const blackListedToken = new BlackListedToken({token, expireAt})
            await blackListedToken.save()
            res.clearCookie('token'); // Пример для куки
            return res.status(200).json({ message: "Вы успешно вышли из системы" });
        } catch (error) {
            res.status(500).send({ error: 'Internal server error' });
        }
    }

    async refresh(req, res) {
        const refreshToken = req.body.token;
        if (refreshToken == null) return res.sendStatus(401);
        try {
            const decoded = jwt.verify(refreshToken, secret);
            const user = await User.findById(decoded.id);
            const token = generateAccessToken(user.id, user.roles, user.username);
            res.cookie("token", token)
            res.json({token});
        } catch (error) {
            res.sendStatus(403)
        }
    }
}

module.exports = new authController()