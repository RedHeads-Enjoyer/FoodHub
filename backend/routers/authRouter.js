const Router = require('express')
const router = new Router()
const controller = require('../controllers/authController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const ownerMiddleware = require('../middleware/ownerMiddleware')

router.post('/registration', [
    check('username', 'Имя пользователя должено содежать от 8 до 16 символов').isLength({min: 3, max: 16}),
    check('password', "Пароль должен содежать от 8 до 16 символов").isLength({min: 8, max: 16}),
    check('email', "Указан некорректный адрес электронной почты").isEmail()
])

router.put('/users/:id', [
    check('username', 'Имя пользователя должено содежать от 8 до 16 символов').isLength({min: 3, max: 16}),
    check('password', "Пароль должен содежать от 8 до 16 символов").isLength({min: 8, max: 16}),
])

router.post('/registration', controller.registration)
router.post('/login', controller.login)

module.exports = router
