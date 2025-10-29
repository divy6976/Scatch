const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');

const foodPartnerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,  
    },
    restaurantName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,  
        unique:true,
    },
    phone:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },

   },{
    timestamps:true,
})

// Hash the password before saving the food partner model
foodPartnerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const FoodPartner=mongoose.model('FoodPartner',foodPartnerSchema);

module.exports=FoodPartner;