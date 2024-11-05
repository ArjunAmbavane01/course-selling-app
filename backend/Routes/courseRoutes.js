const express = require('express');
const Course = require('../models/Course');
// import adminAuth

const router = express.Router();

router.get('/get-courses', async(req,res)=>{
    try{
        const courses = Course.find({});
        if(courses.length!=0){
            return res.status(200).json({
                type:"success",
                courses
            })
        }
        return res.status(200).json({
            type:"success",
            message:"No Courses are available"
        })
    } catch(e){
        return res.status(200).json({
            type:"error",
            message:"Error Fecthing Courses",
            error: e.message
        })
    }
})

router.post('/add-course',adminAuth,async (req,res)=>{
    // const adminEmail =  
})