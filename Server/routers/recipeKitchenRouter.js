const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeKitchenController')

router.post('/kitchen', controller.create)
router.get('/kitchen', controller.getAll)
router.get('/kitchen/:id', controller.getOneById)
router.delete('/kitchen/:id', controller.deleteById)
router.put('/kitchen/:id', controller.updateById)

module.exports = router
