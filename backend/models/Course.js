const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId: mongoose.Schema.Types.ObjectId
});

const Course = mongoose.model('course',courseSchema);

module.exports = Course;