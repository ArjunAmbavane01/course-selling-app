const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    username:String,
    password:String,
})

const Admin = mongoose.model('admin',adminSchema);

module.exports = Admin;