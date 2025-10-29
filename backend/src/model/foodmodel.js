const mongoose = require('mongoose');
const FoodPartner = require('./foodpartner');

const foodModelSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,
    },
    video:{
        type:String,    
        required:true,
    },
    FoodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FoodPartner',
        
    },
    likesCount:{
        type:Number,
        default:0,
    },

})

const FoodModel=mongoose.model('FoodModel',foodModelSchema);
module.exports=FoodModel;