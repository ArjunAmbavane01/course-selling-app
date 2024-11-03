const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email:{
        type: String,
        unique: true
    },
    password: String,
    purchasedCourses : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const User = mongoose.model('user',userSchema);

module.exports = User;