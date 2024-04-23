const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeController')
const upload = require("../upload");

router.post('/recipe', upload.single('image'), controller.create)
router.get('/recipe', controller.getRecipes)
router.get('/recipe/:id', controller.getRecipe)
router.delete('/recipe/:id', controller.deleteRecipe)
router.put('/recipe/:id', controller.updateRecipe)

module.exports = router
