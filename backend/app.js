// const express = require('express');
import express from'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from './routes/userRoute.js'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}))


app.use(express.json());
dotenv.config();

await connectDB();
connectCloudinary();

app.use("/api/user", userRouter)
// app.use("/api/admin", adminRouter)
// app.use("/api/doctor", doctorRouter)


app.get('/', (req, res) => {
  res.send('Hello !!!!!!');
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


