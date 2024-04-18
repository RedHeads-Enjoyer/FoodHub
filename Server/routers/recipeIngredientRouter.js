const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeIngredientController')
const roleMiddleware = require('../middleware/roleMiddleware')
const ownerMiddleware = require('../middleware/ownerMiddleware')

router.post('/ingredient', controller.create)
// router.get('/ingredients', roleMiddleware(['admin']), controller.getRecipeIngredients)
router.get('/ingredient', controller.getAll)
router.get('/ingredient/:id', controller.getOneById)
// router.delete('/ingredients/:id', ownerMiddleware(['admin']), controller.deleteUser)
router.delete('/ingredient/:id', controller.deleteById)
// router.put('/ingredients/:id', ownerMiddleware(['admin']), controller.updateUser)
router.put('/ingredient/:id', controller.updateById)

module.exports = router
