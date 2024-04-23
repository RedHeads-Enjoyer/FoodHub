const Router = require('express')
const router = new Router()
const controller = require('../controllers/roleController')

router.post('/role', controller.create)
router.get('/role', controller.getAll)
router.get('/role/:id', controller.getOneById)
router.delete('/role/:id', controller.deleteById)
router.put('/role/:id', controller.updateById)

module.exports = router
