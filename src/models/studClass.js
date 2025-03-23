const mongoose = require("mongoose")

const studClass =  new mongoose.Schema({
    class : { type: String, required: true },
    active: {type: Boolean,default: true},

}, { timestamps: true });

const StudClass = mongoose.model('StudClass', studClass)
module.exports = StudClass