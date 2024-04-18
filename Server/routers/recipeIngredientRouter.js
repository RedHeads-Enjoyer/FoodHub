const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeIngredientController')
const roleMiddleware = require('../middleware/roleMiddleware')
const ownerMiddleware = require('../middleware/ownerMiddleware')

router.post('/ingredients', controller.create)
// router.get('/ingredients', roleMiddleware(['admin']), controller.getRecipeIngredients)
router.get('/ingredients', controller.getAll)
router.get('/ingredients/:id', controller.getOneById)
// router.delete('/ingredients/:id', ownerMiddleware(['admin']), controller.deleteUser)
router.delete('/ingredients/:id', controller.deleteById)
// router.put('/ingredients/:id', ownerMiddleware(['admin']), controller.updateUser)
router.put('/ingredients/:id', controller.updateById)

module.exports = router
