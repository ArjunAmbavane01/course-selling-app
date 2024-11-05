const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');;
const Admin = require('../models/Admin');
const {z} = require('zod');

const router = express.Router();

router.post('/signup',async (req,res)=>{
    const{username,email,password} = req.body;
    const reqBody = z.object({
        username: z.string().min(3).max(100),
        email: z.string().email(),
        password: z.string()
        .min(4, { message: "Password must be at least 4 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/\d/, { message: "Password must contain at least one number" })
    });

    const reqParse = reqBody.safeParse(req.body);

    if(!reqParse.success){
        return res.status(400).json({
            type: "error",
            message:"Invalid admin data format",
            errors: reqParse.error.errors
        })
    }

    try{
        const hashedPassword = await bcrypt.hash(password,5);
        await Admin.create({
            username,
            email,
            password:hashedPassword
        });
        return res.status(200).json({
            type:"success",
            message:"Admin Signup Successfull"
        })

    } catch(e){
        return res.status(500).json({
            type:"error",
            message:"Admin Signup Failed",
            error: e
        })
    }
})

router.post('signin',async (req,res)=>{
    const {email,password} = req.body;

    const reqBody = z.object({
        email: z.string().email()
    })

    const reqParse = reqBody.safeParse(req.body);
    if(!reqParse.success){
        return res.status(400).json({
            type: "error",
            message:"Invalid admin email format",
            errors: reqParse.error.errors
        })
    }

    try{
        const admin = await Admin.findOne({email});
        if(admin){
            const isPassTrue = bcrypt.compare(password,admin.password);
            if(isPassTrue){
                const token = jwt.sign({user:admin[_id]},process.env.JWT_SECRETKEY);
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
        else{
            return res.status(404).json({
                type:"error",
                message:"Admin not found"
            })
        }
    } catch(e){
        return res.status(500).json({
            type:"error",
            message:"Admin Signin Failed",
            error: e
        })
    }
})