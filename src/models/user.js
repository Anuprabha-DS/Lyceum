const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{type:String,required: true,trim: true,unique:true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']},
    password: {type: String,required: true,minlength: [6, 'Password must be at least 6 characters']},
    active: {type: Boolean,default: true},
    lastLogin: {type: Date,default: null},
    mustChangePassword: {
        type: Boolean,
        default: false // Default to false for general users
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const User = mongoose.model('User',userSchema)
module.exports = User
