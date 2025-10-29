const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://divy:divy6976@cluster0.sxr53v7.mongodb.net/zomato-scroll?retryWrites=true&w=majority');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Database connection error:', error);
   
    }
};

module.exports = { connectDB };