const Students = require('../models/students')
const User = require('../models/user')
const Attendance = require('../models/attendance')


exports.studAttendance = async(req,res)=>{
    try{
        const {studId} = req.body
        if (!studId) {
            return res.status(400).json({ message: "Student ID is required" });
        }
        const studData = await Students.findOne({_id:studId,active:true})
        if(!studData){
            return res.status(400).json({ message: "Student not found" });
        }
        const now = new Date();
        const date = now.toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const time = now.toTimeString().split(" ")[0].slice(0, 5); // Get current time in HH:mm format
        let attendance = await Attendance.findOne({studentId: studId, date: date });
        if (!attendance) {
            attendance = new Attendance({ date, checkIn: [time], checkOut: [] , studentId:studId});
        } else {
            if (attendance.checkIn.length === attendance.checkOut.length) {
                attendance.checkIn.push(time);
            } else {
                attendance.checkOut.push(time);
            }
        }
        await attendance.save();
        res.status(201).json({ message: "Attendance marked successfully", attendance });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.viewAttendance = async(req,res)=>{
    try{
        const now = new Date();
        const todayDate = now.toISOString().split("T")[0];
        const AttendanceData = await Attendance.find({date:todayDate})
        if(AttendanceData.length === 0 ){
            return res.status(400).json({ message: "Attendance not found" });
        }
        res.status(200).json({
            success: true,
            data: AttendanceData,
            message: 'All data retrieved successfully.'})
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.attendanceById = async(req,res)=>{
    try{
        const studId = req.params.id
        const now = new Date();
        const todayDate = now.toISOString().split("T")[0];
        const AttendanceData = await Attendance.findOne({date:todayDate,studentId:studId})
        if(!AttendanceData){
            return res.status(400).json({ message: "Attendance not found" });
        }
        res.status(200).json({
            success: true,
            data: AttendanceData,
            message: 'All data retrieved successfully.'})
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}