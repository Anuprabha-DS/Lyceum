const express = require('express')
const {auth}= require('../middleware/userMiddleware')
const {createAdmin, login, changePassword, createClass} = require('../controller/userController')
const router = express.Router()

router.post('/addAdmin',createAdmin)
router.post('/login',login)
router.post('/addClass',auth,createClass,)

module.exports = router