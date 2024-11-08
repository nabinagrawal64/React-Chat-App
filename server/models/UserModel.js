const mongoose = require("mongoose");
const {genSalt  , hash} = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required: false,
        },
        lastName:{
            type: String,
            required: false,
        },
        email:{
            type: String,
            required: [true, "Email is Required."],
            unique: true,
        },
        password:{
            type: String,
            required: [true, "Password is Required."],
        },
        image:{
            type: String,
            required: false,
        },
        color:{
            type: Number,
            required: false,
        },
        profileSetup:{
            type: Boolean,
            default: false,
        }, 
    }
)

userSchema.pre("save", async function(next){
    const salt = await genSalt();
    this.password = hash(this.password, salt);
    next()
})

const user = mongoose.model("User", userSchema);
module.exports = user ;