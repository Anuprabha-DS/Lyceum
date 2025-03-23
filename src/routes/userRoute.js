const express = require('express')
const {auth}= require('../middleware/userMiddleware')
const {createAdmin, login, changePassword, createClass, viewClass} = require('../controller/userController')
const {createStudent, viewAllStudents, viewStudentById} = require('../controller/studentController')
const router = express.Router()

router.post('/addAdmin',createAdmin)
router.post('/login',login)
router.post('/addClass',auth,createClass,)
router.get('/showAllClass',auth,viewClass)
router.post('/addStudent',auth,createStudent)
router.get('/showAllStudents',auth,viewAllStudents)
router.get('/showStudent/:id',auth,viewStudentById)





module.exports = router