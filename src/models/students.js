const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    admNo: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    guardianName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true, 
        match: [/^\d{10}$/, 'Invalid phone number format'] }, // Assuming 10-digit phone numbers
    address: { type: String, trim: true,default: null  },
    class: { type: String, required: true, trim: true },
    school: { type: String, trim: true ,default: null },
    photo: { type: String, required: false }, // URL or file path for the student's photo
    active: {type: Boolean,default: true},
    username: { type: String, default: false }, 
    password: { type: String, default: false }, 

}, { timestamps: true });

const Students = mongoose.model("Students", studentSchema);
module.exports = Students;
