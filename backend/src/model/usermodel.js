
const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,  
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    verificationToken: {
        type: String,
        required: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    role:{
        type:String,
        enum:['seller','buyer','admin'],
        default:'buyer',
    }

},{
    timestamps:true,
})

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
