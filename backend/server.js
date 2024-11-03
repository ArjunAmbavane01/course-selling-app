const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const adminRoutes = require('./Routes/adminRoutes');
const userRoutes = require('./Routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = async()=>{
    await mongoose.connect(process.env.MONGO_URL);
}

try{
    connectDB();
} catch(e){
    console.log("Some error occurred while connecting to MongoDB ",e.mesage);
}

app.use(express.json());
app.use(cors());

app.use('/api/user',userRoutes);
app.use('/api/admin',adminRoutes);

app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
})