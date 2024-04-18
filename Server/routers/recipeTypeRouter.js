const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeTypeControlle')

router.post('/type', controller.create)
router.get('/type', controller.getRecipeTypes)
router.get('/type/:id', controller.getRecipeType)
router.delete('/type/:id', controller.deleteRecipeType)
router.put('/type/:id', controller.updateRecipeType)

module.exports = router
