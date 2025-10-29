const mongoose = require('mongoose');


const likesSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    foodId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FoodModel',
        required:true,
    },
},{
    timestamps:true,
})


const Likes=mongoose.model('Likes',likesSchema);
module.exports=Likes;