const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const StudClass = require('../models/studClass')

exports.createAdmin = async (req, res) => {
    try {
            const {email, password} = req.body
            if(!email||!password){
                return res.status(400).json({error:"required all field"})
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const user = new User({
                email,
                password: hashedPassword,
                mustChangePassword: true
            })
            await user.save()
            const token = jwt.sign(
                {id: user._id, email: user.email, role: user.role},
                process.env.JWT_SECRET
            )
            res.cookie('token', token, {httpOnly: true})
            res.json({
                message: "Admin created successfully",
                token,
            })
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

exports.login = async(req,res)=>{
    try{
        const {email,password}= req.body
        if(!email ||!password){
            return res.status(400).json({ error: 'All fields are required' });
        }
        const user = await User.findOne({email,active:true})
        if (!user || !user.active) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }
        if (user.mustChangePassword) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{ expiresIn: '3m' });
            return res.status(200).json({
                message: 'Password change required',
                requirePasswordChange: true,
                token
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{ expiresIn: '24h' });
        res.json({
            user: {
                _id: user._id,
                email: user.email,
            },
            token
        });

    }catch(error) {
        res.status(500).json({message: error.message})
    }
}

exports.changePassword = async(req,res)=>{
    try{
        const userId = req.user._id; 

        const { currentPassword, newPassword } = req.body;
        if(!currentPassword || !newPassword){
            return res.status(401).json({ error: 'Invalid login credentials' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        user.password = hashedPassword;
        if (user.mustChangePassword) {
            user.mustChangePassword = false;
        }

        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ 
            message: 'Password successfully updated',
            token
        });
    }catch(error) {
        res.status(500).json({message: error.message})
        
    }
}


exports.createClass = async(req,res)=>{
    try{
        adminId = req.user._id
        const {studClass} = req.body
        if(!studClass){
            return res.status(400).json({ error: 'All fields are required' });
        }

        const classExist = await StudClass.findOne({class:studClass,active:true})
        console.log(classExist);
        
        if(classExist){
            return res.status(400).json({ error: 'Class already exist' }); 
        }
        const newClass = new StudClass({
            class:studClass
        })
        await newClass.save()
        res.status(201).json({ 
            message: 'Class successfully added',
            newClass
        });

    }catch(error) {
        res.status(500).json({message: error.message})
    }
}

exports.viewClass = async(req,res)=>{
    try{
        const classData = await StudClass.find({active:true})
        if(classData.length === 0){
            return res.status(400).json({message:"No class found"})
        }
        const modifiedData = classData.map(item => ({
            _id: item._id,
            name: item.class,  
            active: item.active,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }));
        res.status(200).json({
            success: true,
            data: modifiedData,
            message: 'Class retrieved successfully.'
        });
        }catch(error){
        res.status(500).json({message: error.message})
    }
}


