const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    checkIn: [{ type: String, required: true }], 
    checkOut: [{ type: String, default:null }],
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Students", required: true },
}, { timestamps: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
