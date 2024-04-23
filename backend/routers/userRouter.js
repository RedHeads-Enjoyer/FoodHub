const Router = require('express')
const router = new Router()
const controller = require('../controllers/userController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const ownerMiddleware = require('../middleware/ownerMiddleware')
const upload = require("../upload");


router.put('/users/:id', [
    check('username', 'Имя пользователя должено содежать от 8 до 16 символов').isLength({min: 3, max: 16}),
    check('password', "Пароль должен содежать от 8 до 16 символов").isLength({min: 8, max: 16}),
])

router.get('/user', controller.getAll)
router.get('/user/me', authMiddleware,controller.getMe)
router.get('/user/:id', controller.getOneById)
router.delete('/user/:id', ownerMiddleware(['admin']), controller.deleteById)
router.put('/user/:id', upload.single('image'), controller.updateById)


module.exports = router
