const express = require('express');
const User = require('../models/User');
const {z} = require('zod');

const router = express.Router();

router.post('/signup',async (req,res)=>{
    const {username, email , password} = req.body;
    const reqBody = z.object({
        username: z.string().min(3).max(100),
        email: z.string().email(),
        password : z.string()
        .min(4, { message: "Password must be at least 4 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/\d/, { message: "Password must contain at least one number" })
    })

    const reqParse = reqBody.safeParse(req.body);
    if(!reqParse.success){
        return res.status(400).json({
            type: "error",
            message:"Invalid user data format",
            errors: reqParse.error.errors
        })
    }

    try{
        await User.create({
            username,
            email,
            password
        })

    } catch(e){
        res.status(500).json({
            type:"error",
            message:"User Signup Failed",
            error: e
        })
    }
    

})