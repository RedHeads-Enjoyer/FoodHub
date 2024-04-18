const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeEquipmentContoller')

router.post('/equipment', controller.create)
router.get('/equipment', controller.getAll)
router.get('/equipment/:id', controller.getOneById)
router.delete('/equipment/:id', controller.deleteById)
router.put('/equipment/:id', controller.updateById)

module.exports = router
