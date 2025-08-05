import express from 'express'
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js'
const userRouter = express();

import { registerUser, loginUser, getProfile, updateProfile} from '../controllers/userController.js';

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)


export default userRouter


// {
//     "name" : "hjvdjd",
//     "email" : "ghdfj@gmail.com",
//     "password" : "12345678910"
// }