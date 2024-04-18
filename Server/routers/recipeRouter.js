const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeController')

router.post('/recipe', controller.create)
router.get('/recipe', controller.getRecipes)
router.get('/recipe/:id', controller.getRecipe)
router.delete('/recipe/:id', controller.deleteRecipe)
router.put('/recipe/:id', controller.updateRecipe)

module.exports = router
