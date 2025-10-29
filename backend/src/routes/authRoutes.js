const express=require('express');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const User = require('../model/usermodel');
const {isLoggedIn} = require('../middleware/auth');

const authRouter=express.Router();

authRouter.post('/register',async (req,res)=>{
    //email pass lo
    // check kro email and pass valid
    //check in db exist or not
    //if alredy exist then say alreasy exist
    //if not then create new user
    //genertae token
    //send to user cookie
    //send succes full response

    const {name,email,password}=req.body;
    if(!email|| !name||!password){
        return res.status(400).json({message:'Name, email and password are required'});
    }
  

    try {
        const existinguser=await User.findOne({email});
        if(existinguser){
            return res.status(400).json({message:'User already exists'});
        }

        const user=await User.create({
            name,
            email,
            password
        })
    
        console.log(user);
        if(!user){
            return res.status(400).json({message:'Failed to create user'});
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT_SECRET not configured",
                success: false,
            });
        }

        const token = jwt.sign(
            { id: user._id, role: 'foodPartner' },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );
        console.log(token);
    
        // Set JWT token in cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        };
        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            message: "User registered successfully",
            success: true,
        });
    
    } catch (error) {
        res.status(400).json({
            message: "User not registered ",
            error,
            success: false,
          });
        
    }
});


authRouter.post('/login',async(req,res)=>{
    //user se email pass lo

    
    //check email exist or not
    //if not then tell to signup if yes 
    //if yes then generae token
    //send to user via cookie
    //send successfull response


    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({message:'Email and password are required'});
    }

    try {
      const user= await User.findOne({email}).select('+password');
      if(!user){
        return res.status(400).json({message:'User does not exist'});
      }
      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
        return res.status(400).json({message:'Invalid credentials'});
      }
     

          //
//datbase se user ata haui tb user._id ata hai
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: "JWT_SECRET not configured",
            success: false,
        });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      success: true,
    });


    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error,
            success: false,
          });
      
    }


})

authRouter.post('/user/logout',(req,res)=>{
  //logout krne ko clear the cookies
    try {
      res.clearCookie("token");
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) { 
        res.status(500).json({
            message: "Logout failed",
            error,
            success: false,
          });
      
    }


})

// Add logout route at root level for convenience
authRouter.post('/logout',(req,res)=>{
  //logout krne ko clear the cookies
    try {
      res.clearCookie("token");
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) { 
        res.status(500).json({
            message: "Logout failed",
            error,
            success: false,
          });
      
    }


})

// Food Partner Registration Route
authRouter.post('/foodpartner/register',async (req,res)=>{
    const FoodPartner = require('../model/foodpartner');
    
    const {name,restaurantName,email,phone,address,password}=req.body;
    if(!email|| !name||!restaurantName||!phone||!address||!password){
        return res.status(400).json({message:'Name, restaurant name, email, phone, address and password are required'});
    }
  
    try {
        const existinguser=await FoodPartner.findOne({email});
        if(existinguser){
            return res.status(400).json({message:'Food partner already exists'});
        }

        const user=await FoodPartner.create({
            name,
            restaurantName,
            email,
            phone,
            address,
            password
        })
    
        console.log(user);
        if(!user){
            return res.status(400).json({message:'Failed to create food partner'});
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT_SECRET not configured",
                success: false,
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );
        console.log(token);
    
        // Set JWT token in cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        };
        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            message: "Food partner registered successfully",
            success: true,
        });
    
    } catch (error) {
        res.status(400).json({
            message: "Food partner not registered ",
            error,
            success: false,
          });
        
    }
});

// Food Partner Login Route
authRouter.post('/foodpartner/login',async(req,res)=>{
    const FoodPartner = require('../model/foodpartner');
    
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({message:'Email and password are required'});
    }

    try {
      const user= await FoodPartner.findOne({email}).select('+password');
      if(!user){
        return res.status(400).json({message:'Food partner does not exist'});
      }

      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
        return res.status(400).json({message:'Invalid credentials'});
      }
     
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: "JWT_SECRET not configured",
            success: false,
        });
    }

    const token = jwt.sign(
      { id: user._id, role: 'foodPartner' },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Food partner login successful",
      success: true,
    });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error,
            success: false,
          });
      
    }
});

// Route to update user role to seller (for existing users)
authRouter.post('/update-to-seller', isLoggedIn, async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findByIdAndUpdate(
            userId, 
            { role: 'seller' }, 
            { new: true }
        );
        
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        
        res.status(200).json({
            message: "User role updated to seller successfully",
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user role",
            error: error.message
        });
    }
});

module.exports=authRouter;


