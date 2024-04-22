const Router = require('express')
const router = new Router()
const controller = require('../controllers/iamgeController')

router.get('/image/:name', controller.getOneByName)

module.exports = router
