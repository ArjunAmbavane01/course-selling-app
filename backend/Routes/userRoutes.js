const express = require('express');
require('dotenv').config();
const {z} = require('zod');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
// import auth middleware

const router = express.Router();

router.post('/signup',async (req,res)=>{
    const {email , password} = req.body;
    const reqBody = z.object({
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
        const hashedPassword = await bcrypt.hash(password,5);
        await User.create({
            email,
            password: hashedPassword,
            purchasedCourses:[]
        })

        return res.status(200).json({
            type:"success",
            message:"User Signup Successfull"
        })

    } catch(e){
        return res.status(500).json({
            type:"error",
            message:"User Signup Failed",
            error: e
        })
    }
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    const reqBody = z.object({
        email: z.string().email()
    })

    const reqParse = reqBody.safeParse(req.body);
    if(!reqParse.success){
        return res.status(400).json({
            type: "error",
            message:"Invalid user email format",
            errors: reqParse.error.errors
        })
    }

    try{
        const user = User.findOne({email});
        if(user){
            const isPassTrue = bcrypt.compare(password,user.password)
            if(isPassTrue){
                const token = jwt.sign({user:user.email}, process.env.JWT_SECRETKEY)
                return res.status(200).json({
                    type:"success",
                    message:"User Signin Successfull",
                    token
                })
            }
            else{
                return res.status(401).json({
                    type:"error",
                    message:"Invalid Credentials"
                })
            }
        }
        else {
            return res.status(404).json({
                type:"error",
                message:"User not found"
            })
        }
    } catch(e){
        return res.status(500).json({
            type:"error",
            message:"User Signin Failed",
            error: e
        })
    }
})

// router.get('/me',auth,(req,res)=>{
// })