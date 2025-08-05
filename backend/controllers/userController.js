import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../mdels/userModel.js";

import { v2 as cloudinary } from 'cloudinary'




// API to register user
const registerUser  = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // ✅ Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already registered with this email" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token , message: "Register successful !!!!"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.json({success:false, message:"Missing details !!"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Enter valid email !!"})
        }

        const user = await userModel.findOne({ email })

        const isMatch = await bcrypt.compare(password,user.password)
        
        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            // console.log("yessss");
            // console.log(token);
            
            
            return res.json({success:true, token, message:"Succeful logined !!"})
        }else{
            return res.json({success:false,message:"Invalid credentials !!"})
        }
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}


// API to get user profile data
const getProfile = async (req, res) => {

    try {
        // const { userId } = req.body
        const userId = req.userId;
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file // multer puts the file here

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });

            const imageURL = imageUpload.secure_url;

            updatedUser.image = imageURL;
            await updatedUser.save();
        }

        res.json({ success: true, message: 'Profile Updated Successfull !!' })

    } catch (error) {
        console.error("Error updating profile:", error);
        res.json({ success: false, message: error.message });
    }
}


export{
registerUser,
loginUser,
getProfile,
updateProfile,

}
