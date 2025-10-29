require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const app = express();
const partnerRoutes = require('./routes/partnerRoutes');


connectDB();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173','http://localhost:5174'], // Frontend URL(s)
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




app.use('/api/v1',authRoutes);
app.use('/api/v1/foodpartner',authRoutes);
app.use('/api/v1/food',foodRoutes);
app.use('/api/v1/partner', partnerRoutes);




// // app.use((req,res)=>{
// //     res.send('Hello Divy');
// // })
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(6969, () => {
    console.log('Server is running on port 6969');
});