const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username :{
        type: String,
        require: [ true, "Username is required"],
        unique: [ true, "Username must be unique"]
    },
    email : {
        type: String,
        require: [ true, "Email is required"],
        unique: [ true, "Email must be unique"]
    },
    password: {
        type: String,
        required: [ true, "Password is required"],
        
    }
})
// TASK Master
// userSchema.pre("save", function(next){})
// userSchema.post("save", function(next){})


const userModel = mongoose.model("users", userSchema)

module.exports = userModel;