const Router = require('express')
const router = new Router()
const controller = require('../controllers/recipeTypeControlle')

router.post('/type', controller.create)
router.get('/type', controller.getAll)
router.get('/type/:id', controller.getOneById)
router.delete('/type/:id', controller.deleteById)
router.put('/type/:id', controller.updateById)

module.exports = router
