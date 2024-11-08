const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days
const { renameSync, unlinkSync } = require("fs");

const createToken = (email,userId) => {
    return jwt.sign({email, userId }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

exports.signup = async (req, res) => {
    try {
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        const {email,password,confirmPassword} = req.body;
        console.log(email,password,confirmPassword);

        //validate
        if (!email ||!password ||!confirmPassword ) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "user is already registered",
            });
        }

        // hash the password before saving it to the database
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } 
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing Password",
            });
        }

        // create the new user in the database
        const user = await User.create({email,password:hashedPassword});

        res.cookie("jwt", createToken(email,user.id),{maxAge, secure:true, sameSite:"None"})

        return res.status(201).json({
            success: true,
            message: "User is registred Sucessfully",
            user:{
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be Resistered, please try again later",
        });
    }
};

exports.login = async (req, res) => {
    try {
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        const {email, password} = req.body;
        console.log(email,password);
        
        // validate
        if (!email ||!password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password",
            });
        }
        
        res.cookie("jwt", createToken(email, user.id),{maxAge, secure:true, sameSite:"None"})
        
        return res.status(200).json({
            success: true,
            message: "User is logged in Sucessfully",
            user:{
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be logged in, please try again later",
        });
    }
}

exports.getUserInfo = async (req, res) => {
    try {
        // console.log("userId: ", req.userId);
        const userData = await User.findById(req.userId);
        if(!userData){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "User Info fetched successfully",
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be logged in, please try again later",
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        // console.log("userId: ", req.userId);
        const { userId } =req;
        const { firstName, lastName, color} = req.body;
        if(!firstName || !lastName){
            return res.status(400).json({
                success: false,
                message: "all data not found",
            })
        }

        const userData = await User.findByIdAndUpdate(
            userId, 
            {
                firstName,
                lastName,
                color,
                profileSetup: true,
            }, 
            {new:true, runValidators: true, }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated Sucessfully",
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be logged in, please try again later",
        });
    }
}

exports.addProfileImage = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "File is required",
            })
        }

        const date = Date.now();
        console.log({file: req.file});
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName);

        const updatedUser = await User.findOneAndUpdate(
            req.user,
            {image: fileName},
            {new: true},
            {runValidators: true, }
        );

        return res.status(200).json({
            success: true,
            message: "Profile photo added Sucessfully",
            image: updatedUser.image,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be logged in, please try again later",
        });
    }
}

exports.removeProfileImage = async (req, res) => {
    try {
        // console.log("userId: ", req.userId);
        const { userId } =req;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success: false,
                message: "user not found", 
            })
        }

        if(user.image){
            unlinkSync(user.image)
        }

        user.image = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile photo removed Sucessfully",
            
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be logged in, please try again later",
        });
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"})

        return res.status(200).json({
            success: true,
            message: "Logout Sucessfully",
            
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Logout Failed",
        });
    }
}
