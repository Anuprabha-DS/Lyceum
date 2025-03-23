const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const StudClass = require('../models/studClass')
const Students = require('../models/students')
const upload = require("../config/multerConfig");


exports.createStudent = async(req,res)=>{
    upload.single("storeImage")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try{
            const admimId = req.user._id
            const {admNo, name, guardianName, phoneNumber, address, className, school} = req.body

            if (!admNo || !name || !guardianName || !phoneNumber || !className ) {
                return res.status(400).json({ message: "Admission number, name, guardian name, phone number, and class are required." });
            }
            const existingStudent = await Students.findOne({admNo})
            if (existingStudent) {
                return res.status(400).json({ message: "Admission number already exists." });
            }
            
            const classData = await StudClass.findOne({class: className,active:true})
            if(!classData){
                return res.status(400).json({ message: "This class not existing." });
            }

            if (!/^\d{10}$/.test(phoneNumber)) {
                return res.status(400).json({ message: "Invalid phone number format. Must be 10 digits." });
            }
            const imageUrl = req.file ? req.file.path : undefined; 

            const newStudent = new Students({
                admNo,
                name,
                guardianName,
                phoneNumber,
                address: address || null,
                class: className, 
                school: school || null,
                photo: imageUrl 
            });

            await newStudent.save()
            res.status(201).json({ message: "Student added successfully", student: newStudent });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}


exports.viewAllStudents = async(req,res)=>{
    try{
        const studentsData = await Students.find({active:true})
        if(studentsData.length ===0){
            return res.status(400).json({message:"No students data found"})
        }
        res.status(200).json({
            success: true,
            data: studentsData,
            message: 'All students retrieved successfully.'
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
}


exports.viewStudentById = async(req,res)=>{
    try{
        const studId = req.params.id
        const studentData = await Students.findOne({_id:studId,active:true})
        if(!studentData){
            return res.status(400).json({message:"Student not found"})
        }
        res.status(200).json({
            success: true,
            data: studentData,
            message: 'All students retrieved successfully.'
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
}