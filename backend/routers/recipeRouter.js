const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeController')
const upload = require("../upload");
const authMiddleware = require('../middleware/authMiddleware')

router.post('/recipe', authMiddleware, upload.single('image'), controller.create)
router.get('/recipe',controller.getRecipes)
router.get('/recipe/:id', authMiddleware, controller.getRecipe)
router.delete('/recipe/:id', controller.deleteRecipe)
router.put('/recipe/:id', controller.updateRecipe)

module.exports = router
