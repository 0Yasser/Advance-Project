const { Router } = require('express')
const userController = require('../controllers/userController')
const {protect,authorize} = require('../middleware/auth');
const router = Router()


router.post('/auth/signup',userController.create_user)
router.post('/auth/login',userController.log_user)
router.put('/auth/forgot-password',userController.forgot_password)
router.put('/auth/reset-password/:token',userController.resetPassword)
router.get('/user',protect,userController.getUserData)
router.get('/nearbySearch/:coordinates',protect,userController.nearbySearch)


module.exports = router