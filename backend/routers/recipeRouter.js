const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeController')
const upload = require("../upload");
const authMiddleware = require('../middleware/authMiddleware')

router.post('/recipe', authMiddleware, upload.single('image'), controller.create)
router.get('/recipe',controller.getRecipes)
router.get('/recipe/:id', authMiddleware, controller.getRecipe)
router.get('/recipe_without_view/:id', authMiddleware,controller.getRecipeWithoutView)
router.delete('/recipe/:id', controller.deleteRecipe)
router.put('/recipe/:id', controller.updateRecipe)
router.put('/recipe/:id/rate', authMiddleware, controller.rateRecipe)

module.exports = router
