const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeIngredientController')
const roleMiddleware = require('../middleware/roleMiddleware')
const ownerMiddleware = require('../middleware/ownerMiddleware')

router.post('/ingredients', controller.create)
// router.get('/ingredients', roleMiddleware(['admin']), controller.getRecipeIngredients)
router.get('/ingredients', controller.getRecipeIngredients)
router.get('/ingredients/:id', controller.getRecipeIngredient)
// router.delete('/ingredients/:id', ownerMiddleware(['admin']), controller.deleteUser)
router.delete('/ingredients/:id', controller.deleteRecipeIngredient)
// router.put('/ingredients/:id', ownerMiddleware(['admin']), controller.updateUser)
router.put('/ingredients/:id', controller.updateRecipeIngredient)

module.exports = router
