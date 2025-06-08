const express = require('express')
const {auth}= require('../middleware/userMiddleware')
const {createAdmin, login, changePassword, createClass, viewClass} = require('../controller/userController')
const {createStudent, viewAllStudents, viewStudentById , studUpdate, studDelete} = require('../controller/studentController')
const {studAttendance, viewAttendance, attendanceById} = require('../controller/attendanceController')
const router = express.Router()

router.post('/addAdmin',createAdmin)
router.post('/login',login)
router.post('/addClass',auth,createClass,)
router.get('/showAllClass',auth,viewClass)
router.post('/addStudent',auth,createStudent)
router.get('/showAllStudents',auth,viewAllStudents)
router.get('/showStudent/:id',auth,viewStudentById)
router.put("/updateStudent/:id",auth,studUpdate);
router.delete("/deleteStudent/:id",auth,studDelete);
router.post('/attendance',auth,studAttendance)
router.get('/showAttendance',auth,viewAttendance)
router.get('/viewAttendanceById/:id',auth,attendanceById)

module.exports = router



