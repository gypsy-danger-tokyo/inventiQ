const User = require("../models/User");// import User model
const bcrypt = require("bcryptjs");//import bcrypt library to hash passwords
const jwt = require("jsonwebtoken");
// REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });
        res.status(201).json({
            success:true,
            user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
            }});
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// LOGIN USER
const loginUser = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        console.log("EMAIL =", email);
        // Find user
        const user = await User.findOne({email});
        console.log("USER =", user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });
        }
        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        res.status(200).json({
            success:true,
            token,
            user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
            }});
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getProfile = async(req, res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            success:true, 
            user
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
const updateProfile = async(req, res)=>{
    try{
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                name:req.body.name, 
                email:req.body.email
            },
            {new : true}
        ).select("-password");
        res.status(200).json({
            success: true,
            user
        });
    }
    catch(error){
        res.status(500).json({
            success:false, 
            message:error.message
        });
    }
};
const changePassword = async(req, res)=>{
    try{
        const{
            oldPassword, 
            newPassword
        } = req.body;
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false, 
                message: "Old password incorrect"
            });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.status(200).json({
            success: true, 
            message:"Password Updated"
        });
    }
    catch(error){
        res.status(500).json({
            success:false, 
            message:error.message
        });
    }
};
module.exports = { 
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword
};