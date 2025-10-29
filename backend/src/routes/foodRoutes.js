const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FoodModel = require('../model/foodmodel');
const User = require('../model/usermodel');
const FoodPartner = require('../model/foodpartner');
const {isLoggedIn}=require('../middleware/auth');
const {uploadFile} = require('../services/storageservices');
const Likes = require('../model/likesmodel');
const Saves = require('../model/savesmodel');

const foodRouter = express.Router();

// Configure multer for video uploads (memory storage for ImageKit)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    }
});

foodRouter.post('/add',isLoggedIn,upload.single('video'),async (req,res)=>{
    //check kro req .user se ki foundpartenr me wo id h ya nahi
    //sb field lo
    //check kro
    //db m add kro
    //success msg do

    try {
        // Identify the actor based on JWT role and fetch from the appropriate collection
        const { id: actorId, role } = req.user;
        let actor = null;
        let isPartner = false;

        if (role === 'seller') {
            actor = await User.findById(actorId);
            isPartner = !!actor;
        } else if (role === 'foodPartner') {
            actor = await FoodPartner.findById(actorId);
            isPartner = !!actor;
        }

        if (!actor) {
            return res.status(403).json({message:'User not found'});
        }

        if (!isPartner) {
            return res.status(403).json({message:'User is not a registered food partner.'});
        }

        const {name,description}=req.body;

        // Debug logging
        console.log('=== DEBUG INFO ===');
        console.log('Request body:', req.body);
        console.log('Request body keys:', Object.keys(req.body));
        console.log('Request headers:', req.headers);
        console.log('Name:', name);
        console.log('Description:', description);
        console.log('Video file:', req.file);
        console.log('Actor role:', role);
        console.log('==================');

        if(!name || !description){
            return res.status(400).json({message:'Name and description are required'});
        }

        // Check if video file was uploaded
        if(!req.file){
            return res.status(400).json({message:'Video file is required'});
        }

        // Upload video to ImageKit
        const fileName = `video-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;
        const uploadResult = await uploadFile(req.file.buffer, fileName);
        
        // Create food item with the user's ID as FoodPartner
        const foodItem=await FoodModel.create({
            name,
            description,
            video: uploadResult.url, // Store ImageKit URL instead of local path
            FoodPartner: actorId
        });
        
        return res.status(201).json({message:'Food item added successfully',foodItem});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Internal server error', error: error.message});
    }
});


//api routes for user to get the food items feed
foodRouter.get('/get',isLoggedIn,async (req,res)=>{
    try {
        // Allow both regular users (buyers) and food partners to view the feed
        const { role } = req.user || {}
        if (role !== 'buyer' && role !== 'foodPartner') {
            return res.status(403).json({ message: 'Access denied. Only users and food partners can view the food feed.' })
        }

        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get food items with pagination and populate food partner details
        const baseItems = await FoodModel.find()
            .populate('FoodPartner', 'name email phone address')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Enrich with like counts and whether current user liked
        const userId = req.user?.id;
        const foodItems = await Promise.all(baseItems.map(async (it) => {
            const [likeCount, userLike, saveCount, userSave] = await Promise.all([
                Likes.countDocuments({ foodId: it._id }),
                userId ? Likes.findOne({ foodId: it._id, userId }).lean() : null,
                Saves.countDocuments({ foodId: it._id }),
                userId ? Saves.findOne({ foodId: it._id, userId }).lean() : null,
            ]);
            return {
                ...it,
                likeCount,
                isLiked: !!userLike,
                saveCount,
                isSaved: !!userSave,
            };
        }));

        // Get total count for pagination info
        const totalItems = await FoodModel.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        return res.status(200).json({
            message: 'Food feed retrieved successfully',
            data: {
                foodItems,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });


       
        

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message:'Internal server error', error: error.message});
    }
})


//api route for user to like a food item
foodRouter.post('/like',isLoggedIn,async (req,res)=>{
    try {
        const {foodId}=req.body;
        const {id:userId}=req.user;

        const existingLike=await Likes.findOne({userId,foodId});
        if(existingLike){
          await Likes.findByIdAndDelete(existingLike._id);
          return res.status(200).json({message:'Food item unliked successfully',success:true});
        }
        const newLike=await Likes.create({userId,foodId});
        return res.status(201).json({message:'Food item liked successfully',newLike,success:true});
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message:'Internal server error', error: error.message,success:false});
    }
})

// api route for user to save/unsave a food item
foodRouter.post('/save',isLoggedIn,async (req,res)=>{
    try {
        const {foodId}=req.body;
        const {id:userId}=req.user;

        const existing = await Saves.findOne({userId,foodId});
        if(existing){
            await Saves.findByIdAndDelete(existing._id);
            return res.status(200).json({message:'Food item unsaved successfully',success:true});
        }
        const newSave = await Saves.create({userId,foodId});
        return res.status(201).json({message:'Food item saved successfully',newSave,success:true});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Internal server error', error: error.message,success:false});
    }
})

// api route to get saved items for current user
foodRouter.get('/saved',isLoggedIn,async (req,res)=>{
    try {
        const { id: userId } = req.user || {};

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const savedDocs = await Saves.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const foodIds = savedDocs.map(s => s.foodId);
        const foods = await FoodModel.find({ _id: { $in: foodIds } })
            .populate('FoodPartner', 'name email phone address')
            .sort({ createdAt: -1 })
            .lean();

        // Enrich with like/save state
        const foodItems = await Promise.all(foods.map(async (it) => {
            const [likeCount, userLike, saveCount] = await Promise.all([
                Likes.countDocuments({ foodId: it._id }),
                Likes.findOne({ foodId: it._id, userId }).lean(),
                Saves.countDocuments({ foodId: it._id }),
            ]);
            return {
                ...it,
                likeCount,
                isLiked: !!userLike,
                saveCount,
                isSaved: true,
            };
        }));

        const totalItems = await Saves.countDocuments({ userId });
        const totalPages = Math.ceil(totalItems / limit);

        return res.status(200).json({
            message: 'Saved feed retrieved successfully',
            data: {
                foodItems,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Internal server error', error: error.message});
    }
})

module.exports=foodRouter;